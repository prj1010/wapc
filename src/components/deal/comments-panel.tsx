import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ACTORS } from "@/lib/deal/cast";
import { useDealStore } from "@/lib/deal/store";
import { Button } from "@/components/ui/button";
import { ActorMark } from "./avatars";

export function CommentsPanel() {
  const terms = useDealStore((s) => s.terms);
  const selectedTermId = useDealStore((s) => s.selectedTermId);
  const comments = useDealStore((s) => s.comments);
  const addComment = useDealStore((s) => s.addComment);
  const phase = useDealStore((s) => s.phase);
  const [draft, setDraft] = useState("");

  const term = terms.find((t) => t.id === selectedTermId) ?? null;
  const thread = comments.filter((c) => c.termId === selectedTermId);

  function submit() {
    if (!term) return;
    addComment(term.id, draft);
    setDraft("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <section className="flex min-h-0 flex-col">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-foreground tracking-tight">
          Comments
        </h2>
        <p className="font-mono text-xs text-subtle">
          {term ? `thread · /terms/${term.id}` : "select a term"}
        </p>
      </header>
      <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-card p-4 shadow-border">
        {!term ? (
          <p className="py-6 text-sm text-muted-foreground">
            Select a term to pin a comment for the room.
          </p>
        ) : (
          <>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              On {term.label}
            </p>
            <ol className="mt-3 flex flex-col gap-3">
              {thread.length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  No comments yet. The chair and agents will pin here as they work.
                </li>
              ) : (
                thread.map((c) => {
                  const actor = ACTORS[c.actorId];
                  if (!actor) return null;
                  return (
                    <li key={c.id} className="flex gap-2.5">
                      <ActorMark actor={actor} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {actor.name}
                          </span>
                          <span className="text-subtle"> · {actor.role}</span>
                        </p>
                        <p className="mt-0.5 text-sm leading-snug text-pretty text-foreground">
                          {c.body}
                        </p>
                      </div>
                    </li>
                  );
                })
              )}
            </ol>
            <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2">
              <label className="sr-only" htmlFor="room-comment">
                Comment on {term.label}
              </label>
              <textarea
                id="room-comment"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                disabled={phase === "quorum"}
                rows={3}
                placeholder="Pin a note for the room…"
                suppressHydrationWarning
                className="min-h-20 w-full resize-none rounded-md bg-raised px-3 py-2.5 text-sm text-foreground shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={phase === "quorum" || !draft.trim()}>
                  Pin comment
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
