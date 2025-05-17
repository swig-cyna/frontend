import AddressStripeForm from "@/features/userspace/components/address/AddressStripeForm"
import {
  stripeOptions,
  stripeOptionsWhite,
} from "@/features/userspace/utils/stripeAddressOptions"
import { Elements } from "@stripe/react-stripe-js"
import { useTheme } from "next-themes"
import SavedAddresses from "./SavedAddress"

const BillingStep = ({
  useSameAddress,
  addingBilling,
  setAddingBilling,
  setBillingAddress,
  userId,
  billingAddress,
  stripePromise,
}) => {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      {!useSameAddress &&
        (addingBilling ? (
          <Elements
            stripe={stripePromise}
            options={theme === "dark" ? stripeOptions : stripeOptionsWhite}
          >
            <AddressStripeForm
              mode="add"
              onSuccess={(address) => {
                setBillingAddress(address)
                setAddingBilling(false)
              }}
            />
          </Elements>
        ) : (
          <SavedAddresses
            userId={userId}
            selectedAddress={billingAddress}
            onSelect={setBillingAddress}
            onAddNew={() => setAddingBilling(true)}
          />
        ))}
    </div>
  )
}

export default BillingStep
