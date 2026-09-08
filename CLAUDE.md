# Patient Records Portal — project notes

Interview-exercise repo: reviewers audit a PR against this baseline. See README.md for stack/setup.

## Architecture

- `backend/` — Django + DRF. App `patients` holds all models/views/urls. Session auth (not token/JWT). CSRF required on unsafe methods.
- `frontend/` — Vite + React + TS + MUI. `src/api/client.ts` is the single fetch wrapper; all API calls go through it.
- Patients only ever see their own data — every queryset in `patients/views.py` filters by `request.user.patient`. Any new endpoint must preserve this.

## Domain rules (compliance-relevant — check these in review)

- No PHI (names, MRNs, record contents, lab values) in logs.
- All access to a patient's records must be attributable to an authenticated session; no anonymous or cross-patient reads.
- Any new sharing/export feature must be time-limited and revocable, and must not rely on client-side checks alone for authorization.

## Conventions

- Generated PR review comments start with `[claude]`.
- Keep DRF views thin; queryset filtering by patient is the load-bearing security control — don't move it client-side.
- Migrations are auto-applied by the `backend` compose service on start (`migrate` runs before `runserver`).
