"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TicketTable } from "@/features/support/components/TicketTable"
import { TicketService } from "@/features/support/utils/apiTicketService"
import { userTicketColumns } from "@/features/support/utils/ticketTableColumns"
import ContactForm from "@/features/userspace/components/ContactForm"
import { useFormatter } from "next-intl"
import { useEffect, useState } from "react"

const ContactPage = () => {
  const [tickets, setTickets] = useState([])
  const [visibleTickets, setVisibleTickets] = useState(3)
  const [loading, setLoading] = useState(true)
  const format = useFormatter()

  const refreshTickets = async () => {
    try {
      const data = await TicketService.fetchTickets("userspace")
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
            columns={userTicketColumns(format)}
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
