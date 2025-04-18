"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField } from "@/components/ui/form"
import {
  changeEmail,
  sendVerificationEmail,
  updateUser,
  useSession,
} from "@/features/auth/utils/authClient"
import Link from "next/link"
import ResendEmailButton from "@/features/auth/components/ResendEmailButton"
import { accountSchema } from "../schemas/changeEmail"

const ProfileInfoUpdate = () => {
  const { data: session } = useSession()
  const t = useTranslations("ProfileInfoUpdate")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ content: "", type: "" })
  const [isEmailChangeInitiated, setIsEmailChangeInitiated] = useState(false)

  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  })

  const onSubmit = async (values) => {
    setIsLoading(true)
    setMessage({ content: "", type: "" })

    try {
      if (session.user.name !== values.name) {
        await updateUser({ name: values.name })
        setMessage({ content: t("nameUpdateSuccess"), type: "success" })
      }

      if (session.user.email !== values.email) {
        await changeEmail({
          newEmail: values.email,
          callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND}/user/account-management`,
        })
        setMessage({ content: t("emailUpdateInitiated"), type: "success" })
        setIsEmailChangeInitiated(true)
      }
    } catch (error) {
      console.error(`Une erreur s'est produite : ${error}`)
      setMessage({ content: t("updateError"), type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail({
        email: session.user.email,
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND}/user/account-management`,
      })
    } catch (err) {
      console.error(`An error has occurred:" ${err}`)
    }
  }

  if (isEmailChangeInitiated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("emailChangeTitle")}</CardTitle>
          <CardDescription>{t("emailChangeDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t("emailChangeSent")}</p>
          <p>{session.user.email}</p>
          <p>{t("emailChangeClickLink")}</p>
        </CardContent>
      </Card>
    )
  }

  if (!session.user.emailVerified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("emailVerificationTitle")}
          </CardTitle>
          <CardDescription>{t("emailVerificationDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t("emailVerificationSent")}</p>
          <p>{session.user.email}</p>
          <p>{t("emailVerificationClickLink")}</p>
          <ResendEmailButton
            onResend={handleResendEmail}
            buttonText={t("resendButton")}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div>
                  <label htmlFor="name">{t("nameLabel")}</label>
                  <Input {...field} id="name" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div>
                  <label htmlFor="email">{t("emailLabel")}</label>
                  <Input {...field} id="email" type="email" />
                </div>
              )}
            />
            {message.content && (
              <p
                className={
                  message.type === "success" ? "text-green-500" : "text-red-500"
                }
              >
                {message.content}
              </p>
            )}
            <Button type="submit" disabled={isLoading} className="mt-4 w-full">
              {isLoading ? t("updating") : t("updateButton")}
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <Link
            href="/forget-password"
            className="text-blue-500 hover:underline"
          >
            {t("resetPasswordLink")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileInfoUpdate
