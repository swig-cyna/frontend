import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, PlusCircle } from "lucide-react"
import { usePaymentMethode } from "@/features/stripe/hooks/usePaymentMethode"

const SavedPaymentMethods = ({ userId, onAddNew }) => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const { data: paymentMethodsData, isLoading } = usePaymentMethode(userId)

  useEffect(() => {
    if (paymentMethodsData?.data && Array.isArray(paymentMethodsData.data)) {
      setPaymentMethods(paymentMethodsData.data)

      if (paymentMethodsData.data.length > 0 && !selectedMethod) {
        setSelectedMethod(paymentMethodsData.data[0].id)
      }
    }
  }, [paymentMethodsData, selectedMethod])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vos méthodes de paiement</CardTitle>
          <CardDescription>
            Sélectionnez une méthode de paiement à utiliser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">Chargement en cours...</div>
        </CardContent>
      </Card>
    )
  }

  const handleSelectPaymentMethod = (methodId) => {
    setSelectedMethod(methodId)
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

  const formatLastFour = (last4) => `•••• ${last4}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos méthodes de paiement</CardTitle>
        <CardDescription>
          Sélectionnez une méthode de paiement à utiliser
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">
              Aucune méthode de paiement enregistrée
            </p>
            <Button variant="outline" className="mt-4" onClick={onAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une méthode de paiement
            </Button>
          </div>
        ) : (
          <RadioGroup
            value={selectedMethod}
            onValueChange={handleSelectPaymentMethod}
          >
            {paymentMethods.map((method) => (
              <div key={method.id} className="mb-3 flex items-center space-x-2">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>
                    {formatCardBrand(method.card.brand)}{" "}
                    {formatLastFour(method.card.last4)} • Expire{" "}
                    {method.card.exp_month}/{method.card.exp_year}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  )
}

export default SavedPaymentMethods
