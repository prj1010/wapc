export type ActorKind = "human" | "agent";

export type Actor = {
  id: string;
  name: string;
  role: string;
  kind: ActorKind;
  initials: string;
  tone: "steel" | "sage" | "paper" | "clay" | "mist";
};

export type Presence = {
  actorId: string;
  online: boolean;
  status: string | null;
  joinedAt: number | null;
};

export type TermStatus = "stable" | "proposed" | "flagged" | "approved";

export type Term = {
  id: string;
  label: string;
  value: string;
  original: string;
  unit?: string;
  status: TermStatus;
  proposedBy: string | null;
  flaggedBy: string | null;
};

export type FeedKind = "system" | "status" | "patch" | "note" | "decision";

export type FeedItem = {
  id: string;
  at: number;
  actorId: string | null;
  kind: FeedKind;
  text: string;
  path?: string;
};

export type Comment = {
  id: string;
  termId: string;
  actorId: string;
  body: string;
  at: number;
};

export type Notice = {
  id: string;
  at: number;
  actorId: string;
  title: string;
  body: string;
  termId: string | null;
  read: boolean;
};

export type Signatures = {
  you: boolean;
  chair: boolean;
};

export type RoomPhase = "opening" | "live" | "quorum";
