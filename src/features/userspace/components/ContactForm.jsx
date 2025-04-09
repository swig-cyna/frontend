"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactFormSchema } from "../schemas/contactFormSchema"
import { sendSupportEmail } from "../utils/emailUtils"
import { useSession } from "@/features/auth/utils/authClient"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ content: "", type: "" })
  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      subject: "",
      theme: "",
      message: "",
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setMessage({ content: "", type: "" })

    try {
      await sendSupportEmail(data)
      setMessage({
        content: "Votre ticket a été créé avec succès.",
        type: "success",
      })
      form.reset()
    } catch (error) {
      console.error("Erreur lors de la création du ticket :", error)
      setMessage({
        content: "Une erreur est survenue. Veuillez réessayer plus tard.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contactez le support</CardTitle>
        <CardDescription>
          Nous vous répondrons dans les plus brefs délais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de demande</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un thème" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bug">Bug technique</SelectItem>
                      <SelectItem value="question">
                        Question générale
                      </SelectItem>
                      <SelectItem value="payment">
                        Problème de paiement
                      </SelectItem>
                      <SelectItem value="delivery">
                        Problème de livraison
                      </SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objet</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de votre demande" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre problème en détail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>

            {message.content && (
              <p
                className={`mt-2 text-sm ${
                  message.type === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {message.content}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ContactForm
