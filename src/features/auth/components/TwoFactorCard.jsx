"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/features/auth/utils/authClient"
import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"

const CALLBACK_URL = process.env.NEXT_PUBLIC_FRONTEND

const TwoFactorCard = () => {
  const t = useTranslations("SigninCard")
  const [totpCode, setTotpCode] = useState("")
  const [isSigninComplete, setIsSigninComplete] = useState(false)
  const [error, setError] = useState(null)

  async function handleTotpVerification() {
    if (totpCode.length !== 6) {
      setError(t("invalidOtp"))

      return
    }

    try {
      const response = await authClient.twoFactor.verifyTotp({ code: totpCode })

      if (response.error) {
        throw new Error(response.error.message)
      }

      setIsSigninComplete(true)
      window.location.href = CALLBACK_URL
    } catch (err) {
      console.error(`TOTP verification failed: ${err}`)
      setError(err.message || t("otpVerificationFailed"))
    }
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
        <CardTitle>{t("twoFactorTitle")}</CardTitle>
        <CardDescription>{t("twoFactorDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-center">
          <InputOTP
            maxLength={6}
            value={totpCode}
            onChange={(value) => setTotpCode(value)}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="m-1 h-12 w-9 rounded-md border text-center text-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        <Button
          onClick={handleTotpVerification}
          className="mt-4 w-full"
          disabled={totpCode.length !== 6}
        >
          {t("verifyOtpButton")}
        </Button>
      </CardContent>
    </Card>
  )
}

export default TwoFactorCard
