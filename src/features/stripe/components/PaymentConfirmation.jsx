import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

const PaymentConfirmation = () => (
  <div className="py-10 text-center">
    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
      <CheckCircle className="h-8 w-8 text-green-600" />
    </div>
    <h2 className="mb-2 text-2xl font-bold">Paiement confirmé !</h2>
    <p className="mb-6 text-gray-600">
      Merci pour votre commande. Un reçu a été envoyé à votre adresse email.
    </p>
    <div className="mx-auto max-w-md rounded-lg bg-muted/30 p-6">
      <h3 className="mb-3 font-medium">Détails de la commande</h3>
      <div className="mb-2 flex justify-between">
        <span>Numéro de commande</span>
        <span className="font-mono">#12345678</span>
      </div>
      <div className="mb-2 flex justify-between">
        <span>Date</span>
        <span>09/04/2025</span>
      </div>
      <div className="mb-2 flex justify-between">
        <span>Montant</span>
        <span>€59.99</span>
      </div>
    </div>
    <Button className="mt-6">Retour à l'accueil</Button>
  </div>
)

export default PaymentConfirmation
