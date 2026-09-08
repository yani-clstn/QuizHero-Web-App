import base64
import json
from datetime import datetime, timedelta, timezone
from typing import Any
import jwt
from app.core.config import settings

def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

def decode_google_jwt(token: str) -> dict[str, Any]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Invalid JWT format")
        payload = parts[1]
        padded_payload = payload + '=' * (-len(payload) % 4)
        decoded = base64.urlsafe_b64decode(padded_payload).decode("utf-8")
        return json.loads(decoded)
    except Exception as e:
        raise ValueError(f"Could not decode token: {str(e)}")

def derive_name_from_email(email: str) -> str:
    return email.split("@")[0].replace(".", " ").title()
