"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatusVariant } from "@/features/support/utils/functions"
import { Ticket } from "lucide-react"
import { useRecentTickets } from "../hooks/useDashboard"

export function RecentTickets() {
  const { data: recentTickets, isLoading } = useRecentTickets()

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="h-9 w-9 flex-shrink-0" />
            <div className="ml-4 flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3.5 w-32" />
            </div>
            <div className="ml-auto">
              <Skeleton className="h-3.5 w-12" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full space-y-8">
      {recentTickets.tickets.length === 0 && (
        <div className="mt-2 flex h-full flex-col items-center justify-center">
          <Ticket className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-center text-muted-foreground">
            No recent tickets
          </p>
        </div>
      )}

      {recentTickets.tickets.map((ticket) => (
        <div key={ticket.id} className="flex items-center">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={ticket.userImage} alt={`${ticket.userName}`} />
            <AvatarFallback>{ticket.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{ticket.title}</p>
            <p className="text-sm text-muted-foreground">{ticket.userName}</p>
          </div>
          <div className="ml-auto">
            <Badge className={getStatusVariant(ticket.status)}>
              {ticket.status === "open" && "Open"}
              {ticket.status === "in_progress" && "In progress"}
              {ticket.status === "closed" && "Closed"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
