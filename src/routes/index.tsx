import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { TopNavigation } from "@/components/medivoice/TopNavigation";
import { VoiceAssistant, type VoiceStatus } from "@/components/medivoice/VoiceAssistant";
import { ConversationPanel } from "@/components/medivoice/ConversationPanel";
import { AppointmentSummary, type SummaryDraft } from "@/components/medivoice/AppointmentSummary";
import { DoctorAvailability } from "@/components/medivoice/DoctorAvailability";
import { Button } from "@/components/ui/button";
import { ApiError, createAppointment, createHumanRequest, getDoctors } from "@/lib/medivoice/api";
import type { Doctor, Message } from "@/lib/medivoice/types";

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

const DEFAULT_DRAFT: SummaryDraft = {
  doctor: "",
  specialty: "",
  date: "",
  time: "",
  patient: "",
  patientPhone: "",
  patientEmail: "",
  language: "English",
};

type AppointmentSummaryToolParameters = {
  doctor_name: string;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  patient_phone: string;
  appointment_id: string;
  action: "booked" | "cancelled";
};

function AssistantPage() {
  return (
    <ConversationProvider>
      <AssistantPageContent />
    </ConversationProvider>
  );
}

function AssistantPageContent() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");
  const [languageCode, setLanguageCode] = useState("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState<SummaryDraft>(DEFAULT_DRAFT);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("doc-1");
  const [selectedDate, setSelectedDate] = useState("2026-09-10");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const conversation = useConversation({
    clientTools: {
      display_appointment_summary: ({
        doctor_name,
        specialty,
        appointment_date,
        appointment_time,
        patient_name,
        patient_phone,
        appointment_id,
        action,
      }: AppointmentSummaryToolParameters) => {
        if (action === "cancelled") {
          setConfirmedId(null);
          setDraft({ ...DEFAULT_DRAFT, language });
          return "Summary displayed";
        }

        setDraft((previous) => ({
          ...previous,
          doctor: doctor_name,
          specialty,
          date: appointment_date,
          time: appointment_time,
          patient: patient_name,
          patientPhone: patient_phone,
        }));
        setConfirmedId(appointment_id);
        return "Summary displayed";
      },
    },
    onConnect: () => {
      addMessage("ai", `Connected. I am ready to help you in ${language}.`);
    },
    onDisconnect: (details) => {
      console.warn("ElevenLabs conversation disconnected:", details);
      addMessage("ai", "The conversation has ended.");
    },
    onMessage: (message) => {
      const event = message as {
        source?: string;
        role?: string;
        message?: string;
      };
      const text = event.message?.trim();
      const source = event.source ?? event.role;

      if (!text) return;
      if (source === "user") addMessage("patient", text);
      if (source === "ai" || source === "agent") addMessage("ai", text);
    },
    onError: (error) => {
      console.error("ElevenLabs conversation error:", error);
      toast.error("The voice assistant could not connect. Please try again.");
    },
  });

  const status: VoiceStatus =
    conversation.status === "connected"
      ? conversation.isSpeaking
        ? "Speaking..."
        : "Listening..."
      : conversation.status === "connecting"
        ? "Processing..."
        : "Ready to help";
  const active = conversation.status === "connected" || conversation.status === "connecting";

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch((error: Error) => setApiError(error.message))
      .finally(() => setLoadingDoctors(false));
  }, []);

  function addMessage(role: Message["role"], text: string) {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${role}`, role, text, time: now() }]);
  }

  const startConversation = async (code = languageCode) => {
    const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
    if (!agentId || agentId === "REPLACE_WITH_REAL_AGENT_ID") {
      toast.error("Configure VITE_ELEVENLABS_AGENT_ID before starting the assistant.");
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionOptions = {
        agentId,
        connectionType: "webrtc" as const,
        ...(code !== "en" ? { overrides: { agent: { language: code } } } : {}),
      };
      conversation.startSession(sessionOptions);
    } catch (error) {
      console.error("Unable to start ElevenLabs conversation:", error);
      toast.error("Microphone permission is required to start the voice assistant.");
    }
  };

  const endConversation = async () => {
    conversation.endSession();
  };

  const toggleMic = () => conversation.setMuted(!conversation.isMuted);

  const handleSend = async (text: string) => {
    if (!active) {
      toast.error("Start the conversation before sending a message.");
      return;
    }
    addMessage("patient", text);
    conversation.sendUserMessage(text);
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
    try {
      const appointment = await createAppointment({
        patient: draft.patient,
        patientPhone: draft.patientPhone,
        patientEmail: draft.patientEmail,
        doctorId,
        doctorName: draft.doctor,
        specialty: draft.specialty,
        date: selectedDate,
        time: draft.time,
        source: "AI",
        language,
      });
      setConfirmedId(appointment.id);
      addMessage("ai", `Your appointment is confirmed. Your appointment ID is ${appointment.id}.`);
    } catch (error) {
      toast.error(
        error instanceof ApiError && error.status === 409
          ? "The selected time is no longer available. Please choose another time."
          : error instanceof Error
            ? error.message
            : "Unable to book appointment",
      );
    }
  };

  const startNew = () => {
    setConfirmedId(null);
    setSelectedDate("2026-09-10");
    setDraft({ ...DEFAULT_DRAFT, language });
    setMessages([]);
  };

  const applySlot = (id: string, date: string, slot: string) => {
    const doctor = doctors.find((d) => d.id === id);
    if (!doctor) return;
    setDoctorId(id);
    setSelectedDate(date);
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

  const changeLanguage = async (code: string, label: string) => {
    setLanguage(label);
    setLanguageCode(code);
    setDraft((prev) => ({ ...prev, language: label }));

    if (active) {
      toast.info(`Restarting the conversation in ${label}...`);
      await conversation.endSession();
      await startConversation(code);
      return;
    }

    addMessage("ai", `Switching to ${label}. I will continue the booking in ${label}.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        languageCode={languageCode}
        language={language}
        onLanguageChange={changeLanguage}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {apiError ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {apiError}
          </p>
        ) : null}
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
              onStart={() => startConversation()}
              onEnd={endConversation}
              onToggleMic={toggleMic}
            />
            <AppointmentSummary
              draft={{ ...draft, language }}
              confirmedId={confirmedId}
              onConfirm={confirm}
              onDraftChange={(changes) => setDraft((prev) => ({ ...prev, ...changes }))}
              onChangeDetails={() => setAvailabilityOpen(true)}
              onViewAppointment={() => navigate({ to: "/staff/appointments" })}
              onStartNew={startNew}
            />
            <Button variant="outline" className="w-full" onClick={() => setAvailabilityOpen(true)}>
              {loadingDoctors ? "Loading doctors..." : "Check doctor availability"}
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
        doctors={doctors}
        doctorId={doctorId}
        onDoctorChange={setDoctorId}
        onConfirm={applySlot}
      />
    </div>
  );
}
