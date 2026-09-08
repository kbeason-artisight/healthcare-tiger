# Patient Records Portal

Demo healthcare app for PR-review interview exercises. Patients log in and view their own health records and lab results.

## Stack

- **Backend**: Django 5 + Django REST Framework, session auth, Postgres.
- **Frontend**: React + TypeScript (Vite) + MUI.
- **Infra**: docker-compose (db, backend, frontend).

## Running

```bash
docker-compose up --build
```

- Backend: http://localhost:8000/api/
- Frontend: http://localhost:5173
- Postgres: localhost:5432 (db/user/pass: `healthcare`)

First run applies migrations automatically. Seed a demo patient:

```bash
docker-compose exec backend python manage.py seed_demo_data
```

Demo login: `jane.doe` / `demopassword123`

## Auth flow

Session-based auth via Django. Frontend must:
1. `GET /api/auth/csrf/` to receive a `csrftoken` cookie.
2. `POST /api/auth/login/` with `{ username, password }`, sending the CSRF token in the `X-CSRFToken` header. This sets the session cookie.
3. Subsequent requests use `credentials: "include"`.

## API

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/csrf/` | GET | none | Sets CSRF cookie |
| `/api/auth/login/` | POST | none | Logs in, starts session |
| `/api/auth/logout/` | POST | session | Ends session |
| `/api/me/` | GET | session | Current patient profile |
| `/api/health-records/` | GET | session | Health records for the logged-in patient only |
| `/api/lab-results/` | GET | session | Lab results for the logged-in patient only |

## Data model

- `Patient` — one-to-one with Django `User`, has `mrn` (medical record number).
- `HealthRecord` — belongs to a `Patient`.
- `LabResult` — belongs to a `Patient`.

## Development without Docker

```bash
# backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# point POSTGRES_HOST at a local/dockerized Postgres, then:
python manage.py migrate
python manage.py runserver

# frontend
cd frontend
npm install
npm run dev
```
