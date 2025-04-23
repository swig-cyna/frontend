import * as z from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(1, "Le nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().min(1, "L'objet est requis"),
  theme: z.string().min(1, "Veuillez sélectionner un thème"),
  message: z
    .string()
    .min(10, "Votre message doit contenir au moins 10 caractères"),
})
