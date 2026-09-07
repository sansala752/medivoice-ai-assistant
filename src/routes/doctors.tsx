import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { TopNavigation } from "@/components/medivoice/TopNavigation";
import { DoctorCard } from "@/components/medivoice/DoctorCard";
import { DoctorAvailability } from "@/components/medivoice/DoctorAvailability";
import { DOCTORS } from "@/lib/medivoice/data";

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
  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("doc-1");

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation language={language} onLanguageChange={setLanguage} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a specialist and check open appointment slots.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOCTORS.map((doctor) => (
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
        doctors={DOCTORS}
        doctorId={doctorId}
        onDoctorChange={setDoctorId}
        onConfirm={(_id, date, slot) => {
          setOpen(false);
          toast.success(`Slot selected: ${date} at ${slot}`);
        }}
      />
    </div>
  );
}
