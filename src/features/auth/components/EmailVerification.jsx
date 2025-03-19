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

const CALLBACK_URL = "http://localhost:3000/"

const EmailVerification = ({ userEmail }) => {
  const [error, setError] = useState(null)

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail({
        email: userEmail,
        callbackURL: CALLBACK_URL,
      })
    } catch (err) {
      console.error(`An error has occurred:" ${err}`)
      setError("Failed to resend verification email. Please try again later.")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">
          Account created successfully !
        </CardTitle>
        <CardDescription>
          Check your email to activate your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>A verification email has been sent to the following address :</p>
        <p>{userEmail}</p>
        <p>Please click on the link in the email to activate your account.</p>
        <ResendEmailButton
          onResend={handleResendEmail}
          buttonText="Resend verification email"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default EmailVerification
