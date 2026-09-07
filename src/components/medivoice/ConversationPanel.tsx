import { useState } from "react";
import { Mic, Send, UserRound, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/medivoice/types";

interface Props {
  messages: Message[];
  language: string;
  onSend: (text: string) => void;
  onMic: () => void;
  onRequestHuman: () => void;
}

export function ConversationPanel({ messages, language, onSend, onMic, onRequestHuman }: Props) {
  const [draft, setDraft] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">Conversation Transcript</h2>
          <p className="text-xs text-muted-foreground">Language: {language}</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <span className="size-2 rounded-full bg-success" />
          AI Assistant Online
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 max-h-[420px] min-h-[320px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex gap-3", m.role === "patient" && "flex-row-reverse text-right")}
          >
            <span
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                m.role === "ai" ? "bg-primary/10 text-primary" : "bg-accent/12 text-accent",
              )}
            >
              {m.role === "ai" ? <Bot className="size-4" /> : <UserRound className="size-4" />}
            </span>
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {m.role === "ai" ? "AI Assistant" : "Patient"}
                </span>
                <span>{m.time}</span>
              </div>
              <p
                className={cn(
                  "mt-1 rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "ai"
                    ? "border-border bg-secondary text-foreground"
                    : "border-primary/20 bg-primary/5 text-foreground",
                )}
              >
                {m.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border px-4 py-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Type your message in ${language}...`}
          aria-label="Message"
        />
        <Button type="button" variant="outline" size="icon" onClick={onMic} aria-label="Speak">
          <Mic className="size-4" />
        </Button>
        <Button type="submit" size="icon" aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </form>

      <div className="border-t border-border px-4 py-2.5 text-center">
        <button
          type="button"
          onClick={onRequestHuman}
          className="text-xs font-medium text-primary hover:underline"
        >
          Talk to a human staff member
        </button>
      </div>
    </Card>
  );
}
