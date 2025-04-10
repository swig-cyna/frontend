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
import { Separator } from "@/components/ui/separator"
import { useAttachPaymentMethod } from "@/features/stripe/hooks/usePaymentMethode"
import { toast } from "@/hooks/useToast"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useState } from "react"

const AddPaymentMethodForm = ({ userId, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const { mutateAsync: attachPaymentMethod } = useAttachPaymentMethod()
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    addressLine1: "",
    city: "",
    postalCode: "",
    country: "",
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
        title: "Information manquante",
        description: "Veuillez indiquer le nom du titulaire de la carte",
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
          address: {
            line1: billingDetails.addressLine1,
            city: billingDetails.city,
            postal_code: billingDetails.postalCode,
            country: billingDetails.country,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      await attachPaymentMethod({ userId, paymentMethodId: paymentMethod.id })

      toast({
        title: "Succès",
        description: "Nouvelle méthode de paiement ajoutée",
      })

      elements.getElement(CardElement).clear()
      setBillingDetails({
        name: "",
        addressLine1: "",
        city: "",
        postalCode: "",
        country: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la méthode de paiement:", error)
      toast({
        title: "Erreur",
        description:
          error.message || "Impossible d'ajouter cette méthode de paiement",
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
        <CardTitle>Ajouter une nouvelle carte bancaire</CardTitle>
        <CardDescription>
          Saisissez les informations de votre carte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="card-element">Informations de carte</Label>
              <div className="rounded-md border p-3">
                <CardElement id="card-element" options={cardElementOptions} />
              </div>
              <p className="text-sm text-muted-foreground">
                Votre carte sera traitée de manière sécurisée par Stripe.
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="name">Nom du titulaire</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jean Dupont"
                value={billingDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <Separator className="my-4" />

            <h3 className="text-lg font-medium">Adresse de facturation</h3>

            <div className="grid gap-3">
              <Label htmlFor="addressLine1">Adresse</Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                placeholder="123 rue de Paris"
                value={billingDetails.addressLine1}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Paris"
                  value={billingDetails.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="75001"
                  value={billingDetails.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                name="country"
                placeholder="France"
                value={billingDetails.country}
                onChange={handleInputChange}
              />
            </div>

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={!stripe || loading}
            >
              {loading ? "Traitement en cours..." : "Ajouter cette carte"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddPaymentMethodForm
