// src/utils/ticketStatusLabel.ts

export const ticketStatusToLabel = {
  OPEN: "Ouvert",
  IN_PROGRESS: "En cours",
  CLOSED: "Résolu",
} as const;

export const labelToTicketStatus = {
  Ouvert: "OPEN",
  "En cours": "IN_PROGRESS",
  Résolu: "CLOSED",
} as const;

export const ticketPriorityToLabel = {
  HIGH: "Haute",
  MEDIUM: "Moyenne",
  LOW: "Basse",
} as const;