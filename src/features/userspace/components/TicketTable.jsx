"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFormatter } from "next-intl"

export function TicketTable({ tickets }) {
  const format = useFormatter()

  if (tickets?.length === 0) {
    return <div>Loading...</div>
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "open":
        return "bg-green-800/50 hover:bg-green-800/50  text-green-700"

      case "in_progress":
        return "bg-yellow-800/50 hover:bg-yellow-800/50 text-yellow-700"

      case "closed":
        return "bg-red-800/50 hover:bg-red-800/50 text-red-700"

      default:
        return "bg-gray-800/50 hover:bg-gray-800/50 text-gray-700"
    }
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sujet</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets?.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.title}</TableCell>
              <TableCell>
                {format.dateTime(new Date(ticket.created_at), {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <Badge
                  className={`${getStatusVariant(ticket.status)} min-w-[75px] justify-center whitespace-nowrap`}
                >
                  {ticket.status === "open" && "Ouvert"}
                  {ticket.status === "in_progress" && "En cours"}
                  {ticket.status === "closed" && "Fermé"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
