"use client"

import {
  Edit,
  ImagePlus,
  LucideLoader2,
  MoreHorizontal,
  Package,
  Plus,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useProducts } from "../hook/useProducts"
import { getProductImageUrl } from "../utils/image"
import { DeleteProductDialog } from "./DeleteProductDialog"

export function ProductList() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const { data: products, isLoading } = useProducts({
    page: currentPage,
    limit: 10,
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleCreateProduct = () => {
    router.push("/admin/products/new")
  }

  const handleEditProduct = (id) => () => {
    router.push(`/admin/products/edit/${id}`)
  }

  const handleDeleteProduct = (product) => () => {
    setProductToDelete(product)
    setIsDeleting(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LucideLoader2 className="animate-spin" />
      </div>
    )
  }

  if (products.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12">
        <Package className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="mb-4 text-center text-muted-foreground">
          No products found. Add products to your store.
        </p>

        <Button onClick={handleCreateProduct}>
          <Plus className="mr-1 h-4 w-4" />
          Add product
        </Button>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.images.length > 0 ? (
                  <Image
                    src={getProductImageUrl(product.images[0])}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-sm object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-muted">
                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
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
          {products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-muted-foreground"
              >
                <Package className="mx-auto mb-2 h-8 w-8" />
                <p>Aucun produit trouvé</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {products.pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()

                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1)
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: products.pagination.totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()

                    if (currentPage < products.pagination.totalPages) {
                      handlePageChange(currentPage + 1)
                    }
                  }}
                  className={
                    currentPage === products.pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {productToDelete && (
        <DeleteProductDialog
          product={productToDelete}
          open={isDeleting}
          onOpenChange={(open) => !open && setProductToDelete(null)}
        />
      )}
    </>
  )
}
