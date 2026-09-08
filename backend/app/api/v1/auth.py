from datetime import timedelta
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.auth import GoogleAuthRequest, UserResponse
from app.api.dependencies import get_db_session, get_current_user
from app.crud.crud_user import upsert_user
from app.core.security import decode_google_jwt, derive_name_from_email, create_access_token

router = APIRouter()
CVSU_DOMAIN = "@cvsu.edu.ph"

@router.post("/auth/google", response_model=UserResponse)
async def authenticate_google(
    request: GoogleAuthRequest, 
    db: AsyncSession = Depends(get_db_session)
):
    email = ""
    name = ""
    picture = ""
    google_id = None
    role = request.role if request.role in ("teacher", "student") else "student"

    if request.credential:
        payload = decode_google_jwt(request.credential)
        email = payload.get("email", "").strip().lower()
        name = payload.get("name", "").strip() or derive_name_from_email(email)
        picture = payload.get("picture", "")
        google_id = payload.get("sub", "")
    elif request.email:
        email = request.email.strip().lower()
        name = request.name.strip() if request.name else derive_name_from_email(email)
        picture = request.picture or f"https://api.dicebear.com/7.x/bottts/svg?seed={email}"
        google_id = f"cvsu_{email}"
    else:
        raise HTTPException(status_code=400, detail="Please provide a valid CvSU Google email address.")

    if not email.endswith(CVSU_DOMAIN):
        raise HTTPException(
            status_code=403,
            detail=f"Access restricted. Please use your official Cavite State University Google Account ({CVSU_DOMAIN}).",
        )

    user = await upsert_user(db, email, name, picture, role, google_id)

    access_token_expires = timedelta(minutes=60*24*7) # 7 days
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        picture_url=user.picture_url,
        role=user.role,
        token=access_token
    )

@router.get("/auth/me", response_model=UserResponse)
async def get_current_user_profile(current_user = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        picture_url=current_user.picture_url,
        role=current_user.role
    )
