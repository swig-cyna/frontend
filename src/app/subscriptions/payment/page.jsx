"use client"

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
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/features/auth/utils/authClient"
import PaymentConfirmation from "@/features/stripe/components/PaymentConfirmation"
import { usePaymentMethod } from "@/features/stripe/hooks/usePaymentMethode"
import { useAddSubsciption } from "@/features/subscriptions/hooks/useSubscription"
import { toast } from "@/hooks/use-toast"
import { CreditCard, PlusCircle, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const PaymentSubscriptionPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { data: paymentMethodsData, isLoading } = usePaymentMethod(
    session?.user.id,
  )
  const { mutateAsync: createSubscription } = useAddSubsciption()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  useEffect(() => {
    if (paymentMethodsData?.data && Array.isArray(paymentMethodsData.data)) {
      setPaymentMethods(paymentMethodsData.data)

      if (paymentMethodsData.data.length > 0 && !selectedMethod) {
        setSelectedMethod(paymentMethodsData.data[0].id)
      }
    }

    const loadPlanData = () => {
      try {
        const planData = localStorage.getItem("selectedPlan")

        if (planData) {
          const { cartItems, total } = JSON.parse(planData)
          setCartItems(cartItems)
          setTotal(total)
        } else {
          router.push("/")
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données du plan:", err)
        router.push("/")
      }
    }

    loadPlanData()
  }, [router, paymentMethodsData, selectedMethod])

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

  const handleSubmit = async () => {
    if (!selectedMethod) {
      toast({
        title: "Méthode de paiement requise",
        description: "Veuillez sélectionner une méthode de paiement",
        variant: "destructive",
      })

      return
    }

    setIsProcessing(true)
    setError(null)

    const subscription = await createSubscription({
      userId: session?.user.id,
      plantId: cartItems[0].id,
      paymentMethodId: selectedMethod,
      interval: cartItems[0].interval,
    })

    if (subscription) {
      setPaymentComplete(true)
    }
  }

  const handleAddNewCard = () => {
    setShowNewCardForm(true)
  }

  const handleGoBack = () => {
    router.push("/subscriptions")
  }

  if (isLoading && !session) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (paymentComplete) {
    return <PaymentConfirmation />
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Paiement</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Méthodes de paiement
            </CardTitle>
            <CardDescription>
              Sélectionnez votre méthode de paiement préférée
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {!showNewCardForm ? (
              <>
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
                              Expire {method.card.exp_month}/
                              {method.card.exp_year}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={handleAddNewCard}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une nouvelle carte
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  {/* Formulaire simplifié pour ajouter une nouvelle carte */}
                  <p className="mb-4">
                    Formulaire d'ajout de carte (à intégrer avec votre solution
                    de paiement)
                  </p>
                  <Button onClick={() => setShowNewCardForm(false)}>
                    Retour aux cartes sauvegardées
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleGoBack} variant="outline" className="mr-2">
              Retour
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span className="text-sm">{item.description}</span>
                  <span className="text-sm font-medium">
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between py-1">
                <span>Total</span>
                <span className="font-bold">€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm text-muted-foreground">
                <span>TVA incluse</span>
                <span>€{(total * 0.2).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={
                  !selectedMethod ||
                  isProcessing ||
                  cartItems.length === 0 ||
                  showNewCardForm
                }
              >
                {isProcessing
                  ? "Traitement en cours..."
                  : `Payer ${total.toFixed(2)} €`}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="border-muted bg-muted/50">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle className="text-sm font-medium">
              Paiement sécurisé
            </AlertTitle>
            <AlertDescription className="text-xs">
              Toutes vos données de paiement sont cryptées et sécurisées. Nous
              ne stockons pas vos informations de carte.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

export default PaymentSubscriptionPage
