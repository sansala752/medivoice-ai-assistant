from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from .models import Appointment, Doctor

SLOTS = ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"]

DOCTORS = [
    ("doc-1", "Dr. Sarah Wilson", "Cardiology", "Consultant cardiologist focused on preventive heart care, arrhythmia and post-surgery follow-ups.", 85.0, ["Monday", "Tuesday", "Wednesday", "Friday"]),
    ("doc-2", "Dr. Michael Brown", "General Medicine", "General physician handling routine check-ups, chronic disease reviews and same-day consultations.", 55.0, ["Monday", "Tuesday", "Thursday", "Saturday"]),
    ("doc-3", "Dr. Emily Davis", "Dermatology", "Dermatologist specialising in acne, eczema, allergy testing and minor skin procedures.", 70.0, ["Tuesday", "Wednesday", "Thursday", "Friday"]),
    ("doc-4", "Dr. James Anderson", "Orthopedics", "Orthopedic consultant treating sports injuries, joint pain and evidence-based rehabilitation plans.", 90.0, ["Monday", "Wednesday", "Thursday", "Saturday"]),
    ("doc-5", "Dr. Olivia Taylor", "Pediatrics", "Paediatrician caring for newborns to teenagers, including vaccinations and growth monitoring.", 60.0, ["Tuesday", "Thursday", "Friday", "Saturday"]),
]


def seed_doctors(db: Session) -> None:
    expected_ids = {doctor[0] for doctor in DOCTORS}
    existing = {doctor.id: doctor for doctor in db.scalars(select(Doctor)).all()}
    for id_, name, specialty, description, fee, days in DOCTORS:
        doctor = existing.get(id_)
        if doctor is None:
            doctor = Doctor(id=id_)
            db.add(doctor)
        doctor.name = name
        doctor.specialty = specialty
        doctor.description = description
        doctor.consultation_fee = fee
        doctor.available_days = days
        doctor.available_time_slots = SLOTS

    for doctor in existing.values():
        if doctor.id not in expected_ids and not db.scalar(
            select(Appointment.id).where(Appointment.doctor_id == doctor.id).limit(1)
        ):
            db.execute(delete(Doctor).where(Doctor.id == doctor.id))
    db.commit()
