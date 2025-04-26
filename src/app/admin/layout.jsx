"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AdminSidebar from "@/features/admin/components/AdminSidebar"
import { useState } from "react"

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AdminSidebar />
      <div className="mx-2 flex flex-1 flex-col">
        <div className="sticky top-2 mt-2 flex h-9 items-center">
          <SidebarTrigger />
        </div>
        <div className="mx-auto w-full">{children}</div>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
