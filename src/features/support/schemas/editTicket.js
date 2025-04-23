import { z } from "zod"

export const editTicketSchema = z.object({
  status: z.enum(["open", "in_progress", "closed"]),
  assigned_to: z.string().nullable().optional(),
})
