import { MEMBER } from "@/lib/deal/cast";
import { memberImpact, money } from "@/lib/deal/impact";
import { useDealStore } from "@/lib/deal/store";
import { cn } from "@/lib/utils";

export function MemberImpact() {
  const terms = useDealStore((s) => s.terms);
  const phase = useDealStore((s) => s.phase);
  const selectTerm = useDealStore((s) => s.selectTerm);
  const impact = memberImpact(terms);
  const netPositive = impact.net >= 0;

  return (
    <section>
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-foreground tracking-tight">
          Member impact
        </h2>
        <p className="font-mono text-xs text-subtle">
          {phase === "quorum" ? "locked" : "on the table"}
        </p>
      </header>
      <div className="rounded-xl bg-card p-4 shadow-border">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Typical member
        </p>
        <p className="mt-1 font-display text-2xl leading-tight tracking-tight">
          {MEMBER.name}
        </p>
        <p className="mt-0.5 text-xs text-subtle">{MEMBER.market}</p>

        <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => selectTerm("rebate")}
            className="min-h-11 rounded-md bg-raised px-2 py-2 text-left"
          >
            <dt className="text-xs tracking-wide text-subtle uppercase">Rebate</dt>
            <dd
              className={cn(
                "mt-0.5 font-display text-lg leading-tight tracking-tight tabular-nums",
                impact.rebateLifted ? "text-ok" : "text-foreground",
              )}
            >
              {money(impact.rebateUsd)}
            </dd>
            <dd className="text-xs text-subtle">{impact.rebatePct.toFixed(1)}% of brand</dd>
          </button>
          <button
            type="button"
            onClick={() => selectTerm("dir")}
            className="min-h-11 rounded-md bg-raised px-2 py-2 text-left"
          >
            <dt className="text-xs tracking-wide text-subtle uppercase">Clawback</dt>
            <dd
              className={cn(
                "mt-0.5 font-display text-lg leading-tight tracking-tight tabular-nums",
                impact.dirCovered ? "text-ok" : "text-flag",
              )}
            >
              {money(-impact.clawback)}
            </dd>
            <dd className="text-xs text-subtle">
              {impact.dirCovered ? "Floor on" : "Unprotected"}
            </dd>
          </button>
          <div className="rounded-md bg-raised px-2 py-2">
            <dt className="text-xs tracking-wide text-subtle uppercase">Net / year</dt>
            <dd
              className={cn(
                "mt-0.5 font-display text-lg leading-tight tracking-tight tabular-nums",
                netPositive ? "text-ok" : "text-flag",
              )}
            >
              {netPositive ? money(impact.net) : money(impact.net)}
            </dd>
            <dd className="text-xs text-subtle">
              {netPositive ? "Keeps the rebate" : "Rebate is eaten"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
