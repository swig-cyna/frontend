"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "@/features/auth/utils/authClient"
import { Label } from "@radix-ui/react-label"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  AlertCircle,
  Home,
  LucideLoader2,
  MapPin,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useState } from "react"
import { useAddresses, useDeleteAddress } from "../../hooks/useAddress"
import {
  stripeOptions,
  stripeOptionsWhite,
} from "../../utils/stripeAddressOptions"
import AddressStripeForm from "./AddressStripeForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE)

const AddressManagement = () => {
  const { theme } = useTheme()
  const { data: session } = useSession()
  const { mutateAsync: deleteAddress } = useDeleteAddress()
  const { data: addresses, isLoading, error } = useAddresses(session?.user.id)
  const [isDialogOpenAdd, setIsDialogOpenAdd] = useState(false)
  const [isDialogOpenUpdate, setIsDialogOpenUpdate] = useState(false)
  const [addressToUpdate, setAddressToUpdate] = useState(null)
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const t = useTranslations("AddressManagement")

  const handleAddSuccess = () => setIsDialogOpenAdd(false)
  const handleUpdateSuccess = () => {
    setIsDialogOpenUpdate(false)
    setAddressToUpdate(null)
  }
  const handleDelete = async (addressId) => {
    await deleteAddress(addressId)
    setIsDialogOpenDelete(false)
    setAddressToDelete(null)
  }

  if (!session || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LucideLoader2 className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div>{t("error_loading")}</div>
  }

  return (
    <Card className="h-full min-h-[500px] w-full shadow-lg">
      <CardHeader className="border-b pb-6">
        <CardTitle className="flex items-center text-3xl">
          <MapPin className="mr-3 h-6 w-6 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses?.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <Label
                  htmlFor={address.id}
                  className="flex flex-1 cursor-pointer items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Home className="h-4 w-4 text-primary" />
                      {address.alias}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {address.line1}, {address.postal_code} {address.city}
                    </p>
                  </div>
                </Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAddressToUpdate(address)
                      setIsDialogOpenUpdate(true)
                    }}
                    className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="ml-1">{t("edit")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAddressToDelete(address.id)
                      setIsDialogOpenDelete(true)
                    }}
                    className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="ml-1">{t("delete")}</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              {t("no_addresses")}
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsDialogOpenAdd(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("add_address")}
          </Button>
        </div>

        <Dialog open={isDialogOpenAdd} onOpenChange={setIsDialogOpenAdd}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                {t("add_address")}
              </DialogTitle>
            </DialogHeader>
            <Elements
              stripe={stripePromise}
              options={theme === "dark" ? stripeOptions : stripeOptionsWhite}
            >
              <AddressStripeForm mode="add" onSuccess={handleAddSuccess} />
            </Elements>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogOpenUpdate} onOpenChange={setIsDialogOpenUpdate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                {t("edit_address")}
              </DialogTitle>
            </DialogHeader>
            <Elements
              stripe={stripePromise}
              options={theme === "dark" ? stripeOptions : stripeOptionsWhite}
            >
              <AddressStripeForm
                mode="edit"
                address={addressToUpdate}
                onSuccess={handleUpdateSuccess}
              />
            </Elements>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                {t("delete_address")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpenDelete(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(addressToDelete)}
              >
                {t("confirm")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default AddressManagement
