import { apiClient } from "@/utils/fetch"
import { createErrorHandler } from "@/utils/query"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiClient.get(`categories`, { searchParams: { limit: 1000 } }).json(),
  })

export const useAddCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`categories`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: createErrorHandler,
  })
}

export const useUpdateCategory = (id) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .put(`categories/${id}`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: createErrorHandler,
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => apiClient.delete(`categories/${id}`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: createErrorHandler,
  })
}
