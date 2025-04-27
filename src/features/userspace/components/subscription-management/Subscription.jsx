"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "@/features/auth/utils/authClient"
import {
  useDeleteSubscription,
  useSubscription,
} from "@/features/subscriptions/hooks/useSubscription"
import { formatDistance } from "date-fns"
import { enUS, fr, he } from "date-fns/locale"
import { AlertCircle } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

const Subscription = () => {
  const t = useTranslations()
  const locale = useLocale()
  const { data: session } = useSession()
  const { data: subscriptionData, isLoading } = useSubscription(
    session?.user.id,
  )
  const { mutateAsync: deleteSubscription } = useDeleteSubscription()
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false)
  const [plantToDelete, setPlantToDelete] = useState(null)

  const dateLocaleMap = {
    en: enUS,
    fr,
    he,
  }

  const dateLocale = dateLocaleMap[locale] || enUS

  const handleDeletePlant = (methodId) => {
    setPlantToDelete(methodId)
    setIsDialogOpenDelete(true)
  }

  const confirmDeleteCard = async () => {
    await deleteSubscription(plantToDelete)

    setIsDialogOpenDelete(false)
    setPlantToDelete(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    return {
      formatted: new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date),
      relative: formatDistance(date, new Date(), {
        addSuffix: true,
        locale: dateLocale,
      }),
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="py-12 text-center">
          <CardHeader>
            <CardTitle>{t("Subscriptions.Management.loading")}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto h-full min-h-[500px] w-full px-4">
      {subscriptionData.length === 0 ? (
        <Card className="py-12 text-center">
          <CardHeader>
            <CardTitle>
              {t("Subscriptions.Management.noActiveSubscription")}
            </CardTitle>
            <CardDescription>
              {t("Subscriptions.Management.noActiveSubscriptionDesc")}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button>
              <a href="/subscriptions">
                {t("Subscriptions.Management.discoverPlans")}
              </a>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="py-8">
          <CardHeader>
            <CardTitle className="text-center">
              {t("Subscriptions.Management.activeSubscriptionTitle")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("Subscriptions.Management.activeSubscriptionDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">
                  {t("Subscriptions.Management.subscriptionLabel")}
                </p>
                <p className="text-lg font-semibold">
                  {subscriptionData[0].plant_name}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">
                  {t("Subscriptions.Management.statusLabel")}
                </p>
                <p className="text-lg font-semibold">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {t("Subscriptions.Management.statusActive")}
                  </span>
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">
                  {t("Subscriptions.Management.startDateLabel")}
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(subscriptionData[0].createdAt).formatted}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">
                  {t("Subscriptions.Management.nextRenewalLabel")}
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(subscriptionData[0].currentPeriodEnd).formatted}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button variant="outline" className="mr-4">
              <a href="/subscriptions">
                {t("Subscriptions.Management.changeSubscription")}
              </a>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeletePlant(subscriptionData[0].id)}
            >
              {t("Subscriptions.Management.cancelSubscription")}
            </Button>
          </CardFooter>
        </Card>
      )}
      <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              {t("Subscriptions.Management.confirmCancelTitle")}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t("Subscriptions.Management.confirmCancelDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpenDelete(false)}
            >
              {t("Subscriptions.Management.cancelAction")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              {t("Subscriptions.Management.confirmAction")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Subscription
