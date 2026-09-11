import { create } from "zustand";
import { ACTORS, INITIAL_TERMS, QUORUM_TERMS, YOU_ID } from "./cast";
import type { ScriptEvent } from "./script";
import type {
  Comment,
  FeedItem,
  Notice,
  Presence,
  RoomPhase,
  Signatures,
  Term,
} from "./types";

function nid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function seedPresence(): Record<string, Presence> {
  return {
    [YOU_ID]: {
      actorId: YOU_ID,
      online: true,
      status: "In the room",
      joinedAt: 0,
    },
    chair: { actorId: "chair", online: false, status: null, joinedAt: null },
    rebate: { actorId: "rebate", online: false, status: null, joinedAt: null },
    risk: { actorId: "risk", online: false, status: null, joinedAt: null },
    intel: {
      actorId: "intel",
      online: false,
      status: null,
      joinedAt: null,
    },
  };
}

type DealState = {
  terms: Term[];
  presence: Record<string, Presence>;
  feed: FeedItem[];
  comments: Comment[];
  notices: Notice[];
  signed: Signatures;
  selectedTermId: string | null;
  phase: RoomPhase;
  clock: number;
  runId: number;
  acceptProposal: (termId: string) => void;
  rejectProposal: (termId: string) => void;
  addComment: (termId: string, body: string) => void;
  selectTerm: (termId: string | null) => void;
  openNotice: (id: string) => void;
  sendToLegal: () => boolean;
  applyEvent: (event: ScriptEvent, at: number) => void;
  tick: (clock: number) => void;
  replay: () => void;
};

function blockersOf(terms: Term[]): string[] {
  const blockers: string[] = [];
  for (const id of QUORUM_TERMS) {
    const term = terms.find((t) => t.id === id);
    if (!term) continue;
    if (term.status !== "approved") {
      blockers.push(term.label);
    }
  }
  return blockers;
}

function signaturesFor(
  terms: Term[],
  presence: Record<string, Presence>,
  youSigned: boolean,
): Signatures {
  const ready = blockersOf(terms).length === 0;
  const chairOnline = Boolean(presence.chair?.online);
  return {
    chair: ready && chairOnline,
    you: youSigned && ready,
  };
}

const idleState = {
  terms: INITIAL_TERMS.map((t) => ({ ...t })),
  presence: seedPresence(),
  feed: [
    {
      id: "feed-open",
      at: 0,
      actorId: null,
      kind: "system" as const,
      text: "Room opened. Board session on 2027 wholesaler terms before NCPA.",
    },
  ] as FeedItem[],
  comments: [] as Comment[],
  notices: [] as Notice[],
  signed: { you: false, chair: false } as Signatures,
  selectedTermId: "rebate" as string | null,
  phase: "opening" as RoomPhase,
  clock: 0,
};

