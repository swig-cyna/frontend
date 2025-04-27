"use client"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAllOrders } from "@/features/stripe/hooks/useOrder"

const formatAddress = (address) => {
  if (!address) return "Non renseignée"
  return `${address.line1}, ${address.postal_code} ${address.city}, ${address.country}`
}

const paymentStatusColors = {
  succeeded: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
  partially_refunded: "bg-purple-100 text-purple-800",
}

export function OrderTable() {
  const { data: orders = [], isLoading, error } = useAllOrders()

  if (isLoading) return <LoadingSkeleton />
  if (error) return <div>Erreur lors du chargement des commandes</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Livraison</TableHead>
          <TableHead>Facturation</TableHead>
          <TableHead>Produits</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Statut paiement</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{formatAddress(order.shipping_address)}</TableCell>
            <TableCell>{formatAddress(order.billing_address)}</TableCell>
            <TableCell>
              {order.orderItem.map((item) => (
                <div key={item.product.name}>
                  {item.product.name} (x{item.quantity})
                </div>
              ))}
            </TableCell>
            <TableCell>{order.amount.toFixed(2)} €</TableCell>
            <TableCell>
              <Badge className={paymentStatusColors[order.paymentStatus]}>
                {order.paymentStatus}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
)
