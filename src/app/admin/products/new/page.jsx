"use client"

import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { ProductEdit } from "@/features/products/components/ProductEdit"
import { useCreateProduct } from "@/features/products/hook/useProducts"
import { toast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"

export default function CreateProduct() {
  const router = useRouter()
  const { mutateAsync: createProduct, isPending } = useCreateProduct()

  const handleCreateProduct = async (data) => {
    await createProduct(data)
    toast({
      title: "Product created",
      description: "Your product has been created successfully.",
    })

    router.push("/admin/products")
  }

  return (
    <>
      <DashboardHeader heading="Create a new product"></DashboardHeader>
      <Card className="mt-4 p-6">
        <ProductEdit onSave={handleCreateProduct} isLoading={isPending} />
      </Card>
    </>
  )
}
