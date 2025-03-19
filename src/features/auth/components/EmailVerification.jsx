"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { sendVerificationEmail } from "@/features/auth/utils/authClient"
import { useState, useEffect } from "react"

const RESEND_DELAY = 60
const CALLBACK_URL = "http://localhost:3000/"

const EmailVerification = ({ userEmail }) => {
  const [error, setError] = useState(null)
  const [canResend, setCanResend] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)

  const startResendTimer = () => {
    setCanResend(false)
    setTimeLeft(RESEND_DELAY)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setCanResend(true)

          return 0
        }

        return prevTime - 1
      })
    }, 1000)
  }

  useEffect(() => {
    startResendTimer()
  }, [])

  const handleResendEmail = async () => {
    if (!canResend) {
      return
    }

    try {
      await sendVerificationEmail({
        email: userEmail,
        callbackURL: CALLBACK_URL,
      })
      startResendTimer()
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
        <Button
          onClick={handleResendEmail}
          disabled={!canResend}
          className="mt-4 w-full"
        >
          {canResend
            ? "Resend verification email"
            : `Resend in ${timeLeft} seconds`}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default EmailVerification
