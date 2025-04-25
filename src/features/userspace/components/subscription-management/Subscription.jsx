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
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AlertCircle } from "lucide-react"
import { useState } from "react"

const Subscription = () => {
  const { data: session } = useSession()
  const { data: subscriptionData, isLoading } = useSubscription(
    session?.user.id,
  )
  const { mutateAsync: deleteSubscription } = useDeleteSubscription()
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false)
  const [plantToDelete, setPlantToDelete] = useState(null)

  console.log(subscriptionData)

  const handleDeletePlant = (methodId) => {
    setPlantToDelete(methodId)
    setIsDialogOpenDelete(true)
  }

  const confirmDeleteCard = async () => {
    await deleteSubscription(plantToDelete)

    setIsDialogOpenDelete(false)
    setPlantToDelete(null)
  }

  const formatDate = (dateString) =>
    format(new Date(dateString), "d MMMM yyyy", { locale: fr })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="py-12 text-center">
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
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
            <CardTitle>Aucun abonnement actif</CardTitle>
            <CardDescription>
              Vous n'avez actuellement aucun abonnement actif.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button>
              <a href="/subscriptions">Découvrir nos plans d'abonnement</a>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="py-8">
          <CardHeader>
            <CardTitle className="text-center">
              Votre abonnement actif
            </CardTitle>
            <CardDescription className="text-center">
              Détails de votre abonnement en cours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Abonnement</p>
                <p className="text-lg font-semibold">
                  {subscriptionData[0].plant_name}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p className="text-lg font-semibold">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Actif
                  </span>
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">
                  Date de début
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(subscriptionData[0].createdAt)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">
                  Prochain renouvellement
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(subscriptionData[0].currentPeriodEnd)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button variant="outline" className="mr-4">
              <a href="/subscriptions">Changer d'abonnement</a>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeletePlant(subscriptionData[0].id)}
            >
              Annuler l'abonnement
            </Button>
          </CardFooter>
        </Card>
      )}
      <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Confirmer l'annulation de l'abonnement
            </DialogTitle>
            <DialogDescription className="pt-2">
              Êtes-vous sûr de vouloir annuler cette abonnement ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpenDelete(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Subscription
