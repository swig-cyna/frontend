"use client"

import { useEffect, useState } from "react"
import { authClient, useSession } from "@/features/auth/utils/authClient"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import QRCode from "react-qr-code"
import { useTranslations } from "next-intl"

const TwoFactorAuthToggle = () => {
  const t = useTranslations("TwoFactorAuthToggle")
  const { data: session } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [password, setPassword] = useState("")
  const [qrCodeURI, setQrCodeURI] = useState(null)
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [message, setMessage] = useState({ content: "", type: "" })

  useEffect(() => {
    setIs2FAEnabled(session?.user?.twoFactorEnabled || false)
  }, [session])

  const handleError = (error, defaultMessage) => {
    console.error("Erreur, error")
    setMessage({
      content: error.message || defaultMessage,
      type: error,
    })
  }

  const validateInput = (input, errorMessage) => {
    if (!input) {
      setMessage({ content: errorMessage, type: "error" })

      return false
    }

    return true
  }

  const toggleTwoFactorAuth = async (action, successMessage, errorMessage) => {
    if (!validateInput(password, t("passwordNeed"))) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await authClient.twoFactor[action]({ password })

      if (action === "enable") {
        const urlParams = new URLSearchParams(result.data.totpURI.split("?")[1])
        setQrCodeURI(result.data.totpURI)
        setSecret(urlParams.get("secret"))
      } else {
        setQrCodeURI(null)
        setSecret("")
        window.location.reload()
      }

      if (result.error) {
        throw new Error(result.error.message)
      }

      setIs2FAEnabled(action === "enable")
      setMessage({ content: successMessage, type: "success" })
    } catch (error) {
      handleError(error, errorMessage)
    } finally {
      setIsLoading(false)
      setPassword("")
    }
  }

  const handleToggle = async () => {
    if (is2FAEnabled) {
      await toggleTwoFactorAuth(
        "disable",
        t("desactivatedSucces"),
        t("desactivationError"),
      )
    } else {
      await toggleTwoFactorAuth(
        "enable",
        t("enableSuccess"),
        t("activationError"),
      )
    }
  }

  const verifyTotpCode = async () => {
    if (!validateInput(verificationCode, t("verificationError"))) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: verificationCode,
      })

      if (error) {
        throw new Error(error.message)
      }

      await authClient.reloadSession()
      window.location.reload()
      setIs2FAEnabled(true)
      setMessage({ content: t("activationSuccessful"), type: "success" })
    } catch (error) {
      handleError(error, t("verificationError"))
    } finally {
      setIsLoading(false)
      setVerificationCode("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <p>
            {t("status")}
            {is2FAEnabled ? t("statusActivated") : t("statusDesactivated")}
          </p>
          <Switch
            checked={is2FAEnabled}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <Input
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {message?.content && (
          <p
            className={`text-${message.type === "success" ? "green" : "red"}-500`}
          >
            {message?.content}
          </p>
        )}

        {qrCodeURI && !is2FAEnabled && (
          <div className="mb-6">
            <p className="mb-4">{t("stepOne")}</p>
            <div className="mb-4 flex justify-center p-4">
              <QRCode
                value={qrCodeURI}
                size={200}
                className="rounded bg-white p-2"
              />
            </div>

            <div className="mb-4">
              <p className="mb-2 text-sm font-medium">{t("secret")}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("codeInstruction")}
              </p>
              <div className="break-all rounded-md p-3">{secret}</div>
            </div>

            <p className="mb-4">{t("stepTwo")}</p>
            <div className="mb-4 flex gap-2">
              <Input
                type="text"
                placeholder={t("codePlaceholder")}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength="6"
              />
              <Button onClick={verifyTotpCode} disabled={!verificationCode}>
                {t("verifyButton")}
              </Button>
            </div>
          </div>
        )}

        {isLoading && <p className="mt-2 text-gray-500">{t("loading")}</p>}
      </CardContent>
    </Card>
  )
}

export default TwoFactorAuthToggle
