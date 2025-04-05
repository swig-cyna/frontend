"use client"

import { useTranslations } from "next-intl"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

import ProfileInfoUpdate from "./ProfileInfoUpdate"
import TwoFactorAuthToggle from "./TwoFactorAuthToggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

const AccountManagement = () => {
  const t = useTranslations("AccountManagement")
  const reason = new URLSearchParams(window.location.search).get("reason")

  return (
    <div>
      {reason === "2FArequired" && (
        <Alert variant="destructive" className="mb-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>{t("alertTitle")}</AlertTitle>
          <AlertDescription>{t("alertDescription")}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileInfoUpdate />
          <TwoFactorAuthToggle />
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountManagement
