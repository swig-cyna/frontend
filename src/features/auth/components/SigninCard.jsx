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
import Link from "next/link"
import { useForm } from "react-hook-form"
import { signinSchema } from "../schemas/signin"
import { signIn } from "@/features/auth/utils/authClient"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Checkbox } from "@/components/ui/checkbox"

const CALLBACK_URL = process.env.NEXT_PUBLIC_FRONTEND

const SigninCard = () => {
  const t = useTranslations("SigninCard")
  const [error, setError] = useState(null)
  const [isSigninComplete, setIsSigninComplete] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const fields = [
    generateFormFieldInput({
      name: "email",
      placeholder: t("emailPlaceholder"),
      label: t("emailLabel"),
      type: "email",
    }),
    generateFormFieldInput({
      name: "password",
      placeholder: t("passwordPlaceholder"),
      label: t("passwordLabel"),
      type: "password",
    }),
  ]

  async function onSubmit(values) {
    try {
      const { error: signInError } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: CALLBACK_URL,
        rememberMe,
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        setIsSigninComplete(true)
      }
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError(t("signinError"))
    }
  }

  const handleRememberMe = (checked) => {
    setRememberMe(checked)
  }

  if (isSigninComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("signinCompleteTitle")}</CardTitle>
          <CardDescription>{t("signinCompleteDescription")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">{t("signinTitle")}</CardTitle>
        <CardDescription>{t("signinDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={handleRememberMe}
                    {...field}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm">
                    {t("rememberMeLabel")}
                  </label>
                </div>
              )}
            />

            <Button type="submit" className="mt-4 w-full">
              {t("signinButton")}
            </Button>
          </form>
        </Form>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        <div className="mt-4 text-center">
          {t("dontHaveAccount")}{" "}
          <Link href="/signup" className="text-primary underline">
            {t("signUp")}
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/forget-password" className="text-primary underline">
            {t("forgotPassword")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SigninCard
