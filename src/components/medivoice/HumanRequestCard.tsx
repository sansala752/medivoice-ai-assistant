import { Clock, Languages, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import type { HumanRequest } from "@/lib/medivoice/types";

interface Props {
  request: HumanRequest;
  onAccept: (id: string) => void;
  onViewConversation: (request: HumanRequest) => void;
}

export function HumanRequestCard({ request, onAccept, onViewConversation }: Props) {
  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </span>
          <div>
            <p className="font-semibold">{request.patient}</p>
            <p className="text-xs text-muted-foreground">{request.id}</p>
          </div>
        </div>
        <StatusBadge value={request.status} />
      </div>

      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <Languages className="size-4" /> Language: {request.language}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="size-4" /> Time: {request.time}
        </p>
      </div>
      <p className="text-sm">
        <span className="text-muted-foreground">Reason: </span>
        {request.reason}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={() => onAccept(request.id)}
          disabled={request.status !== "Waiting"}
          className="sm:w-auto"
        >
          {request.status === "Waiting" ? "Accept Request" : "Accepted"}
        </Button>
        <Button variant="outline" onClick={() => onViewConversation(request)}>
          View Conversation
        </Button>
      </div>
    </Card>
  );
}
