"use client"

import { TableSkeleton } from "@/components/TableSkeleton"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { TicketTable } from "@/features/support/components/TicketTable"
import { adminTicketColumns } from "@/features/support/utils/ticketTableColumns"
import { useTickets } from "@/features/support/utils/useTickets"
import { toast } from "@/hooks/useToast"
import { useFormatter } from "next-intl"
import { useEffect } from "react"

const Page = () => {
  const format = useFormatter()
  const { tickets, loading, error, refresh } = useTickets("backoffice")

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <>
      <DashboardHeader
        heading="Ticket Management"
        text="Add, edit, or delete tickets"
      />
      <div className="p-6">
        {loading ? (
          <TableSkeleton columns={adminTicketColumns(format)} rows={5} />
        ) : (
          <TicketTable
            tickets={tickets}
            refreshTickets={refresh}
            columns={adminTicketColumns(format)}
            actions
          />
        )}
      </div>
    </>
  )
}

export default Page
