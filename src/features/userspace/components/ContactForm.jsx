"use client"

import { useSession } from "@/features/auth/utils/authClient"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { contactFormSchema } from "../schemas/contactFormSchema"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TicketService } from "@/features/support/utils/apiTicketService"
import { useTranslations } from "next-intl"

const ContactForm = ({ onSend }) => {
  const t = useTranslations("ContactForm")
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
      await TicketService.createTicket({
        user_name: data.name,
        user_email: data.email,
        title: data.subject,
        theme: data.theme,
        description: data.message,
        status: "open",
      })
      setMessage({
        content: t("successMessage"),
        type: "success",
      })

      if (onSend) {
        onSend()
      }

      form.reset()
    } catch (error) {
      console.error("Erreur lors de la création du ticket :", error)
      setMessage({
        content: t("errorMessage"),
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fullNamePlaceholder")} {...field} />
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
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("emailPlaceholder")} {...field} />
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
                  <FormLabel>{t("theme")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("themePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bug">{t("themeBug")}</SelectItem>
                      <SelectItem value="question">
                        {t("themeQuestion")}
                      </SelectItem>
                      <SelectItem value="payment">
                        {t("themePayment")}
                      </SelectItem>
                      <SelectItem value="delivery">
                        {t("themeDelivery")}
                      </SelectItem>
                      <SelectItem value="other">{t("themeOther")}</SelectItem>
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
                  <FormLabel>{t("subject")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("subjectPlaceholder")} {...field} />
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
                  <FormLabel>{t("detailedDescription")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("detailedDescriptionPlaceholder")}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("sending") : t("send")}
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
