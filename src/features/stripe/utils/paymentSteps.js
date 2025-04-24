import { CreditCard, Home, ShieldCheck } from "lucide-react"

export const PaymentSteps = {
  SHIPPING: 0,
  BILLING: 1,
  PAYMENT: 2,
}

export const stepsConfig = [
  {
    key: "SHIPPING",
    icon: <Home className="mr-2 h-5 w-5" />,
    title: "Adresse de livraison",
    description: "Sélectionnez ou ajoutez votre adresse de livraison.",
  },
  {
    key: "BILLING",
    icon: <ShieldCheck className="mr-2 h-5 w-5" />,
    title: "Adresse de facturation",
    description: "Sélectionnez ou ajoutez votre adresse de facturation.",
  },
  {
    key: "PAYMENT",
    icon: <CreditCard className="mr-2 h-5 w-5" />,
    title: "Paiement",
    description: "Choisissez votre méthode de paiement préférée.",
  },
]
