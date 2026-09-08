from datetime import datetime
from typing import Any
from sqlalchemy import Column, DateTime, JSON, func
from sqlmodel import SQLModel, Field

class Submission(SQLModel, table=True):
    __tablename__ = "submissions"
    id: int | None = Field(default=None, primary_key=True)
    student_name: str
    student_email: str = Field(index=True)
    quiz_id: str = Field(index=True, foreign_key="quizzes.id")
    topic: str
    score: float
    total_questions: int
    percentage: float
    answers: list[dict[str, Any]] = Field(default=[], sa_column=Column(JSON))
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
