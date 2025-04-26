"use client"

import { TableSkeleton } from "@/components/TableSkeleton"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TicketTable } from "@/features/support/components/TicketTable"
import { userTicketColumns } from "@/features/support/utils/ticketTableColumns"
import { useTickets } from "@/features/support/utils/useTickets"
import ContactForm from "@/features/userspace/components/ContactForm"
import { toast } from "@/hooks/useToast"
import { useFormatter, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const INITIAL_VISIBLE_TICKETS = 3

const ContactPage = () => {
  const t = useTranslations("UserTickets")
  const format = useFormatter()
  const { tickets, loading, error, refresh } = useTickets("userspace")
  const [visibleTickets, setVisibleTickets] = useState(INITIAL_VISIBLE_TICKETS)

  const loadMoreTickets = () => {
    setVisibleTickets((prev) => prev + INITIAL_VISIBLE_TICKETS)
  }

  useEffect(() => {
    if (error) {
      toast({
        title: t("error"),
        description: error,
        variant: "destructive",
      })
    }
  }, [error, t])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t("myTickets")}</CardTitle>
          <CardDescription>{t("myTicketsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <TableSkeleton columns={userTicketColumns(format, t)} rows={3} />
          ) : (
            <TicketTable
              tickets={tickets.slice(0, visibleTickets)}
              refreshTickets={refresh}
              columns={userTicketColumns(format, t)}
            />
          )}
          {visibleTickets < tickets.length && (
            <div className="mt-4 flex">
              <Button onClick={loadMoreTickets} className="ml-auto px-3 py-1">
                {t("seeMoreTickets")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ContactForm onSend={refresh} />
    </div>
  )
}

export default ContactPage
