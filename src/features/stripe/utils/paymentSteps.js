import { CreditCard, Home, ShieldCheck } from "lucide-react"

export const PaymentSteps = {
  SHIPPING: 0,
  BILLING: 1,
  PAYMENT: 2,
}

export const stepsConfig = (t) => [
  {
    key: "SHIPPING",
    icon: <Home className="mr-2 h-5 w-5" />,
    title: t("steps.SHIPPING.title"),
    description: t("steps.SHIPPING.description"),
  },
  {
    key: "BILLING",
    icon: <ShieldCheck className="mr-2 h-5 w-5" />,
    title: t("steps.BILLING.title"),
    description: t("steps.BILLING.description"),
  },
  {
    key: "PAYMENT",
    icon: <CreditCard className="mr-2 h-5 w-5" />,
    title: t("steps.PAYMENT.title"),
    description: t("steps.PAYMENT.description"),
  },
]
