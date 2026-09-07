from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Doctor
from ..schemas.doctor import AvailabilityRead, DoctorRead
from ..services.appointments import available_slots, get_doctor_or_404

router = APIRouter(prefix="/api/doctors", tags=["doctors"])


@router.get("", response_model=list[DoctorRead], summary="List the five clinic doctors")
def list_doctors(db: Session = Depends(get_db)) -> list[Doctor]:
    return list(db.scalars(select(Doctor).order_by(Doctor.name)).all())


@router.get("/{doctor_id}", response_model=DoctorRead, summary="Get one doctor")
def read_doctor(doctor_id: str, db: Session = Depends(get_db)) -> Doctor:
    return get_doctor_or_404(db, doctor_id)


@router.get("/{doctor_id}/availability", response_model=AvailabilityRead, summary="Get active appointment slots for a doctor and date")
def read_availability(
    doctor_id: str,
    appointment_date: date = Query(alias="date"),
    db: Session = Depends(get_db),
) -> AvailabilityRead:
    get_doctor_or_404(db, doctor_id)
    slots = available_slots(db, doctor_id, appointment_date)
    return AvailabilityRead(doctor_id=doctor_id, date=appointment_date.isoformat(), available_slots=slots)
