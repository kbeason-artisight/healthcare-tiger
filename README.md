# Healthcare Tiger

Demo healthcare app for PR-review interview exercises. Patients log in and view their own health records, lab results, appointments, medications, and insurance/billing summary.

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
- Postgres: internal only (`db:5432` inside the compose network; not exposed to host)

Demo logins (password `demopassword123` for both):
- `jane.doe`
- `anne.chovy`

## Data model

- `Patient` — one-to-one with Django `User`, has `mrn` (medical record number), plus demographics: `gender`, `phone_number`, `address_line1/2`, `city`, `state`, `postal_code`.
- `HealthRecord` — belongs to a `Patient`.
- `LabResult` — belongs to a `Patient`.
- `Appointment` — belongs to a `Patient`; provider name, reason, scheduled time, location, status (`scheduled`/`completed`/`cancelled`).
- `Medication` — belongs to a `Patient`; name, dosage, frequency, prescriber, start/end date, status (`active`/`discontinued`).
- `InsuranceSummary` — one-to-one with `Patient`; payer/plan info, copays, deductible.

## Frontend pages

`/health-records`, `/lab-results`, `/appointments`, `/medications`, `/billing`, `/profile` (`/` redirects to `/health-records`). All behind session auth via `Layout`, which also holds top nav.

## Development without Docker

```bash
# backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# point POSTGRES_HOST at a local/dockerized Postgres, then:
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver

# frontend
cd frontend
npm install
npm run dev
```
