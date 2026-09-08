from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models import User


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def upsert_user(db: AsyncSession, email: str, full_name: str, picture_url: str | None, role: str, google_id: str | None) -> User:
    user = await get_user_by_email(db, email)
    if user:
        user.full_name = full_name
        user.picture_url = picture_url or user.picture_url
        user.role = role
        user.google_id = google_id or user.google_id
    else:
        user = User(
            email=email,
            full_name=full_name,
            picture_url=picture_url,
            role=role,
            google_id=google_id
        )
        db.add(user)
    
    await db.commit()
    await db.refresh(user)
    return user
