import { CalendarClock, Eye, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import type { Appointment } from "@/lib/medivoice/types";

interface Props {
  appointments: Appointment[];
  showActions?: boolean;
  onView?: (a: Appointment) => void;
  onReschedule?: (a: Appointment) => void;
  onCancel?: (a: Appointment) => void;
}

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function AppointmentTable({
  appointments,
  showActions = false,
  onView,
  onReschedule,
  onCancel,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            {showActions ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showActions ? 8 : 7}
                className="py-8 text-center text-muted-foreground"
              >
                No appointments match your filters.
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.patient}</TableCell>
                <TableCell>{a.doctorName}</TableCell>
                <TableCell className="text-muted-foreground">{a.specialty}</TableCell>
                <TableCell>{formatDate(a.date)}</TableCell>
                <TableCell>{a.time}</TableCell>
                <TableCell>
                  <StatusBadge value={a.source} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={a.status} />
                </TableCell>
                {showActions ? (
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onView?.(a)}>
                        <Eye className="size-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onReschedule?.(a)}>
                        <CalendarClock className="size-4" />
                        Reschedule
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onCancel?.(a)}
                        disabled={a.status === "Cancelled"}
                      >
                        <XCircle className="size-4" />
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
