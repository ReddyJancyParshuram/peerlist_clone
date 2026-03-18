import os

from fastapi import FastAPI, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text

import models, schemas, database

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)


def ensure_column(table_name: str, column_name: str, definition: str):
    if not str(database.SQLALCHEMY_DATABASE_URL).startswith("sqlite"):
        return

    with database.engine.begin() as connection:
        existing_columns = {
            row[1] for row in connection.execute(text(f"PRAGMA table_info({table_name})"))
        }
        if column_name not in existing_columns:
            connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}"))


ensure_column("users", "bio", "TEXT")
ensure_column("users", "location", "VARCHAR")
ensure_column("users", "created_at", "DATETIME")
ensure_column("jobs", "work_mode", "VARCHAR")

app = FastAPI()

# Auth config
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt import PyJWTError as JWTError
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status, Depends

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "peerlist_clone_secret_key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=1440)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError: # Will use standard jwt error based on pyjwt
        raise credentials_exception
    except Exception:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        title=user.title,
        avatar_url=user.avatar_url,
        bio=user.bio,
        location=user.location,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist. Please sign up.",
        )
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/posts", response_model=List[schemas.Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = db.query(models.Post).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    return posts

@app.post("/posts", response_model=schemas.Post)
def create_post(post: schemas.PostCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)): 
    db_post = models.Post(**post.dict(), author_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.post("/posts/{post_id}/like")
def toggle_like(post_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    existing_like = db.query(models.PostLike).filter(
        models.PostLike.post_id == post_id, 
        models.PostLike.user_id == current_user.id
    ).first()
    
    if existing_like:
        db.delete(existing_like)
        post.likes -= 1
        liked = False
    else:
        new_like = models.PostLike(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        post.likes += 1
        liked = True
        
    db.commit()
    return {"message": "Success", "liked": liked, "likes_count": post.likes}

@app.post("/posts/{post_id}/comments", response_model=schemas.Comment)
def create_comment(post_id: int, comment: schemas.CommentCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    db_comment = models.Comment(
        post_id=post_id,
        author_id=current_user.id,
        content=comment.content
    )
    db.add(db_comment)
    post.comments += 1
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.put("/users/me", response_model=schemas.User)
def update_users_me(
    profile: schemas.UserProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.full_name = profile.full_name
    current_user.bio = profile.bio
    current_user.location = profile.location
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users


def serialize_job(job: models.Job):
    skills = [skill.strip() for skill in (job.skills or "").split(",") if skill.strip()]
    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "experience": job.experience,
        "applyLink": job.apply_link,
        "aboutRole": job.about_role,
        "aboutOpportunity": job.about_opportunity,
        "companyWebsite": job.company_website,
        "workType": job.work_type,
        "workMode": job.work_mode,
        "primaryRole": job.primary_role,
        "skills": skills,
        "mustHaveSkills": skills,
        "created_at": job.created_at,
        "author_id": job.author_id,
    }


@app.get("/jobs", response_model=List[schemas.Job])
def read_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).order_by(models.Job.created_at.desc(), models.Job.id.desc()).all()
    return [serialize_job(job) for job in jobs]


@app.post("/jobs", response_model=schemas.Job)
def create_job(
    job: schemas.JobCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_job = models.Job(
        title=job.title,
        company=job.company,
        location=job.location,
        experience=job.experience,
        apply_link=job.applyLink,
        about_role=job.aboutRole,
        about_opportunity=job.aboutOpportunity,
        company_website=job.companyWebsite,
        work_type=job.workType,
        work_mode=job.workMode,
        primary_role=job.primaryRole,
        skills=", ".join(job.skills),
        author_id=current_user.id,
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return serialize_job(db_job)


@app.put("/jobs/{job_id}", response_model=schemas.Job)
def update_job(
    job_id: int,
    job: schemas.JobCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    if db_job.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to edit this job")

    db_job.title = job.title
    db_job.company = job.company
    db_job.location = job.location
    db_job.experience = job.experience
    db_job.apply_link = job.applyLink
    db_job.about_role = job.aboutRole
    db_job.about_opportunity = job.aboutOpportunity
    db_job.company_website = job.companyWebsite
    db_job.work_type = job.workType
    db_job.work_mode = job.workMode
    db_job.primary_role = job.primaryRole
    db_job.skills = ", ".join(job.skills)

    db.commit()
    db.refresh(db_job)
    return serialize_job(db_job)


@app.delete("/jobs/{job_id}", status_code=204)
def delete_job(
    job_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    if db_job.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this job")

    db.delete(db_job)
    db.commit()
    return Response(status_code=204)
