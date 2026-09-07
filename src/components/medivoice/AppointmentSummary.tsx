import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SummaryDraft {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  patient: string;
  patientPhone: string;
  patientEmail: string;
  language: string;
}

interface Props {
  draft: SummaryDraft;
  confirmedId?: string | null;
  onConfirm: () => void;
  onChangeDetails: () => void;
  onViewAppointment: () => void;
  onStartNew: () => void;
  onDraftChange: (changes: Partial<SummaryDraft>) => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function AppointmentSummary({
  draft,
  confirmedId,
  onConfirm,
  onChangeDetails,
  onViewAppointment,
  onStartNew,
  onDraftChange,
}: Props) {
  if (!confirmedId && !draft.doctor) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold">Appointment Summary</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start a conversation with the assistant to book an appointment, and the details will
          appear here.
        </p>
      </Card>
    );
  }

  if (confirmedId) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-success/12 text-success">
            <CheckCircle2 className="size-6" />
          </span>
          <div>
            <h3 className="font-semibold">Appointment Confirmed</h3>
            <p className="text-sm text-muted-foreground">
              Appointment ID: <span className="font-medium text-foreground">{confirmedId}</span>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Row label="Doctor" value={draft.doctor} />
          <Row label="Date" value={draft.date} />
          <Row label="Time" value={draft.time} />
          <Row label="Patient" value={draft.patient} />
          <Row label="Phone" value={draft.patientPhone} />
          <Row label="Email" value={draft.patientEmail} />
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onViewAppointment} className="sm:flex-1">
            View Appointment
          </Button>
          <Button variant="outline" onClick={onStartNew} className="sm:flex-1">
            Start New Booking
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold">Appointment Summary</h3>
      <p className="text-sm text-muted-foreground">
        Please review the details collected by the assistant.
      </p>
      <div className="mt-4">
        <Row label="Doctor" value={draft.doctor} />
        <Row label="Specialty" value={draft.specialty} />
        <Row label="Date" value={draft.date} />
        <Row label="Time" value={draft.time} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="patient-name">Patient name</Label>
            <Input
              id="patient-name"
              value={draft.patient}
              onChange={(event) => onDraftChange({ patient: event.target.value })}
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="patient-phone">Phone number</Label>
            <Input
              id="patient-phone"
              type="tel"
              value={draft.patientPhone}
              onChange={(event) => onDraftChange({ patientPhone: event.target.value })}
              placeholder="+94 77 555 0110"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="patient-email">Email address</Label>
            <Input
              id="patient-email"
              type="email"
              value={draft.patientEmail}
              onChange={(event) => onDraftChange({ patientEmail: event.target.value })}
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="mt-3">
          <Row label="Language" value={draft.language} />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={onConfirm}
          disabled={
            !draft.patient.trim() || !draft.patientPhone.trim() || !draft.patientEmail.trim()
          }
          className="sm:flex-1"
        >
          Confirm Appointment
        </Button>
        <Button variant="outline" onClick={onChangeDetails} className="sm:flex-1">
          Change Details
        </Button>
      </div>
    </Card>
  );
}
