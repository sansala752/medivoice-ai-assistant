import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  CalendarDays,
  Headphones,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";

const ITEMS = [
  { to: "/staff", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/staff/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/staff/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/staff/patients", label: "Patients", icon: Users },
  { to: "/staff/ai-requests", label: "AI Requests", icon: Bot },
  { to: "/staff/human-requests", label: "Human Requests", icon: Headphones },
  { to: "/staff/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  return (
    <aside className="flex shrink-0 flex-col gap-6 bg-sidebar px-3 py-5 text-sidebar-foreground md:h-screen md:w-60 md:sticky md:top-0">
      <Link to="/staff" className="flex items-center gap-2.5 px-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Activity className="size-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">MediVoice</span>
      </Link>

      <nav className="flex flex-wrap gap-1 md:flex-col">
        {ITEMS.map(({ to, label, icon: Icon, ...rest }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: "exact" in rest ? rest.exact : false }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{ className: "bg-sidebar-accent !text-sidebar-accent-foreground font-medium" }}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto hidden rounded-lg bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/80 md:block">
        <p className="font-medium text-sidebar-foreground">Patient assistant</p>
        <Link to="/" className="text-sidebar-primary hover:underline">
          Open AI Appointment Assistant
        </Link>
      </div>
    </aside>
  );
}
