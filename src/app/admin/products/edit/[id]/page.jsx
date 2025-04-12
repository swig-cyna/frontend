"use client"

import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { useCategories } from "@/features/categories/hooks/useCategory"
import { ProductEdit } from "@/features/products/components/ProductEdit"
import {
  useProduct,
  useUpdateProduct,
} from "@/features/products/hook/useProducts"
import { toast } from "@/hooks/useToast"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function CreateProduct() {
  const router = useRouter()
  const params = useParams()

  const { data: product, isLoading: isProductLoading } = useProduct(params.id)
  const { data: categories, isLoading: isCategoriesLoading } = useCategories()
  const { mutateAsync: createProduct, isPending: isUpdating } =
    useUpdateProduct(params.id)

  const handleCreateProduct = async (data) => {
    await createProduct(data)
    toast({
      title: "Product updated",
      description: "Your product has been updated successfully.",
    })

    router.push("/admin/products")
  }

  if (isProductLoading || isCategoriesLoading) {
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
        <ProductEdit
          product={product}
          categories={categories.data}
          onSave={handleCreateProduct}
          isLoading={isUpdating}
        />
      </Card>
    </>
  )
}
