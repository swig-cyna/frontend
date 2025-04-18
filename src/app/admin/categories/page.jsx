"use client"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { AddCategoryDialog } from "@/features/categories/components/AddCategoryDialog"
import { CategoriesList } from "@/features/categories/components/CategoriesList"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

const Categories = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  const handleCreateCategory = () => {
    setIsAddCategoryOpen(true)
  }

  return (
    <>
      <DashboardHeader
        heading="Categories Management"
        text="Manage your categories here and add new ones."
      >
        <Button onClick={handleCreateCategory}>
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Category
        </Button>
      </DashboardHeader>
      <div className="p-6">
        <CategoriesList />
      </div>

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onAddSlide={(open) => !open && setIsAddCategoryOpen(null)}
      />
    </>
  )
}

export default Categories
