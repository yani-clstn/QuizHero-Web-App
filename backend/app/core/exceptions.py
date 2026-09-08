from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class QuizGenerationError(Exception):
    pass

class AIGradingError(Exception):
    pass

class AuthenticationError(Exception):
    pass

def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(QuizGenerationError)
    async def quiz_generation_exception_handler(request: Request, exc: QuizGenerationError) -> JSONResponse:
        return JSONResponse(status_code=500, content={"message": f"Quiz generation failed: {str(exc)}"})

    @app.exception_handler(AIGradingError)
    async def ai_grading_exception_handler(request: Request, exc: AIGradingError) -> JSONResponse:
        return JSONResponse(status_code=500, content={"message": f"AI grading failed: {str(exc)}"})

    @app.exception_handler(AuthenticationError)
    async def authentication_exception_handler(request: Request, exc: AuthenticationError) -> JSONResponse:
        return JSONResponse(status_code=401, content={"message": f"Authentication failed: {str(exc)}"})

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(status_code=500, content={"message": "Internal server error"})
