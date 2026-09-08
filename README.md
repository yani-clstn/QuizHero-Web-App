# Quiz Hero

Quiz Hero is an AI-powered study and assessment platform for CvSU-Imus students and faculty. It combines a Next.js frontend with a FastAPI backend to support quiz generation, AI-assisted question parsing, spaced repetition, and a hybrid study commons experience.

## Project Overview

This repository is a full-stack application with two main parts:

- **Frontend** — Next.js app for the user interface
- **Backend** — FastAPI service for authentication, quiz generation, persistence, and API logic

The project is currently under active development, and this repository was forked from the original source so it can be continued and expanded.

## Key Features

- Google OAuth login for `@cvsu.edu.ph` accounts
- AI-assisted question parsing using Gemini 1.5 Flash
- Study and assessment workflows
- Spaced repetition using the SM-2 algorithm
- Hybrid study commons for students and faculty
- Separate frontend and backend development workflow

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, TanStack Query, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, Python, SQLModel, Alembic, PostgreSQL, Google authentication, Gemini integration

## Repository Structure

```text
frontend/   # Next.js frontend application
backend/    # FastAPI backend application
start_all.bat
start_frontend.bat
start_backend.bat
start_frontend.ps1
start_backend.ps1
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.12+ or the Python version required by the backend environment
- PostgreSQL 16+
- npm
- uv

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

- http://localhost:3000

### Backend

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend runs at:

- http://127.0.0.1:8000

### Start Both on Windows

Use the helper scripts from the repository root:

```bat
start_all.bat
```

Or start each side separately:

```bat
start_backend.bat
start_frontend.bat
```

PowerShell equivalents are also available:

```powershell
./start_backend.ps1
./start_frontend.ps1
```

## Environment Variables

This project uses environment variables for secrets and service configuration. Create `.env` files as needed in the frontend and backend directories, and do not commit sensitive values.

Common values may include:

- Google OAuth credentials
- JWT secret
- Gemini API key
- Database connection string
- CORS settings

## Development Notes

- Keep frontend and backend changes separated by their respective folders.
- Use the existing architecture instead of rebuilding the app from scratch.
- Follow the project conventions already established in the codebase.

## Status

This project is still in development and may not yet contain all planned features.

## Acknowledgments

Originally developed by the source repository owner and continued here as a fork for final system requirement work.
