"use client"

import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { SubscriptionEdit } from "@/features/subscriptions/components/SubscriptionEdit"
import { useAddPlant } from "@/features/subscriptions/hooks/usePlants"
import { toast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"

export default function CreateSubscription() {
  const router = useRouter()
  const { mutateAsync: createPlant, isPending } = useAddPlant()

  const handleCreatePlant = async (data) => {
    await createPlant(data)
    toast({
      title: "Subscription created",
      description: "Your subscription has been created successfully.",
    })

    router.push("/admin/subscriptions")
  }

  return (
    <>
      <DashboardHeader heading="Create a new subscription"></DashboardHeader>
      <Card className="mt-4 p-6">
        <SubscriptionEdit onSave={handleCreatePlant} isLoading={isPending} />
      </Card>
    </>
  )
}
