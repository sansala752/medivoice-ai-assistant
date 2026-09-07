import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getDoctorAvailability } from "@/lib/medivoice/api";
import type { Doctor } from "@/lib/medivoice/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctors: Doctor[];
  doctorId: string;
  onDoctorChange: (id: string) => void;
  onConfirm: (doctorId: string, date: string, slot: string) => void;
}

export function DoctorAvailability({
  open,
  onOpenChange,
  doctors,
  doctorId,
  onDoctorChange,
  onConfirm,
}: Props) {
  const [date, setDate] = useState("2026-09-10");
  const [slots, setSlots] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSelected(null);
    getDoctorAvailability(doctorId, date).then((res) => {
      if (!cancelled) setSlots(res);
    });
    return () => {
      cancelled = true;
    };
  }, [doctorId, date]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Check Availability</DialogTitle>
          <DialogDescription>
            Choose a doctor and date to see open appointment slots.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Doctor</Label>
            <Select value={doctorId} onValueChange={onDoctorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability-date">Date</Label>
            <Input
              id="availability-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Available slots</Label>
          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No slots for this date.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelected(slot)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    selected === slot
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40 hover:bg-secondary",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button disabled={!selected} onClick={() => selected && onConfirm(doctorId, date, selected)}>
            Use This Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
