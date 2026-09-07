from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Appointment
from ..models.appointment import AppointmentStatus
from ..schemas.appointment import AppointmentCreate, AppointmentRead
from ..services.appointments import appointment_response, create_appointment

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


@router.post("", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED, summary="Book an appointment")
def book_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)) -> Appointment:
    return appointment_response(create_appointment(db, payload))

@router.get("", response_model=List[AppointmentRead], summary="Search appointments by phone number")
def search_appointments(patient_phone: str, db: Session = Depends(get_db)) -> list[Appointment]:
    appointments = (
        db.query(Appointment)
        .filter(Appointment.patient_phone == patient_phone)
        .filter(Appointment.status == AppointmentStatus.BOOKED)
        .order_by(Appointment.appointment_date, Appointment.appointment_time)
        .all()
    )
    return [appointment_response(a) for a in appointments]

@router.get("/{appointment_id}", response_model=AppointmentRead, summary="Retrieve an appointment")
def read_appointment(appointment_id: int, db: Session = Depends(get_db)) -> Appointment:
    appointment = db.get(Appointment, appointment_id)
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    return appointment_response(appointment)


@router.delete("/{appointment_id}", response_model=AppointmentRead, summary="Cancel an appointment")
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)) -> Appointment:
    appointment = db.get(Appointment, appointment_id)
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    if appointment.status != AppointmentStatus.BOOKED:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Only booked appointments can be cancelled")
    appointment.status = AppointmentStatus.CANCELLED
    db.commit()
    db.refresh(appointment)
    return appointment_response(appointment)
