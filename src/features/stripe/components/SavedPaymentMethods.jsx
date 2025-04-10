import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { usePaymentMethode } from "@/features/stripe/hooks/usePaymentMethode"
import { useAddSubsciption } from "@/features/stripe/hooks/useSubscription"
import { toast } from "@/hooks/use-toast"
import { CreditCard, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"

const SavedPaymentMethods = ({ userId, onAddNew, data }) => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const { data: paymentMethodsData, isLoading } = usePaymentMethode(userId)
  const { mutateAsync: addSubscription } = useAddSubsciption()

  useEffect(() => {
    if (paymentMethodsData?.data && Array.isArray(paymentMethodsData.data)) {
      setPaymentMethods(paymentMethodsData.data)

      if (paymentMethodsData.data.length > 0 && !selectedMethod) {
        setSelectedMethod(paymentMethodsData.data[0].id)
      }
    }
  }, [paymentMethodsData, selectedMethod])

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

  const handleSubmit = () => {
    console.log(selectedMethod)
    console.log(userId)
    console.log(data[0].id)
    console.log(data[0].quantity)

    if (!selectedMethod) {
      toast({
        title: "Méthode de paiement requise",
        description:
          "Veuillez sélectionner une méthode de paiement pour continuer",
        variant: "destructive",
      })

      return
    }

    data.forEach(async (product) => {
      await addSubscription({
        userId,
        paymentMethodeId: selectedMethod,
        productId: product.id,
        quantity: product.quantity,
      })
    })
  }

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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vos méthodes de paiement</CardTitle>
          <CardDescription>
            Sélectionnez une méthode de paiement à utiliser
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          <div className="py-2 text-center">
            <Button variant="outline" className="mt-4" onClick={onAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une méthode de paiement
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-1 flex-col items-end justify-end">
        <Button className="mt-4" onClick={handleSubmit}>
          Payer
        </Button>
      </div>
    </>
  )
}

export default SavedPaymentMethods
