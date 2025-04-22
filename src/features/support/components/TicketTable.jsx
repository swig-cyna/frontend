"use client"

import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import React, { useCallback, useState } from "react"

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
import { DeleteTicketDialog } from "./DeleteTicketDialog"
import { EditTicketDialog } from "./EditTicketDialog"

export function TicketTable({ tickets, refreshTickets, columns, actions }) {
  const [ticketToEdit, setTicketToEdit] = useState(null)
  const [ticketToDelete, setTicketToDelete] = useState(null)
  const [openRows, setOpenRows] = useState([])

  const toggleRow = useCallback((ticketId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(ticketId)
        ? prevOpenRows.filter((id) => id !== ticketId)
        : [...prevOpenRows, ticketId],
    )
  }, [])

  const actionsMenu = (ticket) => (
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
  )

  if (!tickets || tickets.length === 0) {
    return <div>Aucun ticket à afficher</div>
  }

  return (
    <>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((ticket) => (
              <React.Fragment key={ticket.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(ticket.id)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(ticket) : ticket[col.key]}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actionsMenu(ticket)}</TableCell>}
                  <TableCell>
                    {openRows.includes(ticket.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </TableCell>
                </TableRow>
                {openRows.includes(ticket.id) && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (actions ? 1 : 0) + 1}
                      className="bg-muted p-4"
                    >
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
