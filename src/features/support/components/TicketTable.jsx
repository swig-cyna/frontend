"use client"

import { ChevronDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import React, { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFormatter } from "next-intl"
import { getStatusVariant, getSubjectVariant } from "../utils/functions"
import { DeleteTicketDialog } from "./DeleteTicketDialog"
import { EditTicketDialog } from "./EditTicketDialog"

export function TicketTable({ tickets, refreshTickets }) {
  const [ticketToEdit, setTicketToEdit] = useState(null)
  const [ticketToDelete, setTicketToDelete] = useState(null)
  const [openRows, setOpenRows] = useState([])
  const format = useFormatter()

  const toggleRow = (ticketId) => {
    setOpenRows((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId],
    )
  }

  return (
    <>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-24">Last updated</TableHead>
              <TableHead className="w-24">Assigned</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-16">Actions</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((ticket) => (
              <React.Fragment key={ticket.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(ticket.id)}
                >
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Badge className={getSubjectVariant(ticket.theme)}>
                      {ticket.theme.charAt(0).toUpperCase() +
                        ticket.theme.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format.dateTime(new Date(ticket.updated_at), {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="break-all">
                    {ticket.assigned_to ? ticket.assigned_to_name : "Nobody"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusVariant(ticket.status)}>
                      {ticket.status === "open" && "Ouvert"}
                      {ticket.status === "in_progress" && "En cours"}
                      {ticket.status === "closed" && "Fermé"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setTicketToEdit(ticket)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTicketToDelete(ticket)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <ChevronDown />
                  </TableCell>
                </TableRow>
                {openRows.includes(ticket.id) && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted p-4">
                      Details : {ticket.description}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      {ticketToEdit && (
        <EditTicketDialog
          ticket={ticketToEdit}
          open={Boolean(ticketToEdit)}
          onOpenChange={(open) => !open && setTicketToEdit(null)}
          onTicketUpdated={refreshTickets}
        />
      )}

      {ticketToDelete && (
        <DeleteTicketDialog
          ticket={ticketToDelete}
          open={Boolean(ticketToDelete)}
          onOpenChange={(open) => !open && setTicketToDelete(null)}
          onTicketRemoved={refreshTickets}
        />
      )}
    </>
  )
}
