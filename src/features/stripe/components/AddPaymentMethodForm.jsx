import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAttachPaymentMethod } from "@/features/stripe/hooks/usePaymentMethode"
import { toast } from "@/hooks/useToast"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { CreditCard, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

const AddPaymentMethodForm = ({ userId, onSuccess }) => {
  const t = useTranslations("AddPaymentMethodForm")
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const { mutateAsync: attachPaymentMethod } = useAttachPaymentMethod()
  const [billingDetails, setBillingDetails] = useState({
    name: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!billingDetails.name.trim()) {
      toast({
        title: t("missingInfo"),
        description: t("nameRequired"),
        variant: "destructive",
      })

      return
    }

    try {
      setLoading(true)

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: billingDetails.name,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      await attachPaymentMethod({ userId, paymentMethodId: paymentMethod.id })

      toast({
        title: t("success"),
        description: t("addedPaymentMethod"),
      })

      elements.getElement(CardElement).clear()
      setBillingDetails({
        name: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la méthode de paiement:", error)
      toast({
        title: t("error"),
        description: error.message || t("cannotAddPayment"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          {t("cardTitle")}
        </CardTitle>
        <CardDescription>{t("cardDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="card-element">{t("cardInfoLabel")}</Label>
              <div className="rounded-md border p-4">
                <CardElement id="card-element" options={cardElementOptions} />
              </div>
              <p className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="mr-1 h-4 w-4" />
                {t("secureProcessing")}
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="name">{t("cardholderName")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("cardholderNamePlaceholder")}
                value={billingDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={() => onSuccess()}
              >
                {t("cancelButton")}
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? t("processingButton") : t("addCardButton")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddPaymentMethodForm
