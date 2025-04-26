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
import { useFormatter, useTranslations } from "next-intl"

const PaymentPanel = ({
  subscriptionData,
  cartItems,
  total,
  canPay,
  isProcessing,
  error,
  handleSubmit,
  currency = "EUR",
}) => {
  const t = useTranslations("PaymentPanel")
  const format = useFormatter()

  let totalWithDiscount = total
  let newTotal = total
  let remise = 0

  if (subscriptionData) {
    if (subscriptionData.length > 0) {
      newTotal -= (newTotal * subscriptionData[0].plant_discount) / 100
      totalWithDiscount -=
        (totalWithDiscount * subscriptionData[0].plant_discount) / 100
      remise = (newTotal * subscriptionData[0].plant_discount) / 100
    }
  }

  newTotal *= 1.2

  return (
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
                {format.number(item.price * item.quantity, {
                  style: "currency",
                  currency,
                })}
              </span>
            </div>
          ))}
          {subscriptionData.length > 0 && (
            <div className="flex justify-between py-1 text-sm text-muted-foreground">
              <span>
                {t("discount", {
                  discount: subscriptionData[0].plant_discount,
                })}
              </span>
              <span>
                {format.number(remise, { style: "currency", currency })}
              </span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between py-1">
            <span>{t("total")}</span>
            <span className="font-bold">
              {format.number(totalWithDiscount, {
                style: "currency",
                currency,
              })}
            </span>
          </div>
          <div className="flex justify-between py-1 text-sm text-muted-foreground">
            <span>{t("vatIncluded")}</span>
            <span>
              {format.number(totalWithDiscount * 0.2, {
                style: "currency",
                currency,
              })}
            </span>
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
              : `${t("payButton")} ${format.number(newTotal, { style: "currency", currency })}`}
          </Button>
        </CardFooter>
      </Card>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{t("errorTitle")}</AlertTitle>
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
}

export default PaymentPanel
