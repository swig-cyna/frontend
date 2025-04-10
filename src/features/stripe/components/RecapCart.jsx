import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import RecapRowProduct from "@/features/stripe/components/RecapRowProduct"
import { ArrowRight, ShoppingCart } from "lucide-react"

const RecapCart = ({ onContinue, cartItems, total }) => (
  <div className="space-y-6">
    <div className="rounded-lg border bg-muted/30 p-6">
      <h2 className="mb-4 flex items-center text-lg font-medium">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Votre panier
      </h2>

      <div className="space-y-3">
        {cartItems.map((item) => (
          <RecapRowProduct key={item.id} data={item} />
        ))}
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between py-2">
        <span className="text-lg">Sous-total</span>
        <span className="text-lg font-medium">€{total.toFixed(2)}</span>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-lg">TVA (20%)</span>
        <span className="text-lg font-medium">€{(total * 0.2).toFixed(2)}</span>
      </div>

      <Separator className="my-2" />

      <div className="flex items-center justify-between py-2">
        <span className="text-xl font-bold">Total</span>
        <span className="text-xl font-bold">€{(total * 1.2).toFixed(2)}</span>
      </div>
    </div>

    <div className="text-center">
      <Button onClick={onContinue} className="w-full max-w-md" size="lg">
        Continuer vers le paiement
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
)

export default RecapCart
