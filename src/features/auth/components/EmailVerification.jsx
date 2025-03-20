"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { sendVerificationEmail } from "@/features/auth/utils/authClient"
import { useState } from "react"
import ResendEmailButton from "./ResendEmailButton"
import { useTranslations } from "next-intl"

const CALLBACK_URL = process.env.NEXT_PUBLIC_FRONTEND

const EmailVerification = ({ userEmail }) => {
  const t = useTranslations("EmailVerification")
  const [error, setError] = useState(null)

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail({
        email: userEmail,
        callbackURL: CALLBACK_URL,
      })
    } catch (err) {
      console.error(`An error has occurred:" ${err}`)
      setError(t("resendError"))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{t("emailSent")}</p>
        <p>{userEmail}</p>
        <p>{t("clickLink")}</p>
        <ResendEmailButton
          onResend={handleResendEmail}
          buttonText={t("resendButton")}
        />
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default EmailVerification
