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
import { signupSchema } from "../schemas/signup"
import { signUp } from "@/features/auth/utils/authClient"
import { useState } from "react"
import EmailVerification from "./EmailVerification"
import { useTranslations } from "next-intl"

const CALLBACK_URL = process.env.NEXT_PUBLIC_FRONTEND

const SignupCard = () => {
  const t = useTranslations("SignupCard")

  const [error, setError] = useState(null)
  const [isSignupComplete, setIsSignupComplete] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const fields = [
    generateFormFieldInput({
      name: "firstname",
      placeholder: t("firstnamePlaceholder"),
      label: t("firstnameLabel"),
    }),
    generateFormFieldInput({
      name: "lastname",
      placeholder: t("lastnamePlaceholder"),
      label: t("lastnameLabel"),
    }),
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
    generateFormFieldInput({
      name: "confirmPassword",
      placeholder: t("confirmPasswordPlaceholder"),
      label: t("confirmPasswordLabel"),
      type: "password",
    }),
  ]

  async function onSubmit(values) {
    try {
      const { error: signUpError } = await signUp.email({
        email: values.email,
        password: values.password,
        name: `${values.firstname} ${values.lastname}`,
        callbackURL: CALLBACK_URL,
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setIsSignupComplete(true)
        setUserEmail(values.email)
      }
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError(t("signupError"))
    }
  }

  if (isSignupComplete) {
    return <EmailVerification userEmail={userEmail} />
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">{t("signupTitle")}</CardTitle>
        <CardDescription>{t("signupDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <Button type="submit" className="mt-4 w-full">
              {t("signupButton")}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/signin" className="text-primary underline">
            {t("signin")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignupCard
