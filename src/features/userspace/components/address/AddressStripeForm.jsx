"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/useToast"
import { AddressElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { LucideLoader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useCreateAddress, useUpdateAddress } from "../../hooks/useAddress"

const AddressStripeForm = ({ mode = "add", address, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { mutateAsync: createAddress } = useCreateAddress()
  const { mutateAsync: updateAddress } = useUpdateAddress()
  const [loading, setLoading] = useState(false)
  const t = useTranslations("AddressManagement")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const addressElement = elements.getElement(AddressElement)
    const { value, complete } = await addressElement.getValue()

    if (!complete) {
      toast({ title: t("incomplete_address_toast"), variant: "destructive" })

      return
    }

    try {
      setLoading(true)

      const formattedAddress = {
        line1: value.address.line1,
        line2: value.address.line2 || "",
        city: value.address.city,
        postal_code: value.address.postal_code,
        country: value.address.country,
      }

      if (mode === "order") {
        onSuccess?.(formattedAddress)
      } else if (mode === "add") {
        const newAddress = await createAddress({
          alias: value.name || t("default_alias"),
          line1: value.address.line1,
          line2: value.address.line2,
          city: value.address.city,
          postal_code: value.address.postal_code,
          country: value.address.country,
        })
        onSuccess?.(newAddress)
      } else if (mode === "edit" && address) {
        const updatedAddress = await updateAddress({
          id: address.id,
          alias: value.name || address.alias,
          line1: value.address.line1,
          line2: value.address.line2,
          city: value.address.city,
          postal_code: value.address.postal_code,
          country: value.address.country,
        })
        onSuccess?.(updatedAddress)
      }
    } catch (err) {
      toast({
        title: t("error_toast_title"),
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const buttonText =
    mode === "add" ? t("add_address_button") : t("update_address_button")

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AddressElement
        options={{
          mode: "shipping",
          defaultValues: address
            ? {
                name: address.alias,
                address: {
                  line1: address.line1,
                  line2: address.line2,
                  city: address.city,
                  postal_code: address.postal_code,
                  country: address.country,
                },
              }
            : undefined,
        }}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? <LucideLoader2 className="animate-spin" /> : buttonText}
        </Button>
      </div>
    </form>
  )
}

export default AddressStripeForm
