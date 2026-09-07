import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { TopNavigation } from "@/components/medivoice/TopNavigation";
import { DoctorCard } from "@/components/medivoice/DoctorCard";
import { DoctorAvailability } from "@/components/medivoice/DoctorAvailability";
import { AppointmentSummary, type SummaryDraft } from "@/components/medivoice/AppointmentSummary";
import { ApiError, createAppointment, getDoctors } from "@/lib/medivoice/api";
import type { Doctor } from "@/lib/medivoice/types";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Our Doctors | MediVoice" },
      {
        name: "description",
        content:
          "Meet the MediVoice clinic team — cardiology, neurology, dermatology, general medicine and pediatrics — and check today's availability.",
      },
      { property: "og:title", content: "Our Doctors | MediVoice" },
      {
        property: "og:description",
        content: "Five specialists with same-day and next-day appointment slots.",
      },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const [language, setLanguage] = useState("English");
  const [languageCode, setLanguageCode] = useState("en");
  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("doc-1");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [draft, setDraft] = useState<SummaryDraft | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const confirmAppointment = async () => {
    if (!draft || !selectedDate) return;
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
        source: "Human",
        language,
      });
      setConfirmedId(appointment.id);
      toast.success("Appointment booked successfully");
    } catch (reason) {
      toast.error(
        reason instanceof ApiError && reason.status === 409
          ? "The selected time is no longer available. Please choose another time."
          : reason instanceof Error
            ? reason.message
            : "Unable to book appointment",
      );
    }
  };

  const startNewBooking = () => {
    setDraft(null);
    setSelectedDate(null);
    setConfirmedId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        languageCode={languageCode}
        language={language}
        onLanguageChange={(code, label) => {
          setLanguageCode(code);
          setLanguage(label);
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a specialist and check open appointment slots.
        </p>
        {error ? (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {draft ? (
          <div className="mt-6 max-w-2xl">
            <AppointmentSummary
              draft={draft}
              confirmedId={confirmedId}
              onConfirm={confirmAppointment}
              onDraftChange={(changes) =>
                setDraft((previous) => (previous ? { ...previous, ...changes } : previous))
              }
              onChangeDetails={() => setOpen(true)}
              onViewAppointment={() => toast.success(`Appointment ${confirmedId} is confirmed`)}
              onStartNew={startNewBooking}
            />
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewAvailability={(d) => {
                setDoctorId(d.id);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </main>

      <DoctorAvailability
        open={open}
        onOpenChange={setOpen}
        doctors={doctors}
        doctorId={doctorId}
        onDoctorChange={setDoctorId}
        onConfirm={(id, date, slot) => {
          const doctor = doctors.find((item) => item.id === id);
          if (!doctor) return;
          setDoctorId(id);
          setSelectedDate(date);
          setConfirmedId(null);
          setDraft({
            doctor: doctor.name,
            specialty: doctor.specialty,
            date: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            time: slot,
            patient: "",
            patientPhone: "",
            patientEmail: "",
            language,
          });
          setOpen(false);
          toast.success("Slot selected. Enter patient details to continue.");
        }}
      />
    </div>
  );
}
