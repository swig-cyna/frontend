"use client"

import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { TicketTable } from "@/features/support/components/TicketTable"
import { apiClient } from "@/utils/fetch"
import { useEffect, useState } from "react"

const Page = () => {
  const [tickets, setTickets] = useState([])

  const refreshTickets = async () => {
    try {
      const response = await apiClient.get("tickets?context=backoffice", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Échec du chargement des tickets")
      }

      const data = await response.json()
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
        <TicketTable tickets={tickets} refreshTickets={refreshTickets} />
      </div>
    </>
  )
}

export default Page
