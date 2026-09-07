import type { Appointment, Doctor, HumanRequest, Language } from "./types";

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", native: "English" },
  { code: "si", label: "Sinhala", native: "සිංහල" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "zh", label: "Mandarin Chinese", native: "中文" },
];

export const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Perera",
    specialty: "Cardiology",
    description:
      "Consultant cardiologist focused on preventive heart care, arrhythmia and post-surgery follow-ups.",
    languages: ["English", "Sinhala", "Tamil"],
    availableToday: true,
    availableTomorrow: true,
    status: "Active",
  },
  {
    id: "doc-2",
    name: "Dr. Michael Silva",
    specialty: "Neurology",
    description:
      "Neurologist treating migraine, epilepsy and stroke rehabilitation with 12 years of clinical practice.",
    languages: ["English", "Sinhala"],
    availableToday: false,
    availableTomorrow: true,
    status: "Active",
  },
  {
    id: "doc-3",
    name: "Dr. Nadeesha Fernando",
    specialty: "Dermatology",
    description:
      "Dermatologist specialising in acne, eczema, allergy testing and minor skin procedures.",
    languages: ["English", "Sinhala", "Hindi"],
    availableToday: true,
    availableTomorrow: false,
    status: "Active",
  },
  {
    id: "doc-4",
    name: "Dr. James Wilson",
    specialty: "General Medicine",
    description:
      "General physician handling routine check-ups, chronic disease reviews and same-day consultations.",
    languages: ["English", "French", "German"],
    availableToday: true,
    availableTomorrow: true,
    status: "Active",
  },
  {
    id: "doc-5",
    name: "Dr. Anjali Kumar",
    specialty: "Pediatrics",
    description:
      "Paediatrician caring for newborns to teenagers, including vaccinations and growth monitoring.",
    languages: ["English", "Hindi", "Tamil"],
    availableToday: false,
    availableTomorrow: true,
    status: "On Leave",
  },
];

export const DEFAULT_SLOTS = ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"];

export const APPOINTMENTS: Appointment[] = [
  {
    id: "MED-1024",
    patient: "John Smith",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Perera",
    specialty: "Cardiology",
    date: "2026-09-10",
    time: "10:30 AM",
    source: "AI",
    status: "Confirmed",
    language: "English",
  },
  {
    id: "MED-1025",
    patient: "Maria Silva",
    doctorId: "doc-5",
    doctorName: "Dr. Anjali Kumar",
    specialty: "Pediatrics",
    date: "2026-09-10",
    time: "11:00 AM",
    source: "Human",
    status: "Confirmed",
    language: "Spanish",
  },
  {
    id: "MED-1026",
    patient: "David Chen",
    doctorId: "doc-2",
    doctorName: "Dr. Michael Silva",
    specialty: "Neurology",
    date: "2026-09-10",
    time: "02:00 PM",
    source: "AI",
    status: "Pending",
    language: "Mandarin Chinese",
  },
  {
    id: "MED-1027",
    patient: "Amara Fernando",
    doctorId: "doc-3",
    doctorName: "Dr. Nadeesha Fernando",
    specialty: "Dermatology",
    date: "2026-09-10",
    time: "03:30 PM",
    source: "AI",
    status: "Confirmed",
    language: "Sinhala",
  },
  {
    id: "MED-1028",
    patient: "Peter Wijesinghe",
    doctorId: "doc-4",
    doctorName: "Dr. James Wilson",
    specialty: "General Medicine",
    date: "2026-09-11",
    time: "09:00 AM",
    source: "Human",
    status: "Cancelled",
    language: "English",
  },
  {
    id: "MED-1029",
    patient: "Lina Haddad",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Perera",
    specialty: "Cardiology",
    date: "2026-09-11",
    time: "02:00 PM",
    source: "AI",
    status: "Pending",
    language: "Arabic",
  },
];

export const HUMAN_REQUESTS: HumanRequest[] = [
  {
    id: "REQ-501",
    patient: "John Smith",
    language: "Sinhala",
    reason: "Patient requested human assistance",
    time: "10:32 AM",
    status: "Waiting",
  },
  {
    id: "REQ-502",
    patient: "Lina Haddad",
    language: "Arabic",
    reason: "AI could not confirm insurance-free consultation fee",
    time: "10:48 AM",
    status: "Waiting",
  },
  {
    id: "REQ-503",
    patient: "David Chen",
    language: "Mandarin Chinese",
    reason: "Patient asked to reschedule an existing appointment",
    time: "11:05 AM",
    status: "Waiting",
  },
  {
    id: "REQ-504",
    patient: "Maria Silva",
    language: "Spanish",
    reason: "Patient requested human assistance",
    time: "11:20 AM",
    status: "Assigned to You",
  },
];

export const PATIENTS = [
  { id: "PT-01", name: "John Smith", language: "English", phone: "+94 77 555 0110", visits: 4 },
  { id: "PT-02", name: "Maria Silva", language: "Spanish", phone: "+94 77 555 0121", visits: 2 },
  {
    id: "PT-03",
    name: "David Chen",
    language: "Mandarin Chinese",
    phone: "+94 77 555 0132",
    visits: 6,
  },
  { id: "PT-04", name: "Amara Fernando", language: "Sinhala", phone: "+94 77 555 0143", visits: 1 },
  { id: "PT-05", name: "Lina Haddad", language: "Arabic", phone: "+94 77 555 0154", visits: 3 },
];
