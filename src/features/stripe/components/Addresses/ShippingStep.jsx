import { Checkbox } from "@/components/ui/checkbox"
import AddressStripeForm from "@/features/userspace/components/address/AddressStripeForm"
import { stripeOptions } from "@/features/userspace/utils/stripeAddressOptions"
import { Elements } from "@stripe/react-stripe-js"
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
}) => (
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
        Utiliser la même adresse pour la facturation
      </label>
    </div>
    {addingShipping ? (
      <Elements stripe={stripePromise} options={stripeOptions}>
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

export default ShippingStep
