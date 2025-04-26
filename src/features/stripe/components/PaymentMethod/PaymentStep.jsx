import { Elements } from "@stripe/react-stripe-js"
import { useQueryClient } from "@tanstack/react-query"
import AddPaymentMethodForm from "./AddPaymentMethodForm"
import SavedPaymentMethods from "./SavedPaymentMethods"

const PaymentStep = ({
  addingPaymentMethod,
  setAddingPaymentMethod,
  userId,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  stripePromise,
}) => {
  const queryClient = useQueryClient()

  return addingPaymentMethod ? (
    <Elements stripe={stripePromise}>
      <AddPaymentMethodForm
        userId={userId}
        onSuccess={async (card) => {
          await queryClient.invalidateQueries({ queryKey: ["paymentMethode"] })
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
}

export default PaymentStep
