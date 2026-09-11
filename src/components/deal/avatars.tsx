import { cn } from "@/lib/utils";
import { ACTORS } from "@/lib/deal/cast";
import type { Actor, Presence } from "@/lib/deal/types";

const TONE: Record<Actor["tone"], string> = {
  steel: "bg-steel text-background",
  sage: "bg-ok text-background",
  paper: "bg-primary text-primary-foreground",
  clay: "bg-flag text-background",
  mist: "bg-mist text-background",
};

export function ActorMark({
  actor,
  size = "md",
  dimmed,
}: {
  actor: Actor;
  size?: "sm" | "md";
  dimmed?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium",
        size === "sm" ? "size-7 text-xs" : "size-9 text-xs",
        TONE[actor.tone],
        dimmed && "opacity-35",
      )}
      aria-hidden
    >
      {actor.initials}
    </span>
  );
}

export function PresenceStack({
  presence,
}: {
  presence: Record<string, Presence>;
}) {
  const order = ["you", "chair", "rebate", "risk", "intel"];
  const online = order.filter((id) => presence[id]?.online);
  const offline = order.filter((id) => !presence[id]?.online);

  return (
    <div className="flex items-center">
      {[...online, ...offline].map((id, i) => {
        const actor = ACTORS[id];
        if (!actor) return null;
        const p = presence[id];
        return (
          <span
            key={id}
            className={cn("relative", i > 0 && "-ml-2")}
            title={`${actor.name} · ${p?.online ? p.status ?? "In the room" : "Not in room"}`}
          >
            <ActorMark actor={actor} dimmed={!p?.online} />
            {p?.online ? (
              <span className="absolute right-0 bottom-0 size-2 rounded-full bg-ok ring-2 ring-background" />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
