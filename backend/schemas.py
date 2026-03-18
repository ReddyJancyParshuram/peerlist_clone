from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    title: str
    avatar_url: str
    bio: Optional[str] = None
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(UserBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    full_name: str
    bio: Optional[str] = None
    location: Optional[str] = None

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post_id: int
    author_id: int
    created_at: datetime
    author: User

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    article_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    created_at: datetime
    likes: int
    comments: int
    shares: int
    author_id: int
    author: User
    comments_list: List[Comment] = []
    
    # To determine if current user liked it, we'll handle this in the frontend by checking likes_list if needed, or by a dedicated endpoint.
    
    class Config:
        from_attributes = True


class JobBase(BaseModel):
    title: str
    company: str
    location: str
    experience: Optional[str] = None
    applyLink: str
    aboutRole: str
    aboutOpportunity: Optional[str] = None
    companyWebsite: Optional[str] = None
    workType: Optional[str] = None
    workMode: Optional[str] = None
    primaryRole: Optional[str] = None
    skills: List[str] = []


class JobCreate(JobBase):
    pass


class Job(JobBase):
    id: int
    created_at: datetime
    author_id: int
    mustHaveSkills: List[str] = []

    class Config:
        from_attributes = True
