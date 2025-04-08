import React, { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SavedPaymentMethods from "@/features/stripe/components/SavedPaymentMethods"
import AddPaymentMethodForm from "@/features/stripe/components/AddPaymentMethodForm"

const stripePromise = loadStripe(process.env.PUBLIC_KEY_STRIPE)

const SubscriptionForm = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("saved")

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Méthodes de paiement</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="saved">Méthodes sauvegardées</TabsTrigger>
          <TabsTrigger value="new">Ajouter une carte</TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          <SavedPaymentMethods
            userId={userId}
            onAddNew={() => setActiveTab("new")}
          />
        </TabsContent>

        <TabsContent value="new">
          <Elements stripe={stripePromise}>
            <AddPaymentMethodForm
              userId={userId}
              onSuccess={() => setActiveTab("saved")}
            />
          </Elements>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SubscriptionForm
