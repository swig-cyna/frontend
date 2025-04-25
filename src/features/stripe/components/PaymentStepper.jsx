import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSession } from "@/features/auth/utils/authClient"
import { toast } from "@/hooks/useToast"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { usePaymentConfirm, usePaymentIntent } from "../hooks/usePaymentIntent"
import { useUpdatePaymentMethod } from "../hooks/usePaymentMethode"
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
  const { mutateAsync: updatePaymentMethod } = useUpdatePaymentMethod()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const { data: session } = useSession()

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
      const formatStripeAddress = (address) => ({
        address: {
          line1: address.line1,
          line2: address.line2 || "",
          city: address.city,
          postal_code: address.postal_code,
          country: address.country,
        },
        name: session.user.name,
      })

      const paymentIntentResponse = await createPaymentIntent({
        userId,
        cartItems: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentMethodId: selectedPaymentMethod,
        shipping: formatStripeAddress(shippingAddress),
      })

      if (!paymentIntentResponse?.clientSecret) {
        throw new Error(t("createPaymentIntentError"))
      }

      await updatePaymentMethod({
        paymentMethodId: selectedPaymentMethod,
        name: session.user.name,
        email: session.user.email,
        address: {
          line1: useSameAddress ? shippingAddress.line1 : billingAddress.line1,
          line2: useSameAddress
            ? shippingAddress.line2 || ""
            : billingAddress.line2 || "",
          city: useSameAddress ? shippingAddress.city : billingAddress.city,
          postal_code: useSameAddress
            ? shippingAddress.postal_code
            : billingAddress.postal_code,
          country: useSameAddress
            ? shippingAddress.country
            : billingAddress.country,
        },
      })

      const result = await stripe.confirmCardPayment(
        paymentIntentResponse.clientSecret,
        {
          payment_method: selectedPaymentMethod,
          receipt_email: session.user.email,
        },
      )

      if (result.error) throw new Error(result.error.message)

      if (result.paymentIntent?.status === "succeeded") {
        await confirmPayment({
          paymentIntentId: result.paymentIntent.id,
          shippingAddress,
          billingAddress: useSameAddress ? shippingAddress : billingAddress,
        })

        onPaymentComplete()
        toast({ title: t("success"), description: t("orderConfirmed") })
      }
    } catch (err) {
      console.error(`${t("paymentError")}:`, err)
      setError(err.message || t("paymentErrorDefault"))
      toast({
        title: t("paymentError"),
        description: err.message,
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
