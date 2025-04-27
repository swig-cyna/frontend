"use client"

import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { SubscriptionEdit } from "@/features/subscriptions/components/SubscriptionEdit"
import {
  usePlant,
  useUpdatePlant,
} from "@/features/subscriptions/hooks/usePlants"
import { toast } from "@/hooks/useToast"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function EditSubscriptions() {
  const router = useRouter()
  const params = useParams()

  const { data: product, isLoading: isProductLoading } = usePlant(params.id)
  const { mutateAsync: createProduct, isPending: isUpdating } = useUpdatePlant(
    params.id,
  )

  const handleCreateProduct = async (data) => {
    await createProduct(data)
    toast({
      title: "Product updated",
      description: "Your product has been updated successfully.",
    })

    router.push("/admin/subscriptions")
  }

  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <DashboardHeader heading="Edit Product"></DashboardHeader>
      <Card className="mt-4 p-6">
        <SubscriptionEdit
          plant={product}
          onSave={handleCreateProduct}
          isLoading={isUpdating}
        />
      </Card>
    </>
  )
}
