"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { authClient } from "@/features/auth/utils/authClient"
import { AddUserDialog } from "@/features/users/components/AddUserDialog"
import { UserTable } from "@/features/users/components/UserTable"
import { useEffect, useState } from "react"

const Page = () => {
  const [users, setUsers] = useState([])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      setUsers(data.users)
    } catch (error) {
      console.error("Erreur de chargement des utilisateurs :", error.message)
    } finally {
      setLoading(false)
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
        <UserTable
          users={users}
          refreshUsers={refreshUsers}
          loading={loading}
        />
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
