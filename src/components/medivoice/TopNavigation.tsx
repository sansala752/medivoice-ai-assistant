import { Link } from "@tanstack/react-router";
import { Activity, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "./LanguageSelector";

interface Props {
  language: string;
  onLanguageChange: (language: string) => void;
}

export function TopNavigation({ language, onLanguageChange }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">MediVoice</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
            activeProps={{ className: "!text-primary bg-secondary font-medium" }}
          >
            AI Appointment Assistant
          </Link>
          <Link
            to="/doctors"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
            activeProps={{ className: "!text-primary bg-secondary font-medium" }}
          >
            Doctors
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSelector value={language} onChange={onLanguageChange} />
          <Button asChild variant="outline">
            <Link to="/staff">
              <LogIn className="size-4" />
              Staff Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
