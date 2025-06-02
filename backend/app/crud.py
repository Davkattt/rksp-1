# CRUD operations will go here 

from sqlalchemy.future import select
from .models import User
from .auth import get_password_hash

async def get_user_by_email(db, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def create_user(db, user_create):
    hashed_password = get_password_hash(user_create.password)
    db_user = User(name=user_create.name, email=user_create.email, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user 