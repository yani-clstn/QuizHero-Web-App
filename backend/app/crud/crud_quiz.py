from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select
from app.models import Quiz


async def create_quiz(db: AsyncSession, quiz: Quiz) -> Quiz:
    db.add(quiz)
    await db.commit()
    await db.refresh(quiz)
    return quiz

async def get_quiz_by_id(db: AsyncSession, quiz_id: str) -> Quiz | None:
    from app.models import Question
    stmt = select(Quiz).where(Quiz.id == quiz_id).options(
        selectinload(Quiz.questions).selectinload(Question.options)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def list_quizzes(db: AsyncSession) -> list[Quiz]:
    result = await db.execute(select(Quiz).order_by(Quiz.created_at.desc()))
    return result.scalars().all()

async def delete_quiz(db: AsyncSession, quiz_id: str) -> bool:
    quiz = await get_quiz_by_id(db, quiz_id)
    if not quiz:
        return False
    await db.delete(quiz)
    await db.commit()
    return True
