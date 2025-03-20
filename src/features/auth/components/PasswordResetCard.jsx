"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/features/auth/utils/authClient"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { generateFormFieldInput } from "@/components/functions"
import { useSearchParams } from "next/navigation"
import { resetPasswordSchema } from "../schemas/passwordReset"
import { useTranslations } from "next-intl"

const PasswordResetCard = () => {
  const t = useTranslations("PasswordResetCard")
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [error, setError] = useState(null)
  const [isResetComplete, setIsResetComplete] = useState(false)

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")

    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const fields = [
    generateFormFieldInput({
      name: "password",
      placeholder: t("passwordPlaceholder"),
      label: t("passwordLabel"),
      type: "password",
    }),
    generateFormFieldInput({
      name: "confirmPassword",
      placeholder: t("confirmPasswordPlaceholder"),
      label: t("confirmPasswordLabel"),
      type: "password",
    }),
  ]

  async function onSubmit(values) {
    try {
      await authClient.resetPassword({
        token,
        newPassword: values.password,
      })
      setIsResetComplete(true)
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError(t("resetError"))
    }
  }

  if (isResetComplete) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">{t("resetCompleteTitle")}</CardTitle>
          <CardDescription>{t("resetCompleteDescription")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">{t("resetPasswordTitle")}</CardTitle>
        <CardDescription>{t("resetPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            <Button type="submit" className="mt-4 w-full">
              {t("resetPasswordButton")}
            </Button>
          </form>
        </Form>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default PasswordResetCard
