import type { Actor, Term } from "./types";

export const YOU_ID = "you";

export const ACTORS: Record<string, Actor> = {
  you: {
    id: "you",
    name: "You",
    role: "President & CEO",
    kind: "human",
    initials: "YO",
    tone: "steel",
  },
  chair: {
    id: "chair",
    name: "Elena Voss",
    role: "Chairman",
    kind: "human",
    initials: "EV",
    tone: "sage",
  },
  rebate: {
    id: "rebate",
    name: "Rebate",
    role: "Agent",
    kind: "agent",
    initials: "RB",
    tone: "paper",
  },
  risk: {
    id: "risk",
    name: "Reimburse",
    role: "Agent",
    kind: "agent",
    initials: "RM",
    tone: "clay",
  },
  intel: {
    id: "intel",
    name: "Intel",
    role: "Agent",
    kind: "agent",
    initials: "IN",
    tone: "mist",
  },
};

export const ROOM = {
  id: "wapc-wholesaler-2027",
  account: "WAPC",
  motion: "2027 wholesaler + rebate lock",
  stage: "Board commercial session",
  close: "3 Oct 2026",
  dues: "$0",
  owner: "President & CEO",
  daysOut: 22,
};

export const MEMBER = {
  name: "Harbor Family Pharmacy",
  market: "Independent · 1,140 Rx / week",
  brandBook: 1_800_000,
  dirOpen: 42_000,
  dirFloor: 8_000,
};

export const INITIAL_TERMS: Term[] = [
  {
    id: "wholesaler",
    label: "Primary wholesaler",
    value: "AmerisourceBergen",
    original: "AmerisourceBergen",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
  {
    id: "cogs",
    label: "Brand cost of goods",
    value: "WAC −18.4%",
    original: "WAC −18.4%",
    unit: "Hold the line versus last cycle",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
  {
    id: "rebate",
    label: "Sliding rebate",
    value: "1.8%",
    original: "1.8%",
    unit: "Paid back to member pharmacies",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
  {
    id: "dir",
    label: "DIR / reimbursement floor",
    value: "None",
    original: "None",
    unit: "PBM clawback exposure on independent volume",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
  {
    id: "generic",
    label: "Generic source",
    value: "WAPC + ABC",
    original: "WAPC + ABC",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
  {
    id: "term",
    label: "Contract length",
    value: "24 months",
    original: "24 months",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
  {
    id: "secondary",
    label: "Secondary vendors",
    value: "Open",
    original: "Open",
    unit: "Supplier relations keep dual source",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
  {
    id: "dues",
    label: "Member dues",
    value: "$0",
    original: "$0",
    unit: "No membership fees — non-negotiable",
    status: "stable",
    proposedBy: null,
    flaggedBy: null,
  },
];

export const QUORUM_TERMS = ["rebate", "dir"] as const;
