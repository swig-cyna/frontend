"use client"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { ProductList } from "@/features/products/components/ProductsList"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function CarouselPage() {
  return (
    <>
      <DashboardHeader
        heading="Products Management"
        text="Manage your products here and add new ones."
      >
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </Link>
      </DashboardHeader>
      <div className="p-6">
        <ProductList />
      </div>
    </>
  )
}
