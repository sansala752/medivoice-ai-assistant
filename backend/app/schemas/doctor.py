from pydantic import BaseModel, ConfigDict


class DoctorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    specialty: str
    description: str
    consultation_fee: float
    available_days: list[str]
    available_time_slots: list[str]


class AvailabilityRead(BaseModel):
    doctor_id: str
    date: str
    available_slots: list[str]
