"use client"

import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { TicketTable } from "@/features/support/components/TicketTable"
import { TicketService } from "@/features/support/utils/apiTicketService"
import { adminTicketColumns } from "@/features/support/utils/ticketTableColumns"
import { useFormatter } from "next-intl"
import { useEffect, useState } from "react"

const Page = () => {
  const [tickets, setTickets] = useState([])
  const format = useFormatter()

  const refreshTickets = async () => {
    try {
      const data = await TicketService.fetchTickets("backoffice")
      setTickets(data)
    } catch (error) {
      console.error("Erreur de chargement des tickets :", error.message)
    }
  }

  useEffect(() => {
    refreshTickets()
  }, [])

  return (
    <>
      <DashboardHeader
        heading="Ticket Management"
        text="Add, edit, or delete tickets"
      />
      <div className="p-6">
        <TicketTable
          tickets={tickets}
          refreshTickets={refreshTickets}
          columns={adminTicketColumns(format)}
          actions
        />
      </div>
    </>
  )
}

export default Page
