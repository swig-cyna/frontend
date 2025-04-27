import { apiClient } from "@/utils/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useSubscription = (userId) =>
  useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => apiClient.get(`subscriptions/${userId}`).json(),
    enabled: Boolean(userId),
  })

export const useAddSubsciption = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`subscriptions/`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (subscriptionId) =>
      apiClient.delete(`subscriptions/${subscriptionId}/cancel`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
