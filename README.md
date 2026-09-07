# MediVoice AI Assistant

MediVoice is a medical appointment booking prototype with:

- React, TypeScript, Vite, and the existing Lovable/TanStack Start UI
- FastAPI and SQLAlchemy backend
- SQLite for local development or PostgreSQL through Docker
- Backend-authoritative doctor availability and booking validation
- ElevenLabs Conversational AI integration for voice booking

## Project structure

```text
src/                         React frontend
src/routes/                  TanStack routes
src/components/medivoice/   Patient and shared UI components
src/lib/medivoice/           Frontend API client and types
backend/app/                 FastAPI application
backend/app/models/          SQLAlchemy models
backend/app/schemas/         Pydantic request/response schemas
backend/app/routers/         API routes
backend/app/services/        Booking business logic
backend/tests/               Backend API tests
docker-compose.yml           Local PostgreSQL service
```

## Requirements

- Node.js and npm
- Python 3.11+
- Docker Desktop, if using PostgreSQL

## Environment variables

Copy the examples before starting the application:

```powershell
Copy-Item .env.example .env.local
Copy-Item backend/.env.example backend/.env
```

Frontend `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_ELEVENLABS_AGENT_ID=REPLACE_WITH_REAL_AGENT_ID
```

Backend `.env`:

```env
DATABASE_URL=sqlite:///./medivoice.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

For PostgreSQL, use a URL such as:

```env
DATABASE_URL=postgresql+psycopg://medivoice:medivoice@localhost:5432/medivoice
```

Never commit `.env`, `.env.local`, database credentials, or ElevenLabs secrets.

## Start with SQLite

SQLite is the default local database and requires no separate service.

```powershell
# From the repository root
cd backend
..\.venv\Scripts\python.exe -m pip install -r requirements.txt
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If the virtual environment does not exist yet:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
```

The backend creates the schema and seeds exactly five doctors on startup. The local SQLite file is `backend/medivoice.db`.

## Start with PostgreSQL

```powershell
docker compose up -d postgres
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Set the PostgreSQL `DATABASE_URL` in `backend/.env` before starting the API. The prototype uses SQLAlchemy `create_all`; use Alembic migrations before production deployment.

## Start the frontend

From the repository root:

```powershell
npm install
npm run dev
```

The frontend normally runs at `http://localhost:5173`. In this workspace it may run at `http://localhost:8080`.

The frontend calls the backend through the centralized API client at `src/lib/medivoice/api.ts`.

## API

Interactive Swagger documentation:

```text
http://localhost:8000/docs
```

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/doctors` | List the five doctors |
| GET | `/api/doctors/{doctor_id}` | Get one doctor |
| GET | `/api/doctors/{doctor_id}/availability?date=YYYY-MM-DD` | Get active slots |
| POST | `/api/appointments` | Book an appointment |
| GET | `/api/appointments/{appointment_id}` | Retrieve an appointment |
| DELETE | `/api/appointments/{appointment_id}` | Cancel an appointment |

Availability response:

```json
{
  "doctor_id": "doc-1",
  "date": "2026-09-15",
  "available_slots": ["09:00 AM", "10:30 AM"]
}
```

Booking request:

```json
{
  "patient_name": "John Smith",
  "patient_phone": "+94 77 555 0110",
  "patient_email": "john.smith@example.com",
  "doctor_id": "doc-1",
  "appointment_date": "2026-09-15",
  "appointment_time": "09:00 AM",
  "booking_source": "human",
  "language": "English"
}
```

The backend validates patient details, doctor schedule, past dates, slot availability, and duplicate bookings. A duplicate active booking returns `409 Conflict`. Cancelled appointments remain in the database for history and release their slot.

## Doctors

The backend seeds exactly these five doctors:

- Dr. Sarah Wilson, Cardiology
- Dr. Michael Brown, General Medicine
- Dr. Emily Davis, Dermatology
- Dr. James Anderson, Orthopedics
- Dr. Olivia Taylor, Pediatrics

The frontend loads doctors and availability from FastAPI. It does not calculate availability locally.

## ElevenLabs voice integration

The browser integration uses `@elevenlabs/react` and `VITE_ELEVENLABS_AGENT_ID`.

The assistant uses these logical tools against the same backend API:

- `get_doctors` -> `GET /api/doctors`
- `get_doctor_availability` -> `GET /api/doctors/{doctor_id}/availability?date=YYYY-MM-DD`
- `book_appointment` -> `POST /api/appointments`
- `cancel_appointment` -> `DELETE /api/appointments/{appointment_id}`

The frontend also registers a `display_appointment_summary` client tool so AI-created or cancelled appointments update the existing summary UI. Replace the placeholder agent ID with the real ID from ElevenLabs before starting a voice session.

## Tests and checks

Run backend tests:

```powershell
.\.venv\Scripts\python.exe -m pytest backend/tests -q
```

Run the frontend build:

```powershell
npm run build
```

Run lint:

```powershell
npm run lint
```

The test suite covers doctor retrieval, availability, valid booking, duplicate booking prevention, invalid doctors and slots, past dates, appointment retrieval, cancellation, rebooking after cancellation, and health checks.

## Known limitations

- Authentication and staff authorization are not implemented.
- The staff dashboard child routes are not complete.
- Startup schema creation is used instead of Alembic migrations.
- Audit logging, rate limiting, monitoring, and healthcare compliance controls are not implemented.
- The ElevenLabs agent must be configured separately in the ElevenLabs dashboard.
- Production deployment should use managed PostgreSQL, secrets management, migrations, and HTTPS.
