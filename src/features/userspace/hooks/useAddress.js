import { apiClient } from "@/utils/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAddresses = (userId) =>
  useQuery({
    queryKey: ["addresses"],
    queryFn: () => apiClient.get(`addresses`).json(),
    enabled: Boolean(userId),
  })

export const useCreateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiClient.post("addresses", { json: data }).json(),
    onSuccess: () => queryClient.invalidateQueries(["addresses"]),
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }) =>
      apiClient.put(`addresses/${id}`, { json: data }).json(),
    onSuccess: () => queryClient.invalidateQueries(["addresses"]),
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => apiClient.delete(`addresses/${id}`).json(),
    onSuccess: () => queryClient.invalidateQueries(["addresses"]),
  })
}
