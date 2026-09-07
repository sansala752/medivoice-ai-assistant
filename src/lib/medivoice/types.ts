export type AppointmentStatus = "booked" | "cancelled" | "completed";
export type BookingSource = "AI" | "Human";
export type HumanRequestStatus = "Waiting" | "Assigned to You" | "Closed";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  languages: string[];
  availableToday: boolean;
  availableTomorrow: boolean;
  status: "Active" | "On Leave";
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: string[];
}

export interface Appointment {
  id: string;
  patient: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  source: BookingSource;
  status: AppointmentStatus;
  language: string;
}

export interface HumanRequest {
  id: string;
  patient: string;
  language: string;
  reason: string;
  time: string;
  status: HumanRequestStatus;
}

export interface Language {
  code: string;
  label: string;
  native: string;
}

export interface Message {
  id: string;
  role: "ai" | "patient";
  text: string;
  time: string;
}
