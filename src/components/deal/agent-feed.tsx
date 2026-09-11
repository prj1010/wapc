import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ACTORS } from "@/lib/deal/cast";
import { useDealStore } from "@/lib/deal/store";
import type { FeedItem } from "@/lib/deal/types";
import { ActorMark } from "./avatars";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AgentFeed() {
  const feed = useDealStore((s) => s.feed);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [feed.length]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-foreground tracking-tight">Feed</h2>
        <p className="font-mono text-xs text-subtle">feeds.create_message</p>
      </header>
      <ScrollArea className="h-72 flex-1 rounded-xl bg-card p-3 shadow-border lg:h-auto">
        <ol className="flex flex-col gap-3 pr-2">
          {feed.length === 0 ? (
            <li className="px-1 py-6 text-sm text-muted-foreground">
              Room is live. Agents will join and patch storage as they work.
            </li>
          ) : (
            feed.map((item) => <FeedRow key={item.id} item={item} />)
          )}
          <div ref={bottom} />
        </ol>
      </ScrollArea>
    </section>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const actor = item.actorId ? ACTORS[item.actorId] : null;
  const isPatch = item.kind === "patch";

  return (
    <li className="flex gap-2.5">
      {actor ? (
        <ActorMark actor={actor} size="sm" />
      ) : (
        <span className="mt-1 size-7 shrink-0 rounded-full bg-raised" />
      )}
      <div className="min-w-0 pt-0.5">
        <p className="text-xs text-muted-foreground">
          {actor ? (
            <>
              <span className="font-medium text-foreground">{actor.name}</span>
              <span className="text-subtle"> · {actor.role}</span>
            </>
          ) : (
            <span className="font-medium text-foreground">Room</span>
          )}
        </p>
        <p
          className={cn(
            "mt-0.5 text-sm leading-snug text-pretty",
            isPatch
              ? "font-mono text-xs text-muted-foreground"
              : "text-foreground",
          )}
        >
          {item.text}
        </p>
      </div>
    </li>
  );
}
