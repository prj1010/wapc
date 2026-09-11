import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTORS } from "@/lib/deal/cast";
import { useDealStore } from "@/lib/deal/store";
import type { Term, TermStatus } from "@/lib/deal/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActorMark } from "./avatars";

const STATUS_BADGE: Record<TermStatus, { label: string; variant: "default" | "proposed" | "flagged" | "approved" }> = {
  stable: { label: "Live", variant: "default" },
  proposed: { label: "Proposed", variant: "proposed" },
  flagged: { label: "Flagged", variant: "flagged" },
  approved: { label: "Approved", variant: "approved" },
};

export function TermSheet() {
  const terms = useDealStore((s) => s.terms);
  const selectedTermId = useDealStore((s) => s.selectedTermId);
  const selectTerm = useDealStore((s) => s.selectTerm);
  const acceptProposal = useDealStore((s) => s.acceptProposal);
  const rejectProposal = useDealStore((s) => s.rejectProposal);
  const phase = useDealStore((s) => s.phase);

  return (
    <section className="flex min-h-0 flex-col">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-foreground tracking-tight">
          Board terms
        </h2>
        <p className="font-mono text-xs text-subtle">storage · /terms</p>
      </header>
      <ul className="flex flex-col gap-2">
        {terms.map((term) => (
          <TermRow
            key={term.id}
            term={term}
            selected={selectedTermId === term.id}
            locked={phase === "quorum"}
            onSelect={() => selectTerm(term.id)}
            onAccept={() => acceptProposal(term.id)}
            onReject={() => rejectProposal(term.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function TermRow({
  term,
  selected,
  locked,
  onSelect,
  onAccept,
  onReject,
}: {
  term: Term;
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const actionable = term.status === "proposed" || term.status === "flagged";
  const actor = term.proposedBy ? ACTORS[term.proposedBy] : null;
  const badge = STATUS_BADGE[term.status];
  const changed = term.value !== term.original;

  return (
    <li>
      <div
        onClick={onSelect}
        className={cn(
          "w-full cursor-pointer rounded-lg bg-card px-4 py-3 text-left shadow-border transition-[box-shadow,background-color] duration-150 ease-out",
          selected && "bg-raised ring-1 ring-primary/35 ring-inset",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {term.label}
              </p>
              {term.status !== "stable" ? (
                <Badge variant={badge.variant}>{badge.label}</Badge>
              ) : null}
            </div>
            <p className="mt-1 font-display text-2xl leading-tight tracking-tight text-foreground tabular-nums">
              {changed ? (
                <>
                  <span className="mr-2 text-lg text-subtle line-through">
                    {term.original}
                  </span>
                  {term.value}
                </>
              ) : (
                term.value
              )}
            </p>
            {term.unit ? (
              <p className="mt-0.5 text-xs text-subtle">{term.unit}</p>
            ) : null}
          </div>
          {actor ? (
            <div className="flex items-center gap-2 pt-1">
              <ActorMark actor={actor} size="sm" />
            </div>
          ) : null}
        </div>
        {actionable && !locked ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
            >
              <Check />
              Accept patch
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
            >
              <RotateCcw />
              Revert
            </Button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
