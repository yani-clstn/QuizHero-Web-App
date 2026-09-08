# AI Handoff — Quiz Hero

## Project Summary
Quiz Hero is a full-stack study and assessment platform for CvSU-Imus students and faculty. It combines a Next.js frontend with a FastAPI backend and includes AI-assisted quiz parsing, Google OAuth for `@cvsu.edu.ph` users, and spaced repetition learning support using SM-2.

This repository is a forked continuation of an in-progress app, so the main goal is to extend the existing structure rather than rebuild it from scratch.

## Current Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Framer Motion
- Tailwind CSS

### Backend
- FastAPI
- Python
- SQLModel
- Alembic
- PostgreSQL
- Google authentication libraries
- Gemini integration libraries

## Entry Points and Run Scripts

### Root scripts
- `start_all.bat` — starts both frontend and backend
- `start_frontend.bat` — starts only the frontend
- `start_backend.bat` — starts only the backend
- `start_frontend.ps1` — PowerShell frontend launcher
- `start_backend.ps1` — PowerShell backend launcher

### App locations
- `frontend/` — Next.js app
- `backend/` — FastAPI app

## Important Current Behavior
- The backend app starts from `backend/main.py`.
- The backend uses session middleware and CORS configuration from app settings.
- The root endpoint returns a simple status response.
- The frontend package scripts are defined in `frontend/package.json`.

## Development Guidance

### General
- Work within the current directory structure.
- Avoid rewriting the application architecture.
- Keep frontend and backend concerns separated.
- Prefer incremental improvements over large refactors.

### Frontend conventions
- Use TypeScript interfaces for props and state.
- Keep components typed and readable.
- Use React functional components.

### Backend conventions
- Use PEP 8 style.
- Keep business logic in services, not route handlers.
- Validate data with Pydantic schemas.
- Preserve async database behavior.

## Environment Notes

### Frontend
- Uses npm
- Development command: `npm run dev`

### Backend
- Uses Python/uv workflow
- Development command: `uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000`

## Existing Ignore Rules
- Python caches, virtual environments, and compiled artifacts are ignored.
- Node dependencies and Next.js build output are ignored.
- Environment files are ignored.
- IDE and OS-specific files are ignored.

## Suggested Next Tasks
1. Document setup instructions more fully in the root README.
2. Add or verify environment variable examples for both frontend and backend.
3. Confirm backend API routes and database migration workflow.
4. Add feature-level documentation for auth, quiz generation, and grading.
5. Standardize run scripts and local dev setup across Windows and PowerShell.

## Notes for Future Contributors
- This is a fork, so preserve useful upstream structure where possible.
- Treat the backend and frontend as separate bounded contexts.
- Avoid exposing secrets, API keys, or auth tokens in code.
- Do not remove answer key data from student-facing responses.
