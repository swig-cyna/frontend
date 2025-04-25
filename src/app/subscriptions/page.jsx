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
import { AlertCircle, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const SubscriptionsPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { data: subscriptionData } = useSubscription(session?.user.id)
  const { data: plants } = usePlants()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleChoosePlan = (plan) => {
    if (subscriptionData.length > 0) {
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

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_550px]">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:flex-row">
      <Card className="flex flex-1 flex-col border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 pb-8 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Mensuel
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                Flexibilité maximale
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-gray-800">49,99€</span>
              <p className="text-sm text-gray-600">/mois</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-6">
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Sans engagement</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Reconduit automatiquement</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Facturation mensuelle</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>5% de remise le panier</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="pb-6 pt-4">
          <Button
            className="w-full"
            onClick={() =>
              handleChoosePlan(plants.find((plan) => plan.id === 1))
            }
          >
            Choisir ce plan
          </Button>
        </CardFooter>
      </Card>

      <Card className="relative flex flex-1 flex-col border-2 border-blue-500 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
          Meilleure offre
        </div>
        <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 px-6 pb-8 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Annuel
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                Économisez avec l'engagement
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-gray-800">499,90€</span>
              <p className="text-sm text-gray-600">/an</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-6">
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>2 mois offerts</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Paiement en 1 seule fois</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Économisez 99,98€ par an</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>5% de remise le panier</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="pb-6 pt-4">
          <Button
            className="w-full"
            onClick={() =>
              handleChoosePlan(plants.find((plan) => plan.id === 2))
            }
          >
            Choisir ce plan
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Abonnement déjà actif
            </DialogTitle>
            <DialogDescription className="pt-2">
              Un abonnement est déjà actif. Si vous voulez choisir un autre
              abonnement, vous devez d'abord annuler l'abonnement actuel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SubscriptionsPage
