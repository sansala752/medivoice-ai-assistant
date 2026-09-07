import { LANGUAGES } from "./data";
import type { Appointment, Doctor, HumanRequest, HumanRequestStatus } from "./types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

type ApiDoctor = Omit<
  Doctor,
  | "languages"
  | "availableToday"
  | "availableTomorrow"
  | "status"
  | "consultationFee"
  | "availableDays"
  | "availableTimeSlots"
> & {
  consultation_fee: number;
  available_days: string[];
  available_time_slots: string[];
};

type ApiAppointment = {
  id: number;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  doctor_id: string;
  doctor: string;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: Appointment["status"];
  booking_source: "human" | "ai";
  language: string | null;
  created_at: string;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { detail?: string };
    throw new ApiError(body.detail ?? `Request failed (${response.status})`, response.status);
  }
  return (await response.json()) as T;
};

const mapDoctor = (doctor: ApiDoctor): Doctor => ({
  ...doctor,
  languages: ["English"],
  availableToday: doctor.available_days.includes(
    new Date().toLocaleDateString("en-US", { weekday: "long" }),
  ),
  availableTomorrow: doctor.available_days.includes(
    new Date(Date.now() + 86400000).toLocaleDateString("en-US", { weekday: "long" }),
  ),
  status: "Active",
  consultationFee: doctor.consultation_fee,
  availableDays: doctor.available_days,
  availableTimeSlots: doctor.available_time_slots,
});

const mapAppointment = (appointment: ApiAppointment): Appointment => ({
  id: String(appointment.id),
  patient: appointment.patient_name,
  patientPhone: appointment.patient_phone,
  patientEmail: appointment.patient_email,
  doctorId: appointment.doctor_id,
  doctorName: appointment.doctor,
  specialty: appointment.specialty,
  date: appointment.appointment_date,
  time: appointment.appointment_time,
  source: appointment.booking_source === "ai" ? "AI" : "Human",
  status: appointment.status,
  language: appointment.language ?? "English",
});

export const getDoctors = async (): Promise<Doctor[]> =>
  (await request<ApiDoctor[]>("/doctors")).map(mapDoctor);

/** GET /api/doctors/{id} */
export const getDoctor = async (id: string): Promise<Doctor> =>
  mapDoctor(await request<ApiDoctor>(`/doctors/${id}`));

/** GET /api/doctors/{id}/availability?date= */
export const getDoctorAvailability = async (doctorId: string, date: string): Promise<string[]> =>
  (() => {
    return request<{ available_slots?: unknown; slots?: unknown }>(
      `/doctors/${doctorId}/availability?date=${date}`,
    ).then((response) => {
      const slots = response.available_slots ?? response.slots;
      return Array.isArray(slots)
        ? slots.filter((slot): slot is string => typeof slot === "string")
        : [];
    });
  })();

/** GET /api/appointments */
export const getAppointments = async (): Promise<Appointment[]> =>
  (await request<ApiAppointment[]>("/appointments")).map(mapAppointment);

/** POST /api/appointments */
export const createAppointment = (
  input: Omit<Appointment, "id" | "status">,
): Promise<Appointment> =>
  request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify({
      patient_name: input.patient,
      patient_phone: input.patientPhone,
      patient_email: input.patientEmail,
      doctor_id: input.doctorId,
      appointment_date: input.date,
      appointment_time: input.time,
      booking_source: input.source.toLowerCase(),
      language: input.language,
    }),
  }).then((appointment) => ({
    ...mapAppointment(appointment as unknown as ApiAppointment),
    doctorName: input.doctorName,
    specialty: input.specialty,
    source: input.source,
  }));

/** PUT /api/appointments/{id} */
export const updateAppointment = async (): Promise<Appointment | undefined> => undefined;

/** DELETE /api/appointments/{id} */
export const cancelAppointment = (id: string): Promise<Appointment> =>
  request<Appointment>(`/appointments/${id}`, { method: "DELETE" });

/** GET /api/human-requests */
export const getHumanRequests = async (): Promise<HumanRequest[]> => [];

/** POST /api/human-requests */
export const createHumanRequest = (
  input: Omit<HumanRequest, "id" | "status">,
): Promise<HumanRequest> => {
  return { ...input, id: `REQ-${Date.now()}`, status: "Waiting" };
};

/** PUT /api/human-requests/{id} */
export const updateHumanRequestStatus = (
  id: string,
  status: HumanRequestStatus,
): Promise<HumanRequest | undefined> => {
  return undefined;
};

/**
 * Placeholder for the future speech pipeline (STT + LLM + TTS).
 * Provider-agnostic on purpose: replace with a call to the backend.
 */
export const voiceService = {
  startSession: async (language: string) => ({ sessionId: `sess-${Date.now()}`, language }),
  stopSession: async (sessionId: string) => ({ sessionId, ended: true }),
  sendUtterance: async (text: string) => ({ received: text }),
};

export { LANGUAGES };
