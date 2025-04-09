import { apiClient } from "@/utils/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createErrorHandler } from "next/dist/server/app-render/create-error-handler"

export const useProducts = ({ page = 1, limit = 10 }) =>
  useQuery({
    queryKey: ["products", page, limit],
    queryFn: () =>
      apiClient
        .get(`products`, {
          searchParams: {
            page,
            limit,
          },
        })
        .json(),
  })

export const useUploadImageProduct = () =>
  useMutation({
    mutationFn: (data) => {
      const formData = new FormData()
      formData.append("image", data)

      return apiClient
        .post(`products/image`, {
          body: formData,
        })
        .json()
    },
    onError: createErrorHandler,
  })

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`products`, {
          json: data,
        })
        .json(),
    onError: createErrorHandler,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"])
    },
  })
}

export const useProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => apiClient.get(`products/${id}`).json(),
  })

export const useUpdateProduct = (productId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .put(`products/${productId}`, {
          json: data,
        })
        .json(),
    onError: createErrorHandler,
    onSuccess: () => {
      queryClient.invalidateQueries(["product", productId])
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId) => apiClient.delete(`products/${productId}`).json(),
    onError: createErrorHandler,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"])
    },
  })
}
