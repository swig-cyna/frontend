"use client"

import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { TicketTable } from "@/features/support/components/TicketTable"
import { TicketService } from "@/features/support/utils/apiTicketService"
import {
  getStatusVariant,
  getSubjectVariant,
} from "@/features/support/utils/functions"
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

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (ticket) => ticket.title,
    },
    {
      key: "theme",
      label: "Subject",
      render: (ticket) => (
        <Badge className={getSubjectVariant(ticket.theme)}>
          {ticket.theme.charAt(0).toUpperCase() + ticket.theme.slice(1)}
        </Badge>
      ),
    },
    {
      key: "updated_at",
      label: "Last updated",
      className: "w-24",
      render: (ticket) =>
        format.dateTime(new Date(ticket.updated_at), {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "assigned_to",
      label: "Assigned",
      className: "w-24",
      render: (ticket) =>
        ticket.assigned_to ? ticket.assigned_to_name : "Nobody",
    },
    {
      key: "status",
      label: "Status",
      className: "w-24",
      render: (ticket) => (
        <Badge className={getStatusVariant(ticket.status)}>
          {ticket.status === "open" && "Ouvert"}
          {ticket.status === "in_progress" && "En cours"}
          {ticket.status === "closed" && "Fermé"}
        </Badge>
      ),
    },
  ]

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
          columns={columns}
          actions
        />
      </div>
    </>
  )
}

export default Page
