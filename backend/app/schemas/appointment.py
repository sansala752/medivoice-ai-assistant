from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from typing import Optional

from ..models.appointment import AppointmentStatus


class AppointmentCreate(BaseModel):
    patient_name: str = Field(min_length=2, max_length=120)
    patient_phone: str = Field(min_length=7, max_length=32, pattern=r"^\+?[\d\s().-]{7,32}$")
    patient_email: Optional[EmailStr] = None
    doctor_id: str
    appointment_date: date
    appointment_time: str
    booking_source: str = Field(default="human", pattern="^(human|ai)$")
    language: str | None = Field(default=None, max_length=60)

    @field_validator("patient_email", mode="before")
    @classmethod
    def empty_email_to_none(cls, value):
        if value == "":
            return None
        return value

    @field_validator("patient_name")
    @classmethod
    def patient_name_must_contain_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Patient name is required")
        return value


class AppointmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_name: str
    patient_phone: str
    patient_email: EmailStr | None
    doctor_id: str
    doctor: str
    specialty: str
    appointment_date: date
    appointment_time: str
    status: AppointmentStatus
    booking_source: str
    language: str | None
    created_at: datetime


class ErrorRead(BaseModel):
    detail: str
