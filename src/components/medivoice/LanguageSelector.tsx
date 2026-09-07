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
  onChange: (code: string, label: string) => void;
  className?: string;
}

export function LanguageSelector({ value, onChange, className }: Props) {
  const handleChange = (code: string) => {
    const language = LANGUAGES.find((item) => item.code === code);
    if (language) onChange(language.code, language.label);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className={className ?? "w-[190px] bg-card"} aria-label="Select language">
        <Globe className="size-4 text-muted-foreground" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
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
