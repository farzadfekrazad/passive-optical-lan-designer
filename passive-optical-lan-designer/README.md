# Passive Optical LAN Designer

A fresh, standard-styled app scaffold to design Passive Optical LANs. Built with:

- React + Vite + TypeScript frontend
- Node.js + Express + TypeScript backend
- Dockerfiles and Docker Compose for easy local/prod runs
- Healthchecks and env-driven config (`JWT_SECRET`)
- GitHub Actions CI for build smoke tests

## Quick Start (Docker)

1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
2. Build and run:
   - `docker compose up -d --build`
3. Open the app at `http://localhost:5180/`
4. Backend healthcheck at `http://localhost:4001/health`

## Local Dev (optional)

Frontend:
- `cd frontend`
- `npm install`
- `npm run dev` (opens on `http://localhost:5180`)

Backend:
- `cd server`
- `npm install`
- `npm run dev` (listens on `http://localhost:4001`)

## Environment

- `JWT_SECRET` is required for token signing.
- `PORT` for backend defaults to `4001`.

## Standard Update Flow

- Pull latest changes, rebuild containers, and restart:
  - `git pull --ff-only`
  - `docker compose up -d --build`