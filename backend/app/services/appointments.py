from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..models import Appointment, Doctor
from ..models.appointment import AppointmentStatus
from ..schemas.appointment import AppointmentCreate


def get_doctor_or_404(db: Session, doctor_id: str) -> Doctor:
    doctor = db.get(Doctor, doctor_id)
    if doctor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return doctor


def available_slots(db: Session, doctor_id: str, appointment_date: date) -> list[str]:
    doctor = get_doctor_or_404(db, doctor_id)
    day_name = appointment_date.strftime("%A")
    if day_name not in doctor.available_days:
        return []
    booked = db.scalars(
        select(Appointment.appointment_time).where(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_date == appointment_date,
            Appointment.status == AppointmentStatus.BOOKED,
        )
    ).all()
    return [slot for slot in doctor.available_time_slots if slot not in booked]


def appointment_response(appointment: Appointment) -> dict[str, object]:
    return {
        "id": appointment.id,
        "patient_name": appointment.patient_name,
        "patient_phone": appointment.patient_phone,
        "patient_email": appointment.patient_email,
        "doctor_id": appointment.doctor_id,
        "doctor": appointment.doctor.name,
        "specialty": appointment.doctor.specialty,
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status,
        "booking_source": appointment.booking_source,
        "language": appointment.language,
        "created_at": appointment.created_at,
    }


def create_appointment(db: Session, payload: AppointmentCreate) -> Appointment:
    doctor = get_doctor_or_404(db, payload.doctor_id)
    if payload.appointment_date < date.today():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Appointment date cannot be in the past")
    if payload.appointment_time not in doctor.available_time_slots:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Time slot is not offered by this doctor")
    if payload.appointment_time not in available_slots(db, payload.doctor_id, payload.appointment_date):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That time slot is already booked or unavailable")

    appointment = Appointment(**payload.model_dump())
    db.add(appointment)
    try:
        db.commit()
    except IntegrityError:
        # This broad handler can mask unrelated database errors; narrow it when more constraints are added.
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That time slot is already booked") from None
    db.refresh(appointment)
    return appointment
