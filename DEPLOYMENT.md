# Deployment Guide

This project is prepared for:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## 1. Deploy the Backend on Render

Create a new Web Service on Render and point it to this repository.

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Set these environment variables in Render:

- `DATABASE_URL` = your Neon connection string
- `SECRET_KEY` = any long random secret
- `CORS_ORIGINS` = your Vercel frontend URL, for example `https://peerlist-clone.vercel.app`

Health check endpoint:

```text
/health
```

## 2. Create a Free Neon Database

Create a PostgreSQL database in Neon and copy the connection string into Render as `DATABASE_URL`.

## 3. Deploy the Frontend on Vercel

Import this repository into Vercel.

Use these settings:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Set this environment variable in Vercel:

- `VITE_API_BASE_URL` = your Render backend URL

Example:

```text
https://peerlist-clone-api.onrender.com
```

## 4. Final Check

After deploying both services:

- open frontend URL from Vercel
- confirm backend health at `/health`
- test sign up, login, jobs, and profile flows

## Notes

- GitHub Pages is not suitable for this project because the backend is required.
- SQLite is fine for local development, but deployment should use Neon PostgreSQL.
