import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

const PaymentConfirmation = () => (
  <div className="py-10 text-center">
    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
      <CheckCircle className="h-8 w-8 text-green-600" />
    </div>
    <h2 className="mb-2 text-2xl font-bold">Paiement confirmé !</h2>
    <p className="mb-6 text-gray-600">
      Merci pour votre commande. Un reçu a été envoyé à votre adresse email.
    </p>
    <Link href="/">
      <Button className="mt-6">Retour à l'accueil</Button>
    </Link>
  </div>
)

export default PaymentConfirmation
