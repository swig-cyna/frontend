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
import AddPaymentMethodForm from "@/features/stripe/components/PaymentMethod/AddPaymentMethodForm"
import { usePaymentMethod } from "@/features/stripe/hooks/usePaymentMethode"
import { useAddSubsciption } from "@/features/subscriptions/hooks/useSubscription"
import { toast } from "@/hooks/useToast"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CreditCard, PlusCircle, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE)

const PaymentSubscriptionPage = () => {
  const router = useRouter()
  const t = useTranslations("Subscriptions")
  const { data: session } = useSession()
  const { data: paymentMethodsData, isLoading } = usePaymentMethod(
    session?.user.id,
  )
  const { mutateAsync: createSubscription } = useAddSubsciption()
  const [cartItem, setCartItem] = useState([])
  const [totals, setTotals] = useState(0)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [showNewCardForm] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [activeStep, setActiveStep] = useState("saved")

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
          setCartItem(cartItems)
          setTotals(total)
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
        title: t("Payment.paymentMethodRequired"),
        description: t("Payment.selectPaymentMethodError"),
        variant: "destructive",
      })

      return
    }

    setIsProcessing(true)
    setError(null)

    const subscription = await createSubscription({
      userId: session?.user.id,
      plantId: cartItem[0].id,
      paymentMethodId: selectedMethod,
      interval: cartItem[0].interval,
    })

    if (subscription) {
      setPaymentComplete(true)
    }
  }

  const handleAddNewCard = () => {
    setActiveStep("new")
  }

  const handleCardAdded = () => {
    setActiveStep("saved")
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
      <h1 className="mb-6 text-2xl font-bold">{t("Payment.title")}</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {activeStep === "saved" ? (
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                {t("Payment.paymentMethods")}
              </CardTitle>
              <CardDescription>
                {t("Payment.selectPaymentMethod")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
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
                    {t("Payment.addNewCard")}
                  </Button>
                </div>
              </>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGoBack} variant="outline" className="mr-2">
                {t("Payment.backButton")}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Elements stripe={stripePromise}>
            <AddPaymentMethodForm
              onSuccess={handleCardAdded}
              userId={session?.user.id}
            />
          </Elements>
        )}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {t("Payment.orderSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              {cartItem.map((item) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span className="text-sm">{`${t("Payment.subscription")} ${item.name}`}</span>
                  <span className="text-sm font-medium">
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between py-1">
                <span>{t("Payment.total")}</span>
                <span className="font-bold">€{totals.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm text-muted-foreground">
                <span>{t("Payment.vatIncluded")}</span>
                <span>€{(totals * 0.2).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={
                  !selectedMethod ||
                  isProcessing ||
                  cartItem.length === 0 ||
                  showNewCardForm
                }
              >
                {isProcessing
                  ? t("Payment.processingPayment")
                  : t("Payment.payAmount", { amount: totals.toFixed(2) })}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t("Payment.errorTitle")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="border-muted bg-muted/50">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle className="text-sm font-medium">
              {t("Payment.securePaymentTitle")}
            </AlertTitle>
            <AlertDescription className="text-xs">
              {t("Payment.securePaymentDesc")}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

export default PaymentSubscriptionPage
