import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import RecapRowProduct from "@/features/stripe/components/RecapRowProduct"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { useTranslations } from "next-intl"

const RecapCart = ({ onContinue, cartItems, total }) => {
  const t = useTranslations("RecapCart")

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/30 p-6">
        <h2 className="mb-4 flex items-center text-lg font-medium">
          <ShoppingCart className="mr-2 h-5 w-5" />
          {t("summary")}
        </h2>

        <div className="space-y-3">
          {cartItems.map((item) => (
            <RecapRowProduct key={item.id} data={item} />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between py-2">
          <span className="text-lg">{t("subtotal")}</span>
          <span className="text-lg font-medium">€{total.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-lg">{t("vat")}</span>
          <span className="text-lg font-medium">
            €{(total * 0.2).toFixed(2)}
          </span>
        </div>

        <Separator className="my-2" />

        <div className="flex items-center justify-between py-2">
          <span className="text-xl font-bold">{t("total")}</span>
          <span className="text-xl font-bold">€{(total * 1.2).toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onContinue} className="w-full max-w-md" size="lg">
          {t("continueToPayment")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default RecapCart
