import { ACTORS } from "@/lib/deal/cast";
import { useDealStore } from "@/lib/deal/store";
import { ActorMark } from "./avatars";

const ORDER = ["you", "chair", "rebate", "risk", "intel"] as const;

export function PresenceRail() {
  const presence = useDealStore((s) => s.presence);

  return (
    <section>
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-foreground tracking-tight">
          In the room
        </h2>
        <p className="font-mono text-xs text-subtle">presence.set</p>
      </header>
      <ul className="flex flex-col gap-1 rounded-xl bg-card p-2 shadow-border">
        {ORDER.map((id) => {
          const actor = ACTORS[id];
          const p = presence[id];
          if (!actor || !p) return null;
          return (
            <li
              key={id}
              className="flex items-center gap-3 rounded-lg px-2 py-2"
            >
              <ActorMark actor={actor} dimmed={!p.online} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {actor.name}
                  <span className="ml-1.5 font-normal text-subtle">
                    {actor.kind === "agent" ? "agent" : actor.role}
                  </span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.online ? p.status ?? "In the room" : "Not connected"}
                </p>
              </div>
              {p.online && p.status ? (
                <span className="hidden shrink-0 font-mono text-xs text-subtle sm:inline">
                  live
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
