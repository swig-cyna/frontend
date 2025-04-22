"use client"

import {
  Edit,
  Loader2,
  LucideLoader2,
  MoreHorizontal,
  PlusCircle,
  Tag,
  Trash2,
} from "lucide-react"
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
import { useCategories } from "../hooks/useCategory"
import { AddCategoryDialog } from "./AddCategoryDialog"
import { DeleteCategoryDialog } from "./DeleteCategoryDialog"
import { EditCategoryDialog } from "./EditCategoryDialog"

export function CategoriesList() {
  const [limit, setLimit] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const {
    data: categories,
    isLoading,
    isFetching,
  } = useCategories({
    page: currentPage,
    limit,
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleCreateCategory = () => {
    setIsCreating(true)
  }

  const handleEditCategory = (category) => () => {
    setCategoryToEdit(category)
  }

  const handleChangeLimit = (value) => {
    setLimit(value)
    setCurrentPage(1)
  }

  const handleDeleteCategory = (category) => () => {
    setCategoryToDelete(category)
  }

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
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="flex items-center justify-end gap-2">
          {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
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
            <TableHead className="w-[80px]">Color</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.data.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div
                  className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
                  style={{ backgroundColor: category.color }}
                >
                  <div className="absolute h-full w-full bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div>{category.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {category.id}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div>{category?.count}</div>
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
                    <DropdownMenuItem onClick={handleEditCategory(category)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDeleteCategory(category)}
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

      {categories.pagination.totalPages > 1 && (
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
                { length: categories.pagination.totalPages },
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

                    if (currentPage < categories.pagination.totalPages) {
                      handlePageChange(currentPage + 1)
                    }
                  }}
                  className={
                    currentPage === categories.pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {categories.data.length === 0 && (
        <div className="mt-2 flex flex-col items-center justify-center rounded-md border border-dashed p-12">
          <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-center text-muted-foreground">
            No categories, you can create one.
          </p>

          <Button onClick={handleCreateCategory}>
            <PlusCircle className="mr-1 h-4 w-4" />
            Create category
          </Button>
        </div>
      )}

      <AddCategoryDialog
        open={isCreating}
        onOpenChange={(open) => !open && setIsCreating(false)}
      />

      {categoryToEdit && (
        <EditCategoryDialog
          category={categoryToEdit}
          open={Boolean(categoryToEdit)}
          onOpenChange={(open) => !open && setCategoryToEdit(null)}
        />
      )}

      {categoryToDelete && (
        <DeleteCategoryDialog
          category={categoryToDelete}
          open={Boolean(categoryToDelete)}
          onOpenChange={(open) => !open && setCategoryToDelete(null)}
        />
      )}
    </>
  )
}