export const useDealStore = create<DealState>((set, get) => ({
  ...idleState,
  runId: 0,

  selectTerm: (termId) => set({ selectedTermId: termId }),

  tick: (clock) =>
    set({
      clock,
      phase: get().phase === "quorum" ? "quorum" : clock > 800 ? "live" : "opening",
    }),

  openNotice: (id) => {
    const { notices } = get();
    const notice = notices.find((n) => n.id === id);
    if (!notice) return;
    set({
      notices: notices.map((n) => (n.id === id ? { ...n, read: true } : n)),
      selectedTermId: notice.termId ?? get().selectedTermId,
    });
  },

  applyEvent: (event, at) => {
    const state = get();
    if (state.phase === "quorum") return;

    if (event.type === "join") {
      set({
        presence: {
          ...state.presence,
          [event.actorId]: {
            actorId: event.actorId,
            online: true,
            status: event.status,
            joinedAt: at,
          },
        },
        feed: [
          ...state.feed,
          {
            id: nid("feed"),
            at,
            actorId: event.actorId,
            kind: "status",
            text: `${ACTORS[event.actorId]?.name ?? event.actorId} joined the room.`,
          },
        ],
      });
      return;
    }

    if (event.type === "status") {
      const prev = state.presence[event.actorId];
      set({
        presence: {
          ...state.presence,
          [event.actorId]: {
            ...(prev ?? {
              actorId: event.actorId,
              online: true,
              joinedAt: at,
            }),
            online: true,
            status: event.status,
          },
        },
      });
      return;
    }

    if (event.type === "feed") {
      set({
        feed: [
          ...state.feed,
          {
            id: nid("feed"),
            at,
            actorId: event.actorId,
            kind: event.kind,
            text: event.text,
          },
        ],
      });
      return;
    }

    if (event.type === "patch") {
      const label =
        state.terms.find((t) => t.id === event.termId)?.label ?? event.termId;
      set({
        terms: state.terms.map((term) =>
          term.id === event.termId
            ? {
                ...term,
                value: event.value,
                status: "proposed",
                proposedBy: event.actorId,
              }
            : term,
        ),
        feed: [
          ...state.feed,
          {
            id: nid("feed"),
            at,
            actorId: event.actorId,
            kind: "patch",
            path: event.path,
            text: `patch_storage_document  ${event.path}`,
          },
        ],
        notices: [
          {
            id: nid("n"),
            at,
            actorId: event.actorId,
            title: `${label} patched`,
            body: `Proposed ${event.value} on the shared terms.`,
            termId: event.termId,
            read: false,
          },
          ...state.notices,
        ].slice(0, 8),
        selectedTermId: event.termId,
        signed: { you: false, chair: false },
      });
      return;
    }

    if (event.type === "flag") {
      const label =
        state.terms.find((t) => t.id === event.termId)?.label ?? event.termId;
      set({
        terms: state.terms.map((term) =>
          term.id === event.termId
            ? { ...term, status: "flagged", flaggedBy: event.actorId }
            : term,
        ),
        feed: [
          ...state.feed,
          {
            id: nid("feed"),
            at,
            actorId: event.actorId,
            kind: "status",
            text: `Flagged ${label}.`,
          },
        ],
        notices: [
          {
            id: nid("n"),
            at,
            actorId: event.actorId,
            title: `${label} flagged`,
            body: "Needs a board decision before the packet can move.",
            termId: event.termId,
            read: false,
          },
          ...state.notices,
        ].slice(0, 8),
      });
      return;
    }

    if (event.type === "comment") {
      set({
        comments: [
          ...state.comments,
          {
            id: nid("c"),
            termId: event.termId,
            actorId: event.actorId,
            body: event.body,
            at,
          },
        ],
        selectedTermId: event.termId,
        notices: [
          {
            id: nid("n"),
            at,
            actorId: event.actorId,
            title: `${ACTORS[event.actorId]?.name ?? "Someone"} commented`,
            body: event.body,
            termId: event.termId,
            read: false,
          },
          ...state.notices,
        ].slice(0, 8),
      });
    }
  },

  acceptProposal: (termId) => {
    const { terms, phase, clock, feed, presence, signed } = get();
    if (phase === "quorum") return;
    const term = terms.find((t) => t.id === termId);
    if (!term || (term.status !== "proposed" && term.status !== "flagged")) {
      return;
    }
    const nextTerms = terms.map((t) =>
      t.id === termId ? { ...t, status: "approved" as const, flaggedBy: null } : t,
    );
    const nextSigned = signaturesFor(nextTerms, presence, signed.you);
    const chairJustSigned = nextSigned.chair && !signed.chair;
    set({
      terms: nextTerms,
      signed: nextSigned,
      feed: [
        ...feed,
        {
          id: nid("feed"),
          at: clock,
          actorId: YOU_ID,
          kind: "decision",
          text: `Accepted ${term.label} → ${term.value}.`,
        },
        ...(chairJustSigned
          ? [
              {
                id: nid("feed"),
                at: clock,
                actorId: "chair",
                kind: "decision" as const,
                text: "Elena Voss countersigned for the board.",
              },
            ]
          : []),
      ],
    });
  },

  rejectProposal: (termId) => {
    const { terms, phase, clock, feed } = get();
    if (phase === "quorum") return;
    const term = terms.find((t) => t.id === termId);
    if (!term || (term.status !== "proposed" && term.status !== "flagged")) {
      return;
    }
    set({
      terms: terms.map((t) =>
        t.id === termId
          ? {
              ...t,
              value: t.original,
              status: "stable" as const,
              proposedBy: null,
              flaggedBy: null,
            }
          : t,
      ),
      signed: { you: false, chair: false },
      feed: [
        ...feed,
        {
          id: nid("feed"),
          at: clock,
          actorId: YOU_ID,
          kind: "decision",
          text: `Reverted ${term.label} to ${term.original}.`,
        },
      ],
    });
  },

  addComment: (termId, body) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    const { clock, phase, comments } = get();
    if (phase === "quorum") return;
    set({
      comments: [
        ...comments,
        {
          id: nid("c"),
          termId,
          actorId: YOU_ID,
          body: trimmed,
          at: clock,
        },
      ],
    });
  },

  sendToLegal: () => {
    const { terms, phase, clock, feed, presence, signed } = get();
    if (phase === "quorum") return true;
    if (blockersOf(terms).length > 0) return false;
    if (!signed.chair) return false;
    set({
      phase: "quorum",
      signed: { chair: true, you: true },
      feed: [
        ...feed,
        {
          id: nid("feed"),
          at: clock,
          actorId: YOU_ID,
          kind: "decision",
          text: "Quorum reached. 2027 packet queued for AmerisourceBergen and board counsel.",
        },
      ],
      presence: Object.fromEntries(
        Object.entries(presence).map(([id, p]) => [
          id,
          {
            ...p,
            status:
              id === YOU_ID
                ? "Packet queued"
                : id === "chair"
                  ? "Countersigned"
                  : p.status,
          },
        ]),
      ),
    });
    return true;
  },

  replay: () =>
    set({
      ...idleState,
      terms: INITIAL_TERMS.map((t) => ({ ...t })),
      presence: seedPresence(),
      runId: get().runId + 1,
    }),
}));

export function quorumBlockers(terms: Term[]) {
  return blockersOf(terms);
}
