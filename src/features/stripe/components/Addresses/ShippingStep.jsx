import { Checkbox } from "@/components/ui/checkbox"
import AddressStripeForm from "@/features/userspace/components/address/AddressStripeForm"
import {
  stripeOptions,
  stripeOptionsWhite,
} from "@/features/userspace/utils/stripeAddressOptions"
import { Elements } from "@stripe/react-stripe-js"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import SavedAddresses from "./SavedAddress"

const ShippingStep = ({
  useSameAddress,
  setUseSameAddress,
  addingShipping,
  setAddingShipping,
  userId,
  shippingAddress,
  setShippingAddress,
  stripePromise,
}) => {
  const { theme } = useTheme()
  const t = useTranslations("ShippingStep")

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="use-same-address"
          checked={useSameAddress}
          onCheckedChange={setUseSameAddress}
        />
        <label
          htmlFor="use-same-address"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("use_same_address")}
        </label>
      </div>
      {addingShipping ? (
        <Elements
          stripe={stripePromise}
          options={theme === "dark" ? stripeOptions : stripeOptionsWhite}
        >
          <AddressStripeForm
            mode="add"
            onSuccess={(address) => {
              setShippingAddress(address)
              setAddingShipping(false)
            }}
          />
        </Elements>
      ) : (
        <SavedAddresses
          userId={userId}
          selectedAddress={shippingAddress}
          onSelect={setShippingAddress}
          onAddNew={() => setAddingShipping(true)}
        />
      )}
    </div>
  )
}

export default ShippingStep
