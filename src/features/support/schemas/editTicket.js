import { z } from "zod"

export const editTicketSchema = z.object({
  status: z.string({
    required_error: "Please select a status.",
  }),
})
