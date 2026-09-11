export type ScriptEvent =
  | { t: number; type: "join"; actorId: string; status: string }
  | { t: number; type: "status"; actorId: string; status: string | null }
  | {
      t: number;
      type: "feed";
      actorId: string | null;
      kind: "system" | "status" | "note" | "decision";
      text: string;
    }
  | {
      t: number;
      type: "patch";
      actorId: string;
      termId: string;
      value: string;
      path: string;
    }
  | { t: number; type: "flag"; actorId: string; termId: string }
  | { t: number; type: "comment"; actorId: string; termId: string; body: string };

export const SCRIPT: ScriptEvent[] = [
  {
    t: 900,
    type: "join",
    actorId: "rebate",
    status: "Modeling member rebate",
  },
  {
    t: 1400,
    type: "feed",
    actorId: "rebate",
    kind: "status",
    text: "Pulling last four wholesaler cycles and member-level rebate yield.",
  },
  {
    t: 2800,
    type: "feed",
    actorId: "rebate",
    kind: "note",
    text: "1.8% sliding rebate is below peer co-ops. A 2.4% tier still leaves brand COGS untouched.",
  },
  {
    t: 4000,
    type: "patch",
    actorId: "rebate",
    termId: "rebate",
    value: "2.4%",
    path: "/terms/rebate",
  },
  {
    t: 4300,
    type: "status",
    actorId: "rebate",
    status: "Waiting on the chair",
  },
  {
    t: 5400,
    type: "join",
    actorId: "chair",
    status: "Reading member impact",
  },
  {
    t: 6200,
    type: "feed",
    actorId: "chair",
    kind: "note",
    text: "In the room. I can sign 2.4% if DIR protection comes in. Not a rebate giveaway on its own.",
  },
  {
    t: 7000,
    type: "comment",
    actorId: "chair",
    termId: "rebate",
    body: "I will countersign 2.4% only with a reimbursement floor. Members feel clawbacks at the counter — rebate without DIR cover is a press release, not a win.",
  },
  {
    t: 8200,
    type: "join",
    actorId: "risk",
    status: "Reading PBM clawbacks",
  },
  {
    t: 9000,
    type: "feed",
    actorId: "risk",
    kind: "note",
    text: "Independent volume is taking DIR recoupments after the fact. No floor means the 2.4% rebate can be eaten in a single reconciliation.",
  },
  {
    t: 10200,
    type: "flag",
    actorId: "risk",
    termId: "dir",
  },
  {
    t: 10800,
    type: "patch",
    actorId: "risk",
    termId: "dir",
    value: "MAC + $1.50",
    path: "/terms/dir",
  },
  {
    t: 11400,
    type: "comment",
    actorId: "risk",
    termId: "dir",
    body: "Propose a MAC + $1.50 reimbursement floor on the independent book. Without it, sliding rebate is cosmetic.",
  },
  {
    t: 11800,
    type: "status",
    actorId: "risk",
    status: null,
  },
  {
    t: 12800,
    type: "join",
    actorId: "intel",
    status: "Scanning peer co-ops",
  },
  {
    t: 13800,
    type: "feed",
    actorId: "intel",
    kind: "note",
    text: "The large warehouse co-op is pitching membership + McKesson. WAPC’s edge is owner-board control, ABC relationship, and zero dues.",
  },
  {
    t: 15000,
    type: "feed",
    actorId: "intel",
    kind: "note",
    text: "Do not match warehouse dues. Hold brand COGS. Win on rebate transparency and DIR cover before NCPA.",
  },
  {
    t: 15600,
    type: "comment",
    actorId: "intel",
    termId: "rebate",
    body: "Pharmacy500 listing is leverage, not a reason to give COGS. Members joined WAPC to buy as owners — keep $0 dues and lock the floor.",
  },
  {
    t: 16000,
    type: "status",
    actorId: "intel",
    status: null,
  },
  {
    t: 16800,
    type: "status",
    actorId: "chair",
    status: "Ready to countersign",
  },
  {
    t: 17400,
    type: "feed",
    actorId: "chair",
    kind: "status",
    text: "Ready. Accept both patches and I will countersign for the board.",
  },
];
