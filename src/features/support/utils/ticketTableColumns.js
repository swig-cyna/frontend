import { Badge } from "@/components/ui/badge"
import {
  getStatusVariant,
  getSubjectVariant,
} from "@/features/support/utils/functions"

export const userTicketColumns = (format, t) => [
  {
    key: "title",
    label: t("subject"),
    render: (ticket) => ticket.title,
  },
  {
    key: "created_at",
    label: t("creationDate"),
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
    label: t("status"),
    render: (ticket) => (
      <Badge className={getStatusVariant(ticket.status)}>
        {ticket.status === "open" && t("ticketStatusOpen")}
        {ticket.status === "in_progress" && t("ticketStatusInProgress")}
        {ticket.status === "closed" && t("ticketStatusClose")}
      </Badge>
    ),
  },
]

export const adminTicketColumns = (format) => [
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
    render: (ticket) =>
      ticket.assigned_to ? ticket.assigned_to_name : "Nobody",
  },
  {
    key: "status",
    label: "Status",
    render: (ticket) => (
      <Badge className={getStatusVariant(ticket.status)}>
        {ticket.status === "open" && "Ouvert"}
        {ticket.status === "in_progress" && "En cours"}
        {ticket.status === "closed" && "Fermé"}
      </Badge>
    ),
  },
]
