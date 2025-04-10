import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { usePaymentMethode } from "@/features/stripe/hooks/usePaymentMethode"
import { useAddSubsciption } from "@/features/stripe/hooks/useSubscription"
import { toast } from "@/hooks/use-toast"
import { CreditCard, PlusCircle, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

const SavedPaymentMethods = ({
  userId,
  onAddNew,
  onPaymentComplete,
  onGoBack,
  cartItems,
  total,
}) => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const { data: paymentMethodsData, isLoading } = usePaymentMethode(userId)
  const { mutateAsync: addSubscription } = useAddSubsciption()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (paymentMethodsData?.data && Array.isArray(paymentMethodsData.data)) {
      setPaymentMethods(paymentMethodsData.data)

      if (paymentMethodsData.data.length > 0 && !selectedMethod) {
        setSelectedMethod(paymentMethodsData.data[0].id)
      }
    }
  }, [paymentMethodsData, selectedMethod])

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

  const handleSubmit = () => {
    if (!selectedMethod) {
      toast({
        title: "Méthode de paiement requise",
        description:
          "Veuillez sélectionner une méthode de paiement pour continuer",
        variant: "destructive",
      })

      return
    }

    setIsProcessing(true)

    cartItems.forEach(async (product) => {
      await addSubscription({
        userId,
        paymentMethodeId: selectedMethod,
        productId: product.id,
        quantity: product.quantity,
      })
    })

    setTimeout(() => {
      setIsProcessing(false)

      if (onPaymentComplete) {
        onPaymentComplete()
      }
    }, 2000)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your payment methods</CardTitle>
          <CardDescription>Select a payment method to use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">Loading in progress...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Vos méthodes de paiement
          </CardTitle>
          <CardDescription>
            Sélectionnez une carte pour finaliser votre commande
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="py-10 text-center">
              <p className="mb-4 text-gray-500">
                Aucune méthode de paiement enregistrée
              </p>
              <Button onClick={onAddNew} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une carte
              </Button>
            </div>
          ) : (
            <RadioGroup
              value={selectedMethod}
              onValueChange={setSelectedMethod}
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
                          Expire {method.card.exp_month}/{method.card.exp_year}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={onAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une nouvelle carte
            </Button>
          </div>
        </CardContent>
        <Button onClick={onGoBack}>Back</Button>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-1">
                <span className="text-sm">
                  {item.name} (x{item.quantity})
                </span>
                <span className="text-sm font-medium">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between py-1">
              <span>Total avec TVA</span>
              <span className="font-bold">€{(total * 1.2).toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!selectedMethod || isProcessing}
            >
              {isProcessing ? "Traitement..." : "Payer maintenant"}
            </Button>
          </CardFooter>
        </Card>

        <Alert className="border-muted bg-muted/50">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle className="text-sm font-medium">
            Paiement sécurisé
          </AlertTitle>
          <AlertDescription className="text-xs">
            Vos informations de paiement sont protégées par un chiffrement SSL.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default SavedPaymentMethods
