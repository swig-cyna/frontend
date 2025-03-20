"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AdminSidebar from "@/features/admin/components/AdminSidebar"
import { useState } from "react"

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AdminSidebar />
      <div className="flex flex-col flex-1 mx-2">
        <div className="h-9 mt-2 flex items-center">
          <SidebarTrigger />
        </div>
        {children}
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
