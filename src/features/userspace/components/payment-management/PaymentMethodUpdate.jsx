"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdatePaymentMethod } from "@/features/stripe/hooks/usePaymentMethode"
import { toast } from "@/hooks/useToast"
import { useTranslations } from "next-intl"
import { useState } from "react"

const PaymentMethodUpdate = ({ paymentMethod, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const { mutateAsync: updatePaymentMethod } = useUpdatePaymentMethod()
  const [billingDetails, setBillingDetails] = useState({
    name: paymentMethod?.billing_details?.name || "",
    expMonth: paymentMethod?.card?.exp_month?.toString() || "",
    expYear: paymentMethod?.card?.exp_year?.toString() || "",
  })
  const t = useTranslations("PaymentMethodUpdate")

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1

    return {
      value: month.toString(),
      label: month.toString().padStart(2, "0"),
    }
  })

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 21 }, (_, i) => {
    const year = currentYear + i

    return {
      value: year.toString(),
      label: year.toString(),
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!billingDetails.name.trim()) {
      toast({
        title: t("missingInfo"),
        description: t("nameRequired"),
        variant: "destructive",
      })

      return
    }

    try {
      setLoading(true)

      console.log(billingDetails)

      await updatePaymentMethod({
        paymentMethodId: paymentMethod.id,
        name: billingDetails.name,
        expMonth: parseInt(billingDetails.expMonth, 10),
        expYear: parseInt(billingDetails.expYear, 10),
      })

      toast({
        title: t("success"),
        description: t("cardUpdated"),
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la méthode de paiement:",
        error,
      )
      toast({
        title: t("error"),
        description: error.message || t("cannotUpdateCard"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">{t("cardholderName")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("cardholderNamePlaceholder")}
                value={billingDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="expMonth">{t("expiryMonth")}</Label>
                <Select
                  value={billingDetails.expMonth}
                  onValueChange={(value) =>
                    handleSelectChange("expMonth", value)
                  }
                >
                  <SelectTrigger id="expMonth">
                    <SelectValue placeholder={t("monthPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="expYear">{t("expiryYear")}</Label>
                <Select
                  value={billingDetails.expYear}
                  onValueChange={(value) =>
                    handleSelectChange("expYear", value)
                  }
                >
                  <SelectTrigger id="expYear">
                    <SelectValue placeholder={t("yearPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={() => onSuccess()}
              >
                {t("cancelButton")}
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? t("processingButton") : t("updateButton")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default PaymentMethodUpdate
