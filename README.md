# Peerlist Clone

A full-stack Peerlist-inspired website with a React frontend and FastAPI backend.

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy + SQLite
- Styling: CSS with light/dark mode support

## Project Structure

```text
peerlist-clone/
  backend/
  frontend/
```

## Prerequisites

- Node.js 18+
- npm
- Python 3.11+

## Backend Setup

```bash
cd backend
python -m pip install fastapi uvicorn sqlalchemy passlib[bcrypt] pyjwt python-multipart
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend runs at:

```text
http://127.0.0.1:8000
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite will automatically use another port like `5174`.

## Environment Variables

Frontend uses:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This is already configured in `frontend/.env`.

## Running the App

Start the backend first:

```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Then start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the frontend URL shown in the terminal.

## Features

- Authentication with sign up and sign in
- Feed and launchpad views
- Jobs board with create, edit, delete, save, and applied flows
- AI job search
- Profile page with editable details
- Dark mode with localStorage persistence

## Build

Frontend production build:

```bash
cd frontend
npm run build
```

## Notes

- SQLite database files are kept locally in `backend/` and are ignored by git
- Make sure the backend is running before using auth, jobs, or profile features
