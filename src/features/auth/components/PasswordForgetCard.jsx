"use client"
import { generateFormFieldInput } from "@/components/functions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { forgetPassword } from "@/features/auth/utils/authClient"
import { useState } from "react"
import { passwordResetSchema } from "../schemas/passwordForget"
import ResendEmailButton from "./ResendEmailButton"
import { useTranslations } from "next-intl"

const PasswordForgetCard = () => {
  const t = useTranslations("PasswordForgetCard")
  const [error, setError] = useState(null)
  const [isResetEmailSent, setIsResetEmailSent] = useState(false)

  const form = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const fields = [
    generateFormFieldInput({
      name: "email",
      placeholder: t("emailPlaceholder"),
      label: t("emailLabel"),
      type: "email",
    }),
  ]

  async function handleResendPasswordReset(values) {
    try {
      await forgetPassword({
        email: values.email,
        redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND}/reset-password`,
      })
      setIsResetEmailSent(true)
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError(t("resetEmailError"))
    }
  }

  if (isResetEmailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">{t("resetPasswordTitle")}</CardTitle>
          <CardDescription>{t("resetPasswordDescription")} </CardDescription>
        </CardHeader>
        <CardContent>
          <ResendEmailButton
            onResend={handleResendPasswordReset}
            buttonText={t("resendButton")}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">{t("resetPasswordTitle")}</CardTitle>
        <CardDescription>{t("resetPasswordDescription")} </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleResendPasswordReset)}
            className="space-y-4"
          >
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            <Button type="submit" className="mt-4 w-full">
              {t("sendResetLink")}
            </Button>
          </form>
        </Form>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default PasswordForgetCard
