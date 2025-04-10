import { z } from "zod"

export const addUserSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string({
      required_error: "Please select a role.",
    })
    .min(8),
  role: z.enum(["superadmin", "admin", "support", "user"]),
})
