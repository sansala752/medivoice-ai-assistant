from sqlalchemy import JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    specialty: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    consultation_fee: Mapped[float] = mapped_column(nullable=False)
    available_days: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    available_time_slots: Mapped[list[str]] = mapped_column(JSON, nullable=False)

    appointments = relationship("Appointment", back_populates="doctor")
