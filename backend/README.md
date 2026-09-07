# MediVoice API

FastAPI + SQLAlchemy backend for the MediVoice appointment system.

## Run

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

The app creates the schema on startup and seeds exactly five doctors when the doctors table is empty. For production, replace `create_all` with Alembic migrations before deploying schema changes.

## ElevenLabs tools

Configure HTTP tools against the same API:

- `get_doctors`: `GET http://localhost:8000/api/doctors`
- `get_doctor_availability`: `GET http://localhost:8000/api/doctors/{doctor_id}/availability?date=YYYY-MM-DD`
- `book_appointment`: `POST http://localhost:8000/api/appointments` with `patient_name`, `patient_phone`, `patient_email`, `doctor_id`, `appointment_date`, `appointment_time`, `booking_source: "ai"`, and optional `language`.
- `cancel_appointment`: `DELETE http://localhost:8000/api/appointments/{appointment_id}`

The availability and booking endpoints apply the same validation and database double-booking constraint for both voice and web clients.
