from pydantic import BaseModel

class GoogleAuthRequest(BaseModel):
    credential: str | None = None
    email: str | None = None
    name: str | None = None
    picture: str | None = None
    role: str | None = None
    is_simulation: bool = False

class UserResponse(BaseModel):
    id: int | None
    email: str
    full_name: str
    picture_url: str | None
    role: str
    token: str
