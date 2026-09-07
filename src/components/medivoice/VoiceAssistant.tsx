import { Bot, Mic, MicOff, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type VoiceStatus = "Ready to help" | "Listening..." | "Processing..." | "Speaking...";

interface Props {
  status: VoiceStatus;
  active: boolean;
  language: string;
  onStart: () => void;
  onEnd: () => void;
  onToggleMic: () => void;
}

const STATUS_TONE: Record<VoiceStatus, string> = {
  "Ready to help": "text-muted-foreground",
  "Listening...": "text-accent",
  "Processing...": "text-warning-foreground",
  "Speaking...": "text-primary",
};

export function VoiceAssistant({
  status,
  active,
  language,
  onStart,
  onEnd,
  onToggleMic,
}: Props) {
  const listening = status === "Listening...";

  return (
    <Card className="flex flex-col items-center gap-6 p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="size-8" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">MediVoice Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Speaking with you in <span className="font-medium text-foreground">{language}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleMic}
        disabled={!active}
        aria-label={listening ? "Stop listening" : "Start listening"}
        className={cn(
          "flex size-32 items-center justify-center rounded-full border-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          listening
            ? "border-accent/40 bg-accent text-accent-foreground"
            : "border-primary/15 bg-primary/5 text-primary hover:bg-primary/10",
        )}
      >
        {active ? <Mic className="size-12" /> : <MicOff className="size-12" />}
      </button>

      <div>
        <p className={cn("text-base font-semibold", STATUS_TONE[status])}>{status}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {active
            ? "Tap the microphone to speak, or type your message."
            : "Start a conversation to book an appointment by voice."}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button onClick={onStart} disabled={active} className="sm:min-w-44">
          <Play className="size-4" />
          Start Conversation
        </Button>
        <Button onClick={onEnd} variant="outline" disabled={!active} className="sm:min-w-44">
          <Square className="size-4" />
          End Conversation
        </Button>
      </div>
    </Card>
  );
}
