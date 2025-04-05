"use client"

import { useTranslations } from "next-intl"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

import ProfileInfoUpdate from "./ProfileInfoUpdate"
import TwoFactorAuthToggle from "./TwoFactorAuthToggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useSession } from "@/features/auth/utils/authClient"

const AccountManagement = () => {
  const t = useTranslations("AccountManagement")
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")
  const { data: session } = useSession()

  return (
    <div>
      {reason === "2FArequired" && !session.user.twoFactorEnabled && (
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
