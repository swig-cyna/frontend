"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useSession } from "@/features/auth/utils/authClient"
import AddPaymentMethodForm from "@/features/stripe/components/PaymentMethod/AddPaymentMethodForm"
import {
  useDeletePaymentMethod,
  usePaymentMethod,
} from "@/features/stripe/hooks/usePaymentMethode"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useQueryClient } from "@tanstack/react-query"
import {
  AlertCircle,
  CreditCard,
  LucideLoader2,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import PaymentMethodUpdate from "./PaymentMethodUpdate"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE)

const PaymentManagement = () => {
  const { data: session } = useSession()
  const { mutateAsync: deletePaymentMethod } = useDeletePaymentMethod()
  const { data: paymentMethodsData, loading } = usePaymentMethod(
    session?.user.id,
  )
  const paymentMethods = paymentMethodsData?.data || []
  const [isDialogOpenAddCard, setIsDialogOpenAddCard] = useState(false)
  const [isDialogOpenUpdate, setIsDialogOpenUpdate] = useState(false)
  const [cardToUpdate, setCardToUpdate] = useState(null)
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)
  const queryClient = useQueryClient()
  const t = useTranslations("PaymentManagement")

  const handleAddCardSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["paymentMethode"] })
    setIsDialogOpenAddCard(false)
  }

  const handleUpdateCard = (method) => {
    setCardToUpdate(method)
    setIsDialogOpenUpdate(true)
  }

  const handleDeleteCard = (methodId) => {
    setCardToDelete(methodId)
    setIsDialogOpenDelete(true)
  }

  const handleUpdateCardSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["paymentMethode"] })
    setIsDialogOpenUpdate(false)
    setCardToUpdate(null)
  }

  const confirmDeleteCard = async () => {
    await deletePaymentMethod(cardToDelete)

    setIsDialogOpenDelete(false)
    setCardToDelete(null)
  }

  const formatCardBrand = (brand) => {
    const brands = {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
      discover: "Discover",
      jcb: "JCB",
      diners: "Diners Club",
      unionpay: "UnionPay",
    }

    return brands[brand] || brand
  }

  if (!session || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LucideLoader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Card className="h-full min-h-[500px] w-full shadow-lg">
        <CardHeader className="border-b pb-6">
          <CardTitle className="flex items-center text-3xl">
            <CreditCard className="mr-3 h-6 w-6 text-primary" />
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <div className="space-y-4">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center space-x-2 rounded-lg border p-6 transition-colors hover:bg-muted/50"
                >
                  <Label
                    htmlFor={method.id}
                    className="flex flex-1 cursor-pointer items-center"
                  >
                    <div className="flex items-center">
                      <CreditCard className="mr-4 h-6 w-6 text-primary" />
                      <div>
                        <div className="font-medium">
                          {formatCardBrand(method.card.brand)} ••••{" "}
                          {method.card.last4}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {t("expiresOn")} {method.card.exp_month}/
                          {method.card.exp_year}
                        </div>
                      </div>
                    </div>
                  </Label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateCard(method)}
                      className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="ml-1">{t("editButton")}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCard(method.id)}
                      className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-1">{t("deleteButton")}</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                {t("noPaymentMethods")}
              </div>
            )}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6"
              onClick={() => setIsDialogOpenAddCard(true)}
            >
              <PlusCircle className="mr-3 h-5 w-5" />
              {t("addNewCard")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpenAddCard} onOpenChange={setIsDialogOpenAddCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addNewCard")}</DialogTitle>
          </DialogHeader>
          <Elements stripe={stripePromise}>
            <AddPaymentMethodForm
              userId={session?.user.id}
              onSuccess={handleAddCardSuccess}
            />
          </Elements>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpenUpdate} onOpenChange={setIsDialogOpenUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("updateCardTitle")}</DialogTitle>
          </DialogHeader>
          <PaymentMethodUpdate
            userId={session?.user.id}
            paymentMethod={cardToUpdate}
            onSuccess={handleUpdateCardSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              {t("deleteTitle")}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t("deleteDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpenDelete(false)}
            >
              {t("cancelButton")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              {t("confirmButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PaymentManagement
