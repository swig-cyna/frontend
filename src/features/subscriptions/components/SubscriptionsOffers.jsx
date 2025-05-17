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
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/features/auth/utils/authClient"
import { usePlants } from "@/features/subscriptions/hooks/usePlants"
import { useSubscription } from "@/features/subscriptions/hooks/useSubscription"
import clsx from "clsx"
import { AlertCircle, Check, LogIn } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"

const SubscriptionsOffers = () => {
  const t = useTranslations()
  const router = useRouter()
  const { data: session } = useSession()
  const { data: subscriptionData } = useSubscription(session?.user?.id)
  const { data: plants, isLoading: plantsLoading } = usePlants()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleChoosePlan = (plan) => {
    if (!session) {
      setShowLoginDialog(true)

      return
    }

    if (subscriptionData?.length > 0) {
      setIsDialogOpen(true)

      return
    }

    localStorage.setItem(
      "selectedPlan",
      JSON.stringify({
        cartItems: [
          {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            interval: plan.interval,
          },
        ],
        total: plan.price,
      }),
    )

    router.push("/subscriptions/payment")
  }

  const handleLogin = () => {
    router.push("/signin")
  }

  if (plantsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (!plants || plants.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold">
          {t("Subscriptions.Plans.noPlansAvailable")}
        </h2>
        <p className="mt-2 text-gray-600">
          {t("Subscriptions.Plans.tryAgainLater")}
        </p>
      </div>
    )
  }

  const sortedPlans = [...plants].sort((a, b) => a.price - b.price)

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:flex-row">
      {sortedPlans.map((plan) => {
        const isYearlyPlan = plan.interval === "year"
        const priceDisplay = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }).format(plan.price)

        const descriptionItems = plan.description
          .split("\n")
          .filter((item) => item.trim() !== "")

        return (
          <div className="relative flex-1" key={plan.id}>
            {isYearlyPlan && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                {t("Subscriptions.Plans.bestOffer")}
              </div>
            )}
            <Card
              className={`flex flex-1 flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                isYearlyPlan && "border-2 border-primary"
              }`}
            >
              <CardHeader
                className={clsx(
                  "bg-gradient-to-r px-6 pb-8 pt-6",
                  isYearlyPlan
                    ? "from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900"
                    : "from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900",
                )}
              >
                <div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-foreground">
                      {isYearlyPlan
                        ? t("Subscriptions.Plans.yearlyCommitment")
                        : t("Subscriptions.Plans.maxFlexibility")}
                    </CardDescription>
                  </div>
                  <div className="mt-1 flex items-end gap-3">
                    <p className="text-3xl font-bold">{priceDisplay}</p>
                    <p className="text-md mb-1 text-foreground">
                      {plan.interval === "month"
                        ? t("Subscriptions.Plans.perMonth")
                        : t("Subscriptions.Plans.perYear")}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-3">
                  {descriptionItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>
                      {plan.discount}
                      {t("Subscriptions.Plans.discountLabel")}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pb-6 pt-4">
                <Button
                  className="w-full"
                  onClick={() => handleChoosePlan(plan)}
                >
                  {t("Subscriptions.Plans.choosePlan")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )
      })}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              {t("Subscriptions.Plans.dialogTitle")}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t("Subscriptions.Plans.dialogDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("Subscriptions.Plans.cancelButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <LogIn className="mr-2 h-5 w-5" />
              {t("Subscriptions.Plans.loginRequired")}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t("Subscriptions.Plans.loginToSubscribe")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              {t("Subscriptions.Plans.cancelButton")}
            </Button>
            <Button onClick={handleLogin}>
              {t("Subscriptions.Plans.login")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SubscriptionsOffers
