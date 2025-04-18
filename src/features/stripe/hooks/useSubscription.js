import { apiClient } from "@/utils/fetch"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useSubsciption = (userId) =>
  useQuery({
    queryKey: ["paymentMethode"],
    queryFn: () => apiClient.get(`subscriptions/${userId}`).json(),
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
