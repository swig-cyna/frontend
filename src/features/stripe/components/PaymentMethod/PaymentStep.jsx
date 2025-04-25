import { Elements } from "@stripe/react-stripe-js"
import AddPaymentMethodForm from "./AddPaymentMethodForm"
import SavedPaymentMethods from "./SavedPaymentMethods"

const PaymentStep = ({
  addingPaymentMethod,
  setAddingPaymentMethod,
  userId,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  stripePromise,
}) =>
  addingPaymentMethod ? (
    <Elements stripe={stripePromise}>
      <AddPaymentMethodForm
        userId={userId}
        onSuccess={(card) => {
          setSelectedPaymentMethod(card.id)
          setAddingPaymentMethod(false)
        }}
      />
    </Elements>
  ) : (
    <SavedPaymentMethods
      userId={userId}
      selectedMethod={selectedPaymentMethod}
      onSelect={setSelectedPaymentMethod}
      onAddNew={() => setAddingPaymentMethod(true)}
    />
  )

export default PaymentStep
