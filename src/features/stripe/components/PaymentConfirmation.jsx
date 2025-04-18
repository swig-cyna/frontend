import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const PaymentConfirmation = () => {
  const t = useTranslations("PaymentConfirmation")

  return (
    <div className="py-10 text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">{t("title")}</h2>
      <p className="mb-6 text-gray-600">{t("description")}</p>
      <Link href="/">
        <Button className="mt-6">{t("backToHome")}</Button>
      </Link>
    </div>
  )
}

export default PaymentConfirmation
