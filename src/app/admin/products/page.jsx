"use client"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { ProductList } from "@/features/products/components/ProductsList"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function Products() {
  return (
    <>
      <DashboardHeader
        heading="Products Management"
        text="Manage your products here and add new ones."
      >
        <Link href="/admin/products/new">
          <Button>
            <PlusCircle className="mr-1 h-4 w-4" />
            Add product
          </Button>
        </Link>
      </DashboardHeader>
      <div className="p-6">
        <ProductList />
      </div>
    </>
  )
}
