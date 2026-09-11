import { RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { ACTORS, ROOM } from "@/lib/deal/cast";
import { quorumBlockers, useDealStore } from "@/lib/deal/store";
import { useRoomRuntime } from "@/lib/deal/use-room-runtime";
import { Button } from "@/components/ui/button";
import { PresenceStack } from "./avatars";
import { TermSheet } from "./term-sheet";
import { AgentFeed } from "./agent-feed";
import { CommentsPanel } from "./comments-panel";
import { PresenceRail } from "./presence-rail";
import { MemberImpact } from "./member-impact";
import { Inbox } from "./inbox";
import { cn } from "@/lib/utils";

export function DealRoom() {
  useRoomRuntime();
  const presence = useDealStore((s) => s.presence);
  const terms = useDealStore((s) => s.terms);
  const phase = useDealStore((s) => s.phase);
  const signed = useDealStore((s) => s.signed);
  const sendToLegal = useDealStore((s) => s.sendToLegal);
  const replay = useDealStore((s) => s.replay);
  const onlineCount = Object.values(presence).filter((p) => p.online).length;
  const blockers = quorumBlockers(terms);
  const ready = blockers.length === 0 && signed.chair && phase !== "quorum";

  function onSend() {
    if (useDealStore.getState().phase === "quorum") return;
    const ok = sendToLegal();
    if (!ok) {
      const latest = quorumBlockers(useDealStore.getState().terms);
      const chairOk = useDealStore.getState().signed.chair;
      toast("Quorum not reached", {
        description: latest.length
          ? `The chair still needs a decision on ${latest.join(" and ")}.`
          : !chairOk
            ? "Elena Voss still needs to countersign."
            : "Accept the rebate and DIR patches first.",
      });
      return;
    }
    toast.dismiss();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl tracking-tight">Quorum</span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <span className="live-dot size-1.5 rounded-full bg-ok" />
                Room live
                <span className="font-mono text-subtle">{ROOM.id}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <PresenceStack presence={presence} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toast.dismiss();
                  replay();
                }}
                className="min-h-11"
              >
                <RotateCcw />
                Replay
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {ROOM.motion} · {ROOM.daysOut} days to close
              </p>
              <h1 className="font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
                {ROOM.account}
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground text-pretty">
                {ROOM.stage}. Owner-pharmacists on the board. Agents patch the
                shared terms; you and the chair decide before NCPA.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-4 sm:min-w-80">
              <Fact label="Dues" value={ROOM.dues} />
              <Fact label="NCPA" value={ROOM.close} />
              <Fact label="In room" value={`${onlineCount}`} />
            </dl>
          </div>
        </div>
      </header>

      {phase === "quorum" ? (
        <div className="border-b border-border bg-raised">
          <p className="mx-auto max-w-7xl px-4 py-3 text-sm text-foreground sm:px-6 lg:px-8">
            Quorum reached — 2027 terms locked. Packet queued for AmerisourceBergen.
          </p>
        </div>
      ) : null}

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-start gap-8 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-8">
        <div className="order-1 flex flex-col gap-8 lg:col-span-7">
          <MemberImpact />
          <TermSheet />
        </div>
        <aside className="order-2 flex flex-col gap-6 lg:sticky lg:top-4 lg:col-span-5 lg:max-h-rail lg:overflow-y-auto">
          <PresenceRail />
          <Inbox />
          <div className="flex min-h-64 flex-1 flex-col overflow-hidden">
            <AgentFeed />
          </div>
        </aside>
        <div className="order-3 lg:col-span-7">
          <CommentsPanel />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="min-w-0">
            <SignatureRow signed={signed} phase={phase} />
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {phase === "quorum"
                ? "CEO and Chairman have signed. Agents remain in the room as witnesses."
                : ready
                  ? "Rebate, DIR floor, and chair countersign are in. Send the packet."
                  : signed.chair
                    ? "Elena has countersigned. Send the packet to AmerisourceBergen."
                    : "Accept the rebate and DIR patches to reach quorum with the chair."}
            </p>
          </div>
          <Button
            onClick={onSend}
            disabled={phase === "quorum"}
            className="min-h-11 w-full sm:w-auto"
          >
            <Send />
            {phase === "quorum" ? "Packet queued" : "Send to AmerisourceBergen"}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function SignatureRow({
  signed,
  phase,
}: {
  signed: { you: boolean; chair: boolean };
  phase: string;
}) {
  const youDone = signed.you || phase === "quorum";
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      <Sig actorId="chair" done={signed.chair} />
      <Sig actorId="you" done={youDone} />
    </ul>
  );
}

function Sig({ actorId, done }: { actorId: string; done: boolean }) {
  const actor = ACTORS[actorId];
  if (!actor) return null;
  return (
    <li className="flex items-center gap-2 text-xs">
      <span
        className={cn(
          "size-1.5 rounded-full",
          done ? "bg-ok" : "bg-border",
        )}
      />
      <span className="text-foreground">{actor.name}</span>
      <span className="text-subtle">{done ? "signed" : "awaiting"}</span>
    </li>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-subtle uppercase">{label}</dt>
      <dd className="mt-0.5 font-display text-lg leading-tight tracking-tight tabular-nums">
        {value}
      </dd>
    </div>
  );
}
