import { ACTORS } from "@/lib/deal/cast";
import { useDealStore } from "@/lib/deal/store";
import { ActorMark } from "./avatars";
import { cn } from "@/lib/utils";

export function Inbox() {
  const notices = useDealStore((s) => s.notices);
  const openNotice = useDealStore((s) => s.openNotice);
  const unread = notices.filter((n) => !n.read).length;

  return (
    <section>
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-foreground tracking-tight">
          Inbox
        </h2>
        <p className="font-mono text-xs text-subtle">
          notifications.get{unread ? ` · ${unread}` : ""}
        </p>
      </header>
      <ul className="flex flex-col gap-1 rounded-xl bg-card p-2 shadow-border">
        {notices.length === 0 ? (
          <li className="px-2 py-3 text-sm text-muted-foreground">
            Patches and flags will land here for the board.
          </li>
        ) : (
          notices.slice(0, 5).map((n) => {
            const actor = ACTORS[n.actorId];
            if (!actor) return null;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => openNotice(n.id)}
                  className={cn(
                    "flex min-h-11 w-full items-start gap-3 rounded-lg px-2 py-2 text-left",
                    !n.read && "bg-raised",
                  )}
                >
                  <ActorMark actor={actor} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {n.title}
                      </span>
                      {!n.read ? (
                        <span className="size-1.5 shrink-0 rounded-full bg-ok" />
                      ) : null}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {n.body}
                    </span>
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
