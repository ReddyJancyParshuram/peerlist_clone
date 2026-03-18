import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

def seed_data():
    # Make sure we're using the right db file based on where the script is executed
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(models.User).first():
        print("Database already seeded!")
        return

    # 1. Create Mock Users
    from main import get_password_hash
    default_password = get_password_hash("password123")
    
    users = [
        models.User(
            username="oomkar", full_name="Omkar Khandalkar", title="Developer", 
            email="omkar@peerlist.io", hashed_password=default_password,
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=oomkar"
        ),
        models.User(
            username="ayushgairola", full_name="Ayush Gairola", title="Product Designer", 
            email="ayush@peerlist.io", hashed_password=default_password,
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=ayush"
        ),
        models.User(
            username="jancy", full_name="Jancy Parshuram Reddy", title="Software Engineer", 
            email="jancy@peerlist.io", hashed_password=default_password,
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=jancy"
        )
    ]
    
    db.add_all(users)
    db.commit()

    # Get user references
    jancy = db.query(models.User).filter_by(username="jancy").first()
    omkar = db.query(models.User).filter_by(username="oomkar").first()
    ayush = db.query(models.User).filter_by(username="ayushgairola").first()

    # 2. Create 10 Mock Posts
    posts = [
        models.Post(
            content="Engineering student to design judge at hackathon. Recently, I had the privilege of judging a competition at my engineering college. It was a proud moment for me, and the participants demonstrated immense effort in crafting their problem statements. Some of the solutions were truly impressive.",
            author_id=omkar.id, likes=42, comments=5, shares=2,
            image_url="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=600&auto=format&fit=crop"
        ),
        models.Post(
            content="Research what you should not what you can! This is going to be interesting. Seriously. We just shipped Analyst Mode on antinodeai.space, and it tackles the major pain points that most AI tools are completely ignoring.",
            author_id=ayush.id, likes=124, comments=18, shares=5
        ),
        models.Post(
            content="Just built an exact clone of Peerlist! It's amazing what you can do with React and FastAPI.",
            author_id=jancy.id, likes=300, comments=45, shares=12
        ),
        models.Post(
            content="What are the best open-source projects for beginners to contribute to this Hacktoberfest?",
            author_id=jancy.id, likes=15, comments=8, shares=1
        ),
        models.Post(
            content="I've been exploring Rust for the past few weeks and I am absolutely blown away by its performance characteristics. Also, the compiler error messages are essentially miniature tutorials.",
            author_id=omkar.id, likes=89, comments=22, shares=10
        ),
        models.Post(
            content="Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs",
            author_id=ayush.id, likes=200, comments=4, shares=15
        ),
        models.Post(
            content="Anyone attending React Conf next month? Let's connect and grab a coffee! ☕",
            author_id=jancy.id, likes=56, comments=12, shares=0
        ),
        models.Post(
            content="Just published a new blog post on 'Mastering FastAPI Middleware'. Check it out on my profile!",
            author_id=ayush.id, likes=45, comments=6, shares=3
        ),
        models.Post(
            content="The new Vite 5 update is incredibly fast. Build times have decreased by 30% for our latest project.",
            author_id=omkar.id, likes=112, comments=14, shares=25
        ),
        models.Post(
            content="Looking for a Senior Frontend Developer to join our team. Must have at least 5 years of experience with React and Tailwind CSS. DM for details.",
            author_id=ayush.id, likes=34, comments=2, shares=8
        )
    ]

    db.add_all(posts)
    db.commit()

    print("Successfully seeded 3 users and 10 posts!")

if __name__ == "__main__":
    seed_data()
