from datetime import date, timedelta

import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.seed import seed_doctors


@pytest.fixture
def test_client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    with Session() as db:
        seed_doctors(db)

    def override_db():
        with Session() as db:
            yield db

    app.dependency_overrides[get_db] = override_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def booking_payload(**overrides):
    payload = {
        "patient_name": "Test Patient",
        "patient_phone": "+15555550123",
        "patient_email": "test@example.com",
        "doctor_id": "doc-1",
        "appointment_date": (date.today() + timedelta(days=(7 - date.today().weekday()) % 7 or 7)).isoformat(),
        "appointment_time": "09:00 AM",
    }
    return {**payload, **overrides}


def test_get_doctors_returns_exact_seeded_doctors(test_client):
    response = test_client.get("/api/doctors")
    assert response.status_code == 200
    assert [(doctor["name"], doctor["specialty"]) for doctor in response.json()] == [
        ("Dr. Emily Davis", "Dermatology"),
        ("Dr. James Anderson", "Orthopedics"),
        ("Dr. Michael Brown", "General Medicine"),
        ("Dr. Olivia Taylor", "Pediatrics"),
        ("Dr. Sarah Wilson", "Cardiology"),
    ]


def test_get_availability_uses_schedule(test_client):
    response = test_client.get("/api/doctors/doc-1/availability?date=2026-09-10")
    assert response.status_code == 200
    assert response.json()["available_slots"] == []


def test_book_valid_appointment_and_retrieve_it(test_client):
    response = test_client.post("/api/appointments", json=booking_payload())
    assert response.status_code == 201
    appointment = response.json()
    assert appointment["status"] == "booked"
    assert appointment["doctor"] == "Dr. Sarah Wilson"
    assert appointment["specialty"] == "Cardiology"

    retrieved = test_client.get(f"/api/appointments/{appointment['id']}")
    assert retrieved.status_code == 200
    assert retrieved.json()["id"] == appointment["id"]


def test_same_slot_returns_409_and_disappears_from_availability(test_client):
    payload = booking_payload()
    first = test_client.post("/api/appointments", json=payload)
    assert first.status_code == 201

    availability = test_client.get(
        f"/api/doctors/doc-1/availability?date={payload['appointment_date']}"
    )
    assert "09:00 AM" not in availability.json()["available_slots"]

    duplicate = test_client.post("/api/appointments", json=payload)
    assert duplicate.status_code == 409


@pytest.mark.parametrize(
    "overrides, expected_status",
    [
        ({"doctor_id": "missing"}, 404),
        ({"appointment_time": "11:00 AM"}, 422),
        ({"appointment_date": (date.today() - timedelta(days=1)).isoformat()}, 422),
        ({"patient_name": "   "}, 422),
        ({"patient_phone": "bad"}, 422),
    ],
)
def test_invalid_booking_is_rejected(test_client, overrides, expected_status):
    response = test_client.post("/api/appointments", json=booking_payload(**overrides))
    assert response.status_code == expected_status


def test_missing_appointment_returns_404(test_client):
    assert test_client.get("/api/appointments/999999").status_code == 404


def test_cancelled_slot_can_be_booked_again(test_client):
    payload = booking_payload()
    first = test_client.post("/api/appointments", json=payload).json()
    cancelled = test_client.delete(f"/api/appointments/{first['id']}")
    assert cancelled.status_code == 200
    assert cancelled.json()["status"] == "cancelled"

    availability = test_client.get(
        f"/api/doctors/doc-1/availability?date={payload['appointment_date']}"
    )
    assert "09:00 AM" in availability.json()["available_slots"]

    replacement = test_client.post("/api/appointments", json=payload)
    assert replacement.status_code == 201


def test_cancel_missing_appointment_returns_404(test_client):
    assert test_client.delete("/api/appointments/999999").status_code == 404


def test_health_endpoint(test_client):
    assert test_client.get("/api/health").json() == {"status": "ok"}
