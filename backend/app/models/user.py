from datetime import datetime
from sqlalchemy import func, Column, DateTime
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    google_id: str | None = Field(default=None, index=True)
    email: str = Field(unique=True, index=True)
    full_name: str
    picture_url: str | None = Field(default=None)
    role: str = Field(default="student")
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
