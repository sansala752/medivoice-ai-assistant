/**
 * Mock API layer for MediVoice.
 *
 * Every function below mirrors a future FastAPI REST endpoint so the mock
 * implementation can be swapped for real `fetch` calls without touching the UI:
 *
 *   GET    /api/doctors
 *   GET    /api/doctors/{id}/availability?date=YYYY-MM-DD
 *   POST   /api/appointments
 *   GET    /api/appointments
 *   PUT    /api/appointments/{id}
 *   DELETE /api/appointments/{id}
 *   POST   /api/human-requests
 *   GET    /api/human-requests
 */
import { APPOINTMENTS, DEFAULT_SLOTS, DOCTORS, HUMAN_REQUESTS } from "./data";
import type {
  Appointment,
  AppointmentStatus,
  Doctor,
  HumanRequest,
  HumanRequestStatus,
} from "./types";

export const API_BASE_URL = "/api";

const delay = <T,>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// In-memory stores standing in for the MySQL database.
let appointments: Appointment[] = [...APPOINTMENTS];
let humanRequests: HumanRequest[] = [...HUMAN_REQUESTS];
let appointmentSeq = 1030;

/** GET /api/doctors */
export const getDoctors = (): Promise<Doctor[]> => delay(DOCTORS);

/** GET /api/doctors/{id} */
export const getDoctor = (id: string): Promise<Doctor | undefined> =>
  delay(DOCTORS.find((d) => d.id === id));

/** GET /api/doctors/{id}/availability?date= */
export const getDoctorAvailability = (doctorId: string, date: string): Promise<string[]> => {
  if (!doctorId || !date) return delay<string[]>([]);
  // Deterministic mock: drop one slot on weekends to look realistic.
  const day = new Date(date + "T00:00:00").getDay();
  const slots = day === 0 ? DEFAULT_SLOTS.slice(0, 2) : DEFAULT_SLOTS;
  return delay(slots);
};

/** GET /api/appointments */
export const getAppointments = (): Promise<Appointment[]> => delay(appointments);

/** POST /api/appointments */
export const createAppointment = (
  input: Omit<Appointment, "id" | "status"> & { status?: AppointmentStatus },
): Promise<Appointment> => {
  const appointment: Appointment = {
    ...input,
    id: `MED-${appointmentSeq++}`,
    status: input.status ?? "Confirmed",
  };
  appointments = [appointment, ...appointments];
  return delay(appointment);
};

/** PUT /api/appointments/{id} */
export const updateAppointment = (
  id: string,
  changes: Partial<Appointment>,
): Promise<Appointment | undefined> => {
  appointments = appointments.map((a) => (a.id === id ? { ...a, ...changes } : a));
  return delay(appointments.find((a) => a.id === id));
};

/** DELETE /api/appointments/{id} */
export const cancelAppointment = (id: string): Promise<{ ok: true }> => {
  appointments = appointments.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a));
  return delay({ ok: true } as const);
};

/** GET /api/human-requests */
export const getHumanRequests = (): Promise<HumanRequest[]> => delay(humanRequests);

/** POST /api/human-requests */
export const createHumanRequest = (
  input: Omit<HumanRequest, "id" | "status">,
): Promise<HumanRequest> => {
  const request: HumanRequest = { ...input, id: `REQ-${500 + humanRequests.length + 1}`, status: "Waiting" };
  humanRequests = [request, ...humanRequests];
  return delay(request);
};

/** PUT /api/human-requests/{id} */
export const updateHumanRequestStatus = (
  id: string,
  status: HumanRequestStatus,
): Promise<HumanRequest | undefined> => {
  humanRequests = humanRequests.map((r) => (r.id === id ? { ...r, status } : r));
  return delay(humanRequests.find((r) => r.id === id));
};

/**
 * Placeholder for the future speech pipeline (STT + LLM + TTS).
 * Provider-agnostic on purpose: replace with a call to the backend.
 */
export const voiceService = {
  startSession: async (language: string) => delay({ sessionId: `sess-${Date.now()}`, language }),
  stopSession: async (sessionId: string) => delay({ sessionId, ended: true }),
  sendUtterance: async (text: string) => delay({ received: text }),
};
