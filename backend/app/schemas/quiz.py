from datetime import datetime
from pydantic import BaseModel
from typing import Any

class QuizSection(BaseModel):
    quiz_type: str
    question_count: int

class QuizRequest(BaseModel):
    topic: str | None = None
    question_count: int | None = None
    quiz_type: str | None = None
    sections: list[QuizSection] | None = None
    created_by_email: str | None = None
    source_type: str | None = None
    content_text: str | None = None
    file_base64: str | None = None
    file_mime_type: str | None = None
    file_name: str | None = None

class QuizSubmissionRequest(BaseModel):
    student_name: str
    student_email: str
    quiz_id: str
    topic: str
    score: float
    total_questions: int
    answers: list[dict[str, Any]]

class GradeAnswerRequest(BaseModel):
    question: str
    correct_answer: str
    user_answer: str
    quiz_type: str

class QuizSummaryResponse(BaseModel):
    id: str
    topic: str
    quiz_type: str
    question_count: int
    created_by_email: str | None
    created_at: datetime

class StudentQuestionResponse(BaseModel):
    question: str
    options: list[str] | list[dict[str, Any]] | None = None
    quiz_type: str
    section_name: str | None = None

class QuizDetailResponse(BaseModel):
    id: str
    topic: str
    quiz_type: str
    question_count: int
    created_by_email: str | None
    created_at: datetime
    questions: list[StudentQuestionResponse]
