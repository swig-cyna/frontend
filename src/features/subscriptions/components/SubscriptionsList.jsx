"use client"

import {
  Edit,
  Loader2,
  LucideLoader2,
  MoreHorizontal,
  Package,
  Plus,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteSubscriptionDialog } from "@/features/subscriptions/components/DeleteSubscriptionDialog"
import { usePlants } from "@/features/subscriptions/hooks/usePlants"
import { useDebounce } from "@uidotdev/usehooks"
import { useRouter } from "next/navigation"

export function SubscriptionList() {
  const router = useRouter()
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [setCurrentPage] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data: products, isLoading, isFetching } = usePlants()

  console.log(products)

  const handleCreateSubscription = () => {
    router.push("/admin/subscriptions/new")
  }

  const handleEditProduct = (id) => () => {
    router.push(`/admin/subscriptions/edit/${id}`)
  }

  const handleChangeLimit = (value) => {
    setLimit(value)
    setCurrentPage(1)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleDeleteProduct = (product) => () => {
    setProductToDelete(product)
    setIsDeleting(true)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LucideLoader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Subscriptions</h2>

        <div className="flex items-center justify-end gap-2">
          {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
          <Input
            type="search"
            placeholder="Search..."
            className="w-40"
            onChange={handleSearch}
          />
          <Select value={limit} onValueChange={handleChangeLimit}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Select a limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={5}>5</SelectItem>
              <SelectItem value={10}>10</SelectItem>
              <SelectItem value={20}>20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subscription</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.id}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {product.price.toFixed(2)} €
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleEditProduct(product.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDeleteProduct(product)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products.length === 0 && (
        <div className="mt-2 flex flex-col items-center justify-center rounded-md border border-dashed p-12">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-center text-muted-foreground">
            No subscriptions found. Add subscriptions to your store.
          </p>

          <Button onClick={handleCreateSubscription}>
            <Plus className="mr-1 h-4 w-4" />
            Add subscription
          </Button>
        </div>
      )}

      {productToDelete && (
        <DeleteSubscriptionDialog
          product={productToDelete}
          open={isDeleting}
          onOpenChange={(open) => !open && setProductToDelete(null)}
        />
      )}
    </>
  )
}
