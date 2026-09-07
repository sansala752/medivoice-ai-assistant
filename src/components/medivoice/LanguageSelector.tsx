import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/medivoice/data";

interface Props {
  value: string;
  onChange: (label: string) => void;
  className?: string;
}

export function LanguageSelector({ value, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className ?? "w-[190px] bg-card"} aria-label="Select language">
        <Globe className="size-4 text-muted-foreground" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.label}>
            <span className="flex w-full items-center justify-between gap-3">
              <span>{lang.label}</span>
              <span className="text-xs text-muted-foreground">{lang.native}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
