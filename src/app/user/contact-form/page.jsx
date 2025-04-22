"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TicketTable } from "@/features/support/components/TicketTable"
import { getStatusVariant } from "@/features/support/utils/functions"
import ContactForm from "@/features/userspace/components/ContactForm"
import { apiClient } from "@/utils/fetch"
import { useFormatter } from "next-intl"
import { useEffect, useState } from "react"

const ContactPage = () => {
  const [tickets, setTickets] = useState([])
  const [visibleTickets, setVisibleTickets] = useState(3)
  const [loading, setLoading] = useState(true)
  const format = useFormatter()

  const refreshTickets = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("tickets?context=userspace", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Échec du chargement des tickets")
      }

      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Erreur de chargement des tickets :", error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreTickets = () => {
    setVisibleTickets((prev) => prev + 3)
  }

  useEffect(() => {
    refreshTickets()
  }, [])

  const columns = [
    {
      key: "title",
      label: "Sujet",
      render: (ticket) => <span className="font-medium">{ticket.title}</span>,
    },
    {
      key: "created_at",
      label: "Date de création",
      render: (ticket) =>
        format.dateTime(new Date(ticket.created_at), {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (ticket) => (
        <Badge
          className={`${getStatusVariant(ticket.status)} min-w-[75px] justify-center whitespace-nowrap`}
        >
          {ticket.status === "open" && "Ouvert"}
          {ticket.status === "in_progress" && "En cours"}
          {ticket.status === "closed" && "Fermé"}
        </Badge>
      ),
    },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Mes tickets</CardTitle>
          <CardDescription>
            Retrouvez ici l’ensemble de vos tickets, leur date de création ainsi
            que leur statut actuel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TicketTable
            tickets={tickets.slice(0, visibleTickets)}
            refreshTickets={refreshTickets}
            columns={columns}
          />
          {visibleTickets < tickets.length && (
            <div className="mt-4 flex">
              <Button onClick={loadMoreTickets} className="ml-auto px-3 py-1">
                Voir plus de tickets
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ContactForm onSend={refreshTickets} />
    </div>
  )
}

export default ContactPage
