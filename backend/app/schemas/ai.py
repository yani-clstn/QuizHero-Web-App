from pydantic import BaseModel

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    user_name: str | None = None
    user_role: str | None = None
    context_topic: str | None = None

class GradeResult(BaseModel):
    is_correct: bool
    score: float | None = None
    feedback: str | None = None
