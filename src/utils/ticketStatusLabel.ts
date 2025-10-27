// src/utils/ticketStatusLabel.ts

// Traduction des statuts techniques vers le français
export const ticketStatusToLabel = {
  OPEN: "Ouvert",
  IN_PROGRESS: "En cours",
  CLOSED: "Résolu",
} as const;

// Traduction inverse (si tu veux filtrer côté API plus tard)
export const labelToTicketStatus = {
  Ouvert: "OPEN",
  "En cours": "IN_PROGRESS",
  Résolu: "CLOSED",
} as const;

// Traduction des priorités
export const ticketPriorityToLabel = {
  HIGH: "Haute",
  MEDIUM: "Moyenne",
  LOW: "Basse",
} as const;
