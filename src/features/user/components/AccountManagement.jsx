"use client"

import { useTranslations } from "next-intl"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

import ProfileInfoUpdate from "./ProfileInfoUpdate"
import TwoFactorAuthToggle from "./TwoFactorAuthToggle"

const AccountManagement = () => {
  const t = useTranslations("AccountManagement")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileInfoUpdate />
        <TwoFactorAuthToggle />
      </CardContent>
    </Card>
  )
}

export default AccountManagement
