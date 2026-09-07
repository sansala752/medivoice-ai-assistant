import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TopNavigation } from "@/components/medivoice/TopNavigation";
import { VoiceAssistant, type VoiceStatus } from "@/components/medivoice/VoiceAssistant";
import { ConversationPanel } from "@/components/medivoice/ConversationPanel";
import { AppointmentSummary, type SummaryDraft } from "@/components/medivoice/AppointmentSummary";
import { DoctorAvailability } from "@/components/medivoice/DoctorAvailability";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/lib/medivoice/data";
import { createAppointment, createHumanRequest, voiceService } from "@/lib/medivoice/api";
import type { Message } from "@/lib/medivoice/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Appointment Assistant | MediVoice" },
      {
        name: "description",
        content:
          "Book a doctor appointment by voice in 10 languages with the MediVoice AI assistant, or ask for a human staff member.",
      },
      { property: "og:title", content: "AI Appointment Assistant | MediVoice" },
      {
        property: "og:description",
        content: "Multilingual AI voice booking for clinics — book, reschedule, or reach a human.",
      },
    ],
  }),
  component: AssistantPage,
});

const now = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", role: "ai", text: "Hello! Welcome to MediVoice. How can I help you today?", time: "10:24 AM" },
  { id: "m2", role: "patient", text: "I want to book an appointment with a cardiologist.", time: "10:25 AM" },
  {
    id: "m3",
    role: "ai",
    text: "Certainly. I found Dr. Sarah Perera, Cardiologist. What date would you prefer?",
    time: "10:25 AM",
  },
  { id: "m4", role: "patient", text: "September 10.", time: "10:26 AM" },
  {
    id: "m5",
    role: "ai",
    text: "Dr. Sarah Perera is available at 9:00 AM, 10:30 AM, 2:00 PM and 3:30 PM.",
    time: "10:26 AM",
  },
];

const DEFAULT_DRAFT: SummaryDraft = {
  doctor: "Dr. Sarah Perera",
  specialty: "Cardiology",
  date: "September 10, 2026",
  time: "10:30 AM",
  patient: "John Smith",
  language: "English",
};

function AssistantPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [status, setStatus] = useState<VoiceStatus>("Ready to help");
  const [active, setActive] = useState(false);
  const [draft, setDraft] = useState<SummaryDraft>(DEFAULT_DRAFT);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("doc-1");

  const addMessage = (role: Message["role"], text: string) =>
    setMessages((prev) => [...prev, { id: `${Date.now()}-${role}`, role, text, time: now() }]);

  const startConversation = async () => {
    await voiceService.startSession(language);
    setActive(true);
    setStatus("Listening...");
    addMessage("ai", `Hello! I am ready to help you in ${language}. What would you like to do?`);
  };

  const endConversation = async () => {
    await voiceService.stopSession("current");
    setActive(false);
    setStatus("Ready to help");
    addMessage("ai", "Thank you for using MediVoice. Take care!");
  };

  const toggleMic = () => setStatus(status === "Listening..." ? "Processing..." : "Listening...");

  const handleSend = async (text: string) => {
    addMessage("patient", text);
    await voiceService.sendUtterance(text);
    setStatus("Processing...");
    setTimeout(() => {
      setStatus("Speaking...");
      addMessage(
        "ai",
        `I have noted that in ${language}. Please review the appointment summary and confirm when ready.`,
      );
      setTimeout(() => setStatus(active ? "Listening..." : "Ready to help"), 800);
    }, 600);
  };

  const requestHuman = async () => {
    await createHumanRequest({
      patient: draft.patient,
      language,
      reason: "Patient requested human assistance",
      time: now(),
    });
    addMessage("ai", "I am connecting you to a staff member. Please hold for a moment.");
    toast.success("A staff member has been notified");
  };

  const confirm = async () => {
    const appointment = await createAppointment({
      patient: draft.patient,
      doctorId,
      doctorName: draft.doctor,
      specialty: draft.specialty,
      date: "2026-09-10",
      time: draft.time,
      source: "AI",
      language,
    });
    setConfirmedId(appointment.id);
    addMessage("ai", `Your appointment is confirmed. Your appointment ID is ${appointment.id}.`);
  };

  const startNew = () => {
    setConfirmedId(null);
    setDraft({ ...DEFAULT_DRAFT, language });
    setMessages(INITIAL_MESSAGES);
    setStatus("Ready to help");
    setActive(false);
  };

  const applySlot = (id: string, date: string, slot: string) => {
    const doctor = DOCTORS.find((d) => d.id === id)!;
    setDoctorId(id);
    setDraft((prev) => ({
      ...prev,
      doctor: doctor.name,
      specialty: doctor.specialty,
      date: new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: slot,
    }));
    setAvailabilityOpen(false);
    setConfirmedId(null);
    addMessage("ai", `Updated to ${doctor.name} on ${date} at ${slot}. Shall I confirm?`);
  };

  const changeLanguage = (value: string) => {
    setLanguage(value);
    setDraft((prev) => ({ ...prev, language: value }));
    addMessage("ai", `Switching to ${value}. I will continue the booking in ${value}.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation language={language} onLanguageChange={changeLanguage} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">AI Appointment Assistant</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Book, reschedule, or ask questions by voice — currently conversing in {language}.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <VoiceAssistant
              status={status}
              active={active}
              language={language}
              onStart={startConversation}
              onEnd={endConversation}
              onToggleMic={toggleMic}
            />
            <AppointmentSummary
              draft={{ ...draft, language }}
              confirmedId={confirmedId}
              onConfirm={confirm}
              onChangeDetails={() => setAvailabilityOpen(true)}
              onViewAppointment={() => navigate({ to: "/staff/appointments" })}
              onStartNew={startNew}
            />
            <Button variant="outline" className="w-full" onClick={() => setAvailabilityOpen(true)}>
              Check doctor availability
            </Button>
          </div>

          <ConversationPanel
            messages={messages}
            language={language}
            onSend={handleSend}
            onMic={toggleMic}
            onRequestHuman={requestHuman}
          />
        </div>
      </main>

      <DoctorAvailability
        open={availabilityOpen}
        onOpenChange={setAvailabilityOpen}
        doctors={DOCTORS}
        doctorId={doctorId}
        onDoctorChange={setDoctorId}
        onConfirm={applySlot}
      />
    </div>
  );
}
