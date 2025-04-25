import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/hooks/useToast"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { usePaymentConfirm, usePaymentIntent } from "../hooks/usePaymentIntent"
import { PaymentSteps, stepsConfig } from "../utils/paymentSteps"
import BillingStep from "./Addresses/BillingStep"
import ShippingStep from "./Addresses/ShippingStep"
import PaymentStep from "./PaymentMethod/PaymentStep"
import PaymentPanel from "./PaymentPanel"

const PaymentStepper = ({
  userId,
  onPaymentComplete,
  cartItems,
  total,
  onGoBack,
  stripePromise,
}) => {
  const [step, setStep] = useState(PaymentSteps.SHIPPING)
  const currentStepConfig = stepsConfig(useTranslations("Steps"))[step]
  const [shippingAddress, setShippingAddress] = useState(null)
  const [billingAddress, setBillingAddress] = useState(null)
  const [useSameAddress, setUseSameAddress] = useState(true)
  const [addingShipping, setAddingShipping] = useState(false)
  const [addingBilling, setAddingBilling] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [addingPaymentMethod, setAddingPaymentMethod] = useState(false)
  const [canPay, setCanPay] = useState(false)

  const { mutateAsync: createPaymentIntent } = usePaymentIntent()
  const { mutateAsync: confirmPayment } = usePaymentConfirm()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const t = useTranslations("PaymentStepper")

  const isShippingValid = Boolean(shippingAddress)
  const isBillingValid = useSameAddress
    ? Boolean(shippingAddress)
    : Boolean(billingAddress)
  const isPaymentValid = Boolean(selectedPaymentMethod)

  useEffect(() => {
    setCanPay(
      step === PaymentSteps.PAYMENT &&
        isShippingValid &&
        isBillingValid &&
        isPaymentValid,
    )
  }, [step, isShippingValid, isBillingValid, isPaymentValid])

  const handleNext = () => {
    switch (step) {
      case PaymentSteps.SHIPPING:
        if (!isShippingValid) {
          toast({
            title: t("validationError"),
            description: t("selectShippingAddress"),
            variant: "destructive",
          })

          return
        }

        break

      case PaymentSteps.BILLING:
        if (!isBillingValid) {
          toast({
            title: t("validationError"),
            description: useSameAddress
              ? t("shippingAddressRequired")
              : t("selectBillingAddress"),
            variant: "destructive",
          })

          return
        }

        break

      case PaymentSteps.PAYMENT:
        if (!isPaymentValid) {
          toast({
            title: t("validationError"),
            description: t("selectPaymentMethod"),
            variant: "destructive",
          })

          return
        }

        break
    }

    if (step === PaymentSteps.SHIPPING) {
      setStep(useSameAddress ? PaymentSteps.PAYMENT : PaymentSteps.BILLING)
    } else {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step === PaymentSteps.PAYMENT && useSameAddress) {
      setStep(PaymentSteps.SHIPPING)
    } else {
      setStep(step - 1)
    }
  }

  const handleBack = () => {
    if (addingShipping) {
      setAddingShipping(false)

      return
    }

    if (addingBilling) {
      setAddingBilling(false)

      return
    }

    if (addingPaymentMethod) {
      setAddingPaymentMethod(false)

      return
    }

    if (step === PaymentSteps.SHIPPING) {
      onGoBack()
    } else {
      handlePrev()
    }
  }

  const handleSubmit = async () => {
    const stripe = await stripePromise

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
        paymentMethodId: selectedPaymentMethod,
      })

      if (!paymentIntentResponse || !paymentIntentResponse.clientSecret) {
        throw new Error(t("createPaymentIntentError"))
      }

      const result = await stripe.confirmCardPayment(
        paymentIntentResponse.clientSecret,
        {
          payment_method: selectedPaymentMethod,
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

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            {currentStepConfig.icon}
            {currentStepConfig.title}
          </CardTitle>
          <CardDescription>{currentStepConfig.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {step === PaymentSteps.SHIPPING && (
            <ShippingStep
              useSameAddress={useSameAddress}
              setUseSameAddress={setUseSameAddress}
              addingShipping={addingShipping}
              setAddingShipping={setAddingShipping}
              setBillingAddress={setBillingAddress}
              userId={userId}
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}
              stripePromise={stripePromise}
            ></ShippingStep>
          )}

          {step === PaymentSteps.BILLING && (
            <BillingStep
              userId={userId}
              useSameAddress={useSameAddress}
              stripePromise={stripePromise}
              addingBilling={addingBilling}
              setAddingBilling={setAddingBilling}
              billingAddress={billingAddress}
              setBillingAddress={setBillingAddress}
            ></BillingStep>
          )}

          {step === PaymentSteps.PAYMENT && (
            <PaymentStep
              addingPaymentMethod={addingPaymentMethod}
              setAddingPaymentMethod={setAddingPaymentMethod}
              userId={userId}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              stripePromise={stripePromise}
            ></PaymentStep>
          )}
        </CardContent>
        <CardFooter className="flex w-full justify-between">
          <Button variant="outline" onClick={handleBack}>
            {t("back")}
          </Button>
          {step !== PaymentSteps.PAYMENT && (
            <Button onClick={handleNext} className="mr-2">
              {t("next")}
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="space-y-4">
        <PaymentPanel
          cartItems={cartItems}
          total={total}
          canPay={canPay}
          isProcessing={isProcessing}
          error={error}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default PaymentStepper
