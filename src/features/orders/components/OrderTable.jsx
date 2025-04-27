"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useAllOrders,
  useUpdateBillingAddress,
  useUpdateShippingAddress,
} from "@/features/stripe/hooks/useOrder"
import AddressStripeForm from "@/features/userspace/components/address/AddressStripeForm"
import { stripeOptions } from "@/features/userspace/utils/stripeAddressOptions"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { MoreHorizontal, Pencil } from "lucide-react"
import { useState } from "react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_KEY_STRIPE)

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
  const updateShippingAddress = useUpdateShippingAddress()
  const updateBillingAddress = useUpdateBillingAddress()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [addressTypeToEdit, setAddressTypeToEdit] = useState(null)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [currentAddress, setCurrentAddress] = useState(null)

  const handleEditClick = (order, address, type) => {
    setCurrentOrder(order)
    setCurrentAddress(address)
    setAddressTypeToEdit(type)
    setIsDialogOpen(true)
  }

  const handleSubmitSuccess = async (updatedAddress) => {
    try {
      const mutationParams = {
        id: currentOrder.id.toString(),
        address: updatedAddress,
      }

      if (addressTypeToEdit === "shipping") {
        await updateShippingAddress.mutateAsync(mutationParams)
      } else {
        await updateBillingAddress.mutateAsync(mutationParams)
      }
    } catch (error) {
      console.error("Mutation error:", error)
      throw error
    } finally {
      setIsDialogOpen(false)
      setCurrentOrder(null)
      setCurrentAddress(null)
      setAddressTypeToEdit(null)
    }
  }

  if (isLoading) return <LoadingSkeleton />
  if (error) return <div>Erreur lors du chargement des commandes</div>

  return (
    <>
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
            <TableHead className="w-[80px]">Actions</TableHead>
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
                      onClick={() =>
                        handleEditClick(
                          order,
                          order.shipping_address,
                          "shipping",
                        )
                      }
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier adresse livraison
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleEditClick(order, order.billing_address, "billing")
                      }
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier adresse facturation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addressTypeToEdit === "shipping"
                ? "Modifier l'adresse de livraison"
                : "Modifier l'adresse de facturation"}
            </DialogTitle>
          </DialogHeader>
          <Elements stripe={stripePromise} options={stripeOptions}>
            <AddressStripeForm
              mode="order"
              address={currentAddress}
              onSuccess={handleSubmitSuccess}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    </>
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
