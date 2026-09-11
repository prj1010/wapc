import { MEMBER } from "./cast";
import type { Term } from "./types";

export type MemberImpact = {
  pharmacy: string;
  market: string;
  rebatePct: number;
  rebateUsd: number;
  clawback: number;
  net: number;
  dirCovered: boolean;
  rebateLifted: boolean;
};

export function memberImpact(terms: Term[]): MemberImpact {
  const rebate = terms.find((t) => t.id === "rebate");
  const dir = terms.find((t) => t.id === "dir");
  const rebatePct = Number.parseFloat((rebate?.value ?? "1.8").replace("%", "")) || 1.8;
  const dirCovered = (dir?.value ?? "None") !== "None";
  const rebateUsd = Math.round(MEMBER.brandBook * (rebatePct / 100));
  const clawback = dirCovered ? MEMBER.dirFloor : MEMBER.dirOpen;
  return {
    pharmacy: MEMBER.name,
    market: MEMBER.market,
    rebatePct,
    rebateUsd,
    clawback,
    net: rebateUsd - clawback,
    dirCovered,
    rebateLifted: rebatePct > 1.8 + 1e-6,
  };
}

export function money(n: number) {
  const abs = Math.abs(n);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(abs);
  return n < 0 ? `−${formatted}` : formatted;
}
