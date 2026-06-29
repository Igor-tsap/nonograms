# Nonograms

A full-stack pet project for creating, solving, and managing Nonogram puzzles.

## Overview

This repository includes:

- `backend/`: FastAPI backend with MySQL database support and puzzle CRUD APIs.
- `frontend/`: Next.js application for browsing puzzles, creating new puzzles, and editing user-owned puzzles.
- `src/`: Shared backend service code for puzzles, users, and attempts.

## Features

- Create and edit Nonogram puzzles.
- Browse public puzzles and view details.
- User authentication and puzzle ownership.
- Track solve attempts and puzzle metadata.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, Alembic
- Frontend: Next.js, TypeScript, React
- Database: MySQL setup via Docker / Docker Compose

## Getting Started

### Backend

1. Activate the virtual environment:

```bash
source backend/env/bin/activate
```

2. Install dependencies if needed:

```bash
pip install -r backend/requirements.txt
```

3. Run the backend locally:

```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run the frontend:

```bash
npm run dev
```

## Notes

This project is intended as a personal showcase for building a puzzle application with a modern web stack.


.
├── backend
│   ├── alembic
│   │   ├── env.py
│   │   ├── README
│   │   ├── script.py.mako
│   │   └── versions
│   │       ├── a2e73777dbbe_initial.py
│   │       └── d7b9f7829749_seed_puzzles.py
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── requirements.txt
│   └── src
│       ├── attempts
│       │   ├── __init__.py
│       │   ├── controller.py
│       │   ├── model.py
│       │   ├── schema.py
│       │   └── service.py
│       ├── auth.py
│       ├── chat
│       │   ├── __init__.py
│       │   ├── connection_manager.py
│       │   ├── controller.py
│       │   ├── model.py
│       │   ├── schema.py
│       │   └── service.py
│       ├── database
│       │   ├── __init__.py
│       │   ├── core.py
│       │   └── redis.py
│       ├── main.py
│       ├── puzzles
│       │   ├── __init__.py
│       │   ├── controller.py
│       │   ├── model.py
│       │   ├── schema.py
│       │   ├── service.py
│       │   └── utils.py
│       └── users
│           ├── __init__.py
│           ├── controller.py
│           ├── model.py
│           ├── schema.py
│           └── service.py
├── docker-compose.override.yml
├── docker-compose.yml
├── frontend
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── README.md
│   ├── src
│   │   ├── app
│   │   │   └── [locale]
│   │   │       ├── create-puzzle
│   │   │       │   └── page.tsx
│   │   │       ├── favicon.ico
│   │   │       ├── globals.css
│   │   │       ├── layout.tsx
│   │   │       ├── my-puzzles
│   │   │       │   ├── [id]
│   │   │       │   │   └── edit
│   │   │       │   │       └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── page.tsx
│   │   │       └── puzzles
│   │   │           ├── [id]
│   │   │           │   └── page.tsx
│   │   │           └── page.tsx
│   │   ├── components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── chat
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   └── MessageBubble.tsx
│   │   │   ├── LocaleSwitcher.tsx
│   │   │   └── Navbar.tsx
│   │   ├── context
│   │   │   ├── AuthContext.tsx
│   │   │   └── ChatContext.tsx
│   │   ├── i18n
│   │   │   ├── request.ts
│   │   │   └── routing.ts
│   │   ├── lib
│   │   │   ├── api.ts
│   │   │   └── chatSocket.ts
│   │   ├── messages
│   │   │   ├── en.json
│   │   │   └── uk.json
│   │   └── middleware.ts
│   └── tsconfig.json
├── package-lock.json
├── package.json
├── prometheus.yml
└── README.md
