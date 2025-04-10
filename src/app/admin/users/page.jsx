"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { AddUserDialog } from "@/features/users/components/AddUserDialog"
import { UserTable } from "@/features/users/components/UserTable"
import { useState, useEffect } from "react"
import { authClient } from "@/features/auth/utils/authClient"

const Page = () => {
  const [users, setUsers] = useState([])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const refreshUsers = async () => {
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      })
      if (error) throw new Error(error.message)
      setUsers(data.users)
    } catch (error) {
      console.error("Erreur de chargement des utilisateurs :", error.message)
    }
  }

  useEffect(() => {
    refreshUsers()
  }, [])

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
        <UserTable users={users} refreshUsers={refreshUsers} />
      </div>
      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onUserAdded={refreshUsers}
      />
    </>
  )
}

export default Page
