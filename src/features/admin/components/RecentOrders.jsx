"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingBag } from "lucide-react"
import { useRecentOrders } from "../hooks/useDashboard"

export function RecentOrders() {
  const { data: recentOrders, isLoading } = useRecentOrders()

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
      {recentOrders.length === 0 && (
        <div className="mt-2 flex h-full flex-col items-center justify-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-center text-muted-foreground">
            No recent orders
          </p>
        </div>
      )}

      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage
              src={order.userImage || "/placeholder.svg"}
              alt={`${order.userName}`}
            />
            <AvatarFallback>{order.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{order.userName}</p>
            <p className="text-sm text-muted-foreground">{order.email}</p>
          </div>
          <div className="ml-auto font-medium">€{order.amount.toFixed(2)}</div>
          <div className="ml-4">
            <Badge
              className="capitalize"
              variant={getStatusVariant(order.status)}
            >
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatusVariant(status) {
  switch (status) {
    case "completed":
      return "success"

    case "processing":
      return "default"

    case "failed":
      return "destructive"

    default:
      return "secondary"
  }
}
