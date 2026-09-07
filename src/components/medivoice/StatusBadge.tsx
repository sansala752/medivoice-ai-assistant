import { cn } from "@/lib/utils";
import type { AppointmentStatus, BookingSource, HumanRequestStatus } from "@/lib/medivoice/types";

type BadgeValue = AppointmentStatus | BookingSource | HumanRequestStatus | string;

const STYLES: Record<string, string> = {
  Confirmed: "bg-success/12 text-success border-success/25",
  Pending: "bg-warning/15 text-warning-foreground border-warning/35",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/25",
  AI: "bg-accent/12 text-accent border-accent/30",
  Human: "bg-primary/10 text-primary border-primary/25",
  Waiting: "bg-warning/15 text-warning-foreground border-warning/35",
  "Assigned to You": "bg-success/12 text-success border-success/25",
  Closed: "bg-muted text-muted-foreground border-border",
  Active: "bg-success/12 text-success border-success/25",
  "On Leave": "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ value, className }: { value: BadgeValue; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STYLES[value] ?? "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      {value}
    </span>
  );
}
