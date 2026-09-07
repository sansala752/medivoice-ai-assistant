from collections.abc import Generator

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


class Base(DeclarativeBase):
    pass


engine = create_engine(get_settings().database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from .models import Appointment, Doctor  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _migrate_legacy_sqlite_appointment_constraint()


def _migrate_legacy_sqlite_appointment_constraint() -> None:
    from .models import Appointment

    if engine.dialect.name != "sqlite":
        return
    table_sql = inspect(engine).get_table_names()
    if "appointments" not in table_sql:
        return
    with engine.begin() as connection:
        definition = connection.exec_driver_sql(
            "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'appointments'"
        ).scalar_one()
        if "uq_doctor_slot" not in definition:
            return
        connection.exec_driver_sql("PRAGMA foreign_keys=OFF")
        connection.exec_driver_sql("DROP INDEX IF EXISTS ix_appointments_doctor_id")
        connection.exec_driver_sql("ALTER TABLE appointments RENAME TO appointments_legacy")
        Appointment.__table__.create(connection)
        connection.exec_driver_sql(
            """
            INSERT INTO appointments
                (id, patient_name, patient_phone, patient_email, doctor_id,
                 appointment_date, appointment_time, status, booking_source,
                 language, created_at)
            SELECT id, patient_name, patient_phone, patient_email, doctor_id,
                   appointment_date, appointment_time, status, booking_source,
                   language, created_at
            FROM appointments_legacy
            """
        )
        connection.exec_driver_sql("DROP TABLE appointments_legacy")
        connection.exec_driver_sql("PRAGMA foreign_keys=ON")
