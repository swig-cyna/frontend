import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { ShieldCheck } from "lucide-react"

const PaymentPanel = ({
  cartItems,
  total,
  canPay,
  isProcessing,
  error,
  t,
  handleSubmit,
}) => (
  <>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t("summary")}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {cartItems?.map((item) => (
          <div key={item.id} className="flex justify-between py-1">
            <span className="text-sm">
              {item.name} (x{item.quantity})
            </span>
            <span className="text-sm font-medium">
              €{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <Separator className="my-2" />
        <div className="flex justify-between py-1">
          <span>{t("total")}</span>
          <span className="font-bold">€{total?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1 text-sm text-muted-foreground">
          <span>{t("vatIncluded")}</span>
          <span>€{(total * 0.2)?.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!canPay || isProcessing || cartItems.length === 0}
        >
          {isProcessing
            ? t("processingButton")
            : `${t("payButton")} ${(total * 1.2)?.toFixed(2)} €`}
        </Button>
      </CardFooter>
    </Card>
    {error && (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    <Alert className="border-muted bg-muted/50">
      <ShieldCheck className="h-4 w-4" />
      <AlertTitle className="text-sm font-medium">
        {t("securePaymentTitle")}
      </AlertTitle>
      <AlertDescription className="text-xs">
        {t("securePaymentDesc")}
      </AlertDescription>
    </Alert>
  </>
)
export default PaymentPanel
