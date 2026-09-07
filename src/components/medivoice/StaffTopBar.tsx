import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function StaffTopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="truncate text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="w-52 pl-9" aria-label="Search" />
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary"
        >
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-accent" />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            RN
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium">Rachel Nolan</p>
            <p className="text-xs text-muted-foreground">Front Desk Staff</p>
          </div>
        </div>
      </div>
    </header>
  );
}
