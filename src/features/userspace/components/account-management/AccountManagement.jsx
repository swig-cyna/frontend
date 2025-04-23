"use client"

import { useTranslations } from "next-intl"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "@/features/auth/utils/authClient"
import { ShieldAlert } from "lucide-react"
import { useSearchParams } from "next/navigation"
import ProfileInfoUpdate from "./ProfileInfoUpdate"
import TwoFactorAuthToggle from "./TwoFactorAuthToggle"

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
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <ProfileInfoUpdate />
        <TwoFactorAuthToggle />
      </div>
    </div>
  )
}

export default AccountManagement
