import { CalendarClock, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Doctor } from "@/lib/medivoice/types";

interface Props {
  doctor: Doctor;
  onViewAvailability: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onViewAvailability }: Props) {
  const availability = doctor.availableToday
    ? "Available today"
    : doctor.availableTomorrow
      ? "Available tomorrow"
      : "Next availability this week";

  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Stethoscope className="size-5" />
        </span>
        <div>
          <h3 className="font-semibold">{doctor.name}</h3>
          <p className="text-sm text-accent">{doctor.specialty}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{doctor.description}</p>

      <div className="mt-auto space-y-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarClock className="size-4 text-success" />
          <span className={doctor.availableToday ? "text-success font-medium" : ""}>
            {availability}
          </span>
        </p>
        <Button variant="outline" className="w-full" onClick={() => onViewAvailability(doctor)}>
          View Availability
        </Button>
      </div>
    </Card>
  );
}
