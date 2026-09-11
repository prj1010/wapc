import { useEffect } from "react";
import { SCRIPT } from "./script";
import { useDealStore } from "./store";

export function useRoomRuntime() {
  const runId = useDealStore((s) => s.runId);
  const applyEvent = useDealStore((s) => s.applyEvent);
  const tick = useDealStore((s) => s.tick);

  useEffect(() => {
    const started = performance.now();
    const timeouts: number[] = [];
    const interval = window.setInterval(() => {
      tick(Math.round(performance.now() - started));
    }, 200);

    for (const event of SCRIPT) {
      timeouts.push(
        window.setTimeout(() => {
          applyEvent(event, event.t);
        }, event.t),
      );
    }

    return () => {
      window.clearInterval(interval);
      for (const id of timeouts) window.clearTimeout(id);
    };
  }, [runId, applyEvent, tick]);
}
