import useCartStore from "@/features/cart/stores/cartStore"
import RecapCart from "@/features/stripe/components/Recap/Cart"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useTranslations } from "next-intl"
import { useState } from "react"
import PaymentConfirmation from "./PaymentConfirmation"
import AddPaymentMethodForm from "./PaymentMethod/AddPaymentMethodForm"
import PaymentStepper from "./PaymentStepper"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE)

const PaymentForm = ({ userId }) => {
  const t = useTranslations("PaymentForm")
  const { cartItems, totalPrice } = useCartStore()
  const [activeStep, setActiveStep] = useState("recap")
  const [paymentComplete, setPaymentComplete] = useState(false)

  const handleContinueToPayment = () => {
    setActiveStep("saved")
  }

  const handleBackToRecap = () => {
    setActiveStep("recap")
  }

  const handleCardAdded = () => {
    setActiveStep("saved")
  }

  const handlePaymentComplete = () => {
    setPaymentComplete(true)
  }

  if (paymentComplete) {
    return <PaymentConfirmation />
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
        <p className="text-gray-500">{t("description")}</p>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex max-w-2xl items-center justify-center">
          <div
            className={`flex flex-1 flex-col items-center ${activeStep === "recap" ? "text-primary" : "text-gray-500"}`}
          >
            <div
              className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${activeStep === "recap" ? "bg-primary text-white" : "bg-muted"}`}
            >
              1
            </div>
            <span className="text-sm">{t("step1")}</span>
          </div>
          <div
            className={`h-0.5 w-16 ${activeStep !== "recap" ? "bg-primary" : "bg-muted"}`}
          />
          <div
            className={`flex flex-1 flex-col items-center ${activeStep === "saved" || activeStep === "new" ? "text-primary" : "text-gray-500"}`}
          >
            <div
              className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${activeStep === "saved" || activeStep === "new" ? "bg-primary text-white" : "bg-muted"}`}
            >
              2
            </div>
            <span className="text-sm">{t("step2")}</span>
          </div>
          <div className="h-0.5 w-16 bg-muted" />
          <div className="flex flex-1 flex-col items-center text-gray-500">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              3
            </div>
            <span className="text-sm">{t("step3")}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {activeStep === "recap" && (
          <RecapCart
            onContinue={handleContinueToPayment}
            cartItems={cartItems}
            total={totalPrice}
          />
        )}

        {activeStep === "saved" && (
          <PaymentStepper
            userId={userId}
            onPaymentComplete={handlePaymentComplete}
            onGoBack={handleBackToRecap}
            cartItems={cartItems}
            total={totalPrice}
            stripePromise={stripePromise}
          />
        )}

        {activeStep === "new" && (
          <Elements stripe={stripePromise}>
            <AddPaymentMethodForm onSuccess={handleCardAdded} userId={userId} />
          </Elements>
        )}
      </div>
    </div>
  )
}

export default PaymentForm
