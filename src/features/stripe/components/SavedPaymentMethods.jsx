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
import {
  usePaymentConfirm,
  usePaymentIntent,
} from "@/features/stripe/hooks/usePaymentIntent"
import { usePaymentMethod } from "@/features/stripe/hooks/usePaymentMethode"
import { toast } from "@/hooks/use-toast"
import { CreditCard, PlusCircle, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const SavedPaymentMethods = ({
  userId,
  onAddNew,
  onPaymentComplete,
  onGoBack,
  cartItems,
  total,
  stripePromise,
}) => {
  const t = useTranslations("SavedPaymentMethods")
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const { data: paymentMethodsData, isLoading } = usePaymentMethod(userId)
  const { mutateAsync: createPaymentIntent } = usePaymentIntent()
  const { mutateAsync: confirmPayment } = usePaymentConfirm()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

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

  const handleSubmit = async () => {
    const stripe = await stripePromise

    if (!selectedMethod) {
      toast({
        title: t("paymentMethodRequired"),
        description: t("paymentMethodRequiredDesc"),
        variant: "destructive",
      })

      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const cartItemsForApi = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))

      const paymentIntentResponse = await createPaymentIntent({
        userId,
        cartItems: cartItemsForApi,
        paymentMethodId: selectedMethod,
      })

      if (!paymentIntentResponse || !paymentIntentResponse.clientSecret) {
        throw new Error(t("createPaymentIntentError"))
      }

      const result = await stripe.confirmCardPayment(
        paymentIntentResponse.clientSecret,
        {
          payment_method: selectedMethod,
        },
      )

      if (result.error) {
        throw new Error(`${t("paymentError")}: ${result.error.message}`)
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        const confirmationResponse = await confirmPayment({
          paymentIntentId: result.paymentIntent.id,
        })

        if (confirmationResponse && confirmationResponse.success) {
          toast({
            title: "paymentSuccess",
            description: "orderConfirmed",
          })

          onPaymentComplete()
        } else {
          throw new Error(
            confirmationResponse.message ||
              "Erreur lors de la confirmation du paiement",
          )
        }
      }
    } catch (err) {
      console.error(`${t("paymentError")}:`, err)
      setError(err.message || t("paymentErrorDefault"))
      toast({
        title: t("paymentError"),
        description: err.message || t("paymentErrorDefault"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
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

          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={onAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("addNewCard")}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onGoBack} variant="outline" className="mr-2">
            {t("back")}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("summary")}</CardTitle>
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
              <span>{t("total")}</span>
              <span className="font-bold">€{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm text-muted-foreground">
              <span>{t("vatIncluded")}</span>
              <span>€{(total * 0.2).toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={
                !selectedMethod || isProcessing || cartItems.length === 0
              }
            >
              {isProcessing
                ? t("processingButton")
                : `${t("payButton")} ${total.toFixed(2)} €`}
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
            {t("securePaymentTitle")}
          </AlertTitle>
          <AlertDescription className="text-xs">
            {t("securePaymentDesc")}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default SavedPaymentMethods
