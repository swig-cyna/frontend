import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { usePaymentMethod } from "@/features/stripe/hooks/usePaymentMethode"
import { CreditCard, PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const SavedPaymentMethods = ({
  userId,
  onAddNew,
  onSelect,
  selectedMethod,
}) => {
  const t = useTranslations("SavedPaymentMethods")
  const [paymentMethods, setPaymentMethods] = useState([])
  const { data: paymentMethodsData, isLoading } = usePaymentMethod(userId)

  useEffect(() => {
    if (paymentMethodsData?.data && Array.isArray(paymentMethodsData.data)) {
      setPaymentMethods(paymentMethodsData.data)

      if (paymentMethodsData.data.length > 0 && !selectedMethod) {
        onSelect(paymentMethodsData.data[0].id)
      }
    }
  }, [paymentMethodsData, onSelect, selectedMethod])

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    )
  }

  return (
    <div className="md:grid-cols-1fr grid gap-6">
      <RadioGroup
        value={selectedMethod?.id}
        onValueChange={onSelect}
        className="space-y-2"
      >
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <RadioGroupItem value={method.id} id={method.id} />
            <Label
              htmlFor={method.id}
              className="flex flex-1 cursor-pointer items-center"
            >
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">
                    {formatCardBrand(method.card.brand)} ••••{" "}
                    {method.card.last4}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("expireLabel", {
                      month: method.card.exp_month,
                      year: method.card.exp_year,
                    })}
                  </div>
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={onAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("addNewCard")}
        </Button>
      </div>
    </div>
  )
}

export default SavedPaymentMethods
