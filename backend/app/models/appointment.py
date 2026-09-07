from datetime import date, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, ForeignKey, Index, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class AppointmentStatus(str, Enum):
    BOOKED = "booked"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = (
        Index(
            "uq_doctor_slot_booked",
            "doctor_id",
            "appointment_date",
            "appointment_time",
            unique=True,
            sqlite_where=text("status = 'booked'"),
            postgresql_where=text("status = 'booked'"),
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_name: Mapped[str] = mapped_column(String(120), nullable=False)
    patient_phone: Mapped[str] = mapped_column(String(32), nullable=False)
    patient_email: Mapped[str | None] = mapped_column(String(254), nullable=True)
    doctor_id: Mapped[str] = mapped_column(ForeignKey("doctors.id"), nullable=False, index=True)
    appointment_date: Mapped[date] = mapped_column(Date, nullable=False)
    appointment_time: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[AppointmentStatus] = mapped_column(String(20), default=AppointmentStatus.BOOKED, nullable=False)
    booking_source: Mapped[str] = mapped_column(String(20), default="human", nullable=False)
    language: Mapped[str | None] = mapped_column(String(60), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    doctor = relationship("Doctor", back_populates="appointments")
