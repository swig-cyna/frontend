"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { AddUserDialog } from "@/features/users/components/AddUserDialog"
import { UserTable } from "@/features/users/components/UserTable"
import { useState } from "react"

const Page = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  return (
    <>
      <DashboardHeader
        heading="User Management"
        text="Add, edit, or delete users"
      >
        <Button onClick={() => setIsAddUserOpen(true)}>
          <PlusCircle className="mr-1 h-4 w-4" />
          Add User
        </Button>
      </DashboardHeader>
      <div className="p-6">
        <UserTable />
      </div>
      <AddUserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} />
    </>
  )
}

export default Page
