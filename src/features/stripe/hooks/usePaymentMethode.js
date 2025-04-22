import { apiClient } from "@/utils/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usePaymentMethod = (userId) =>
  useQuery({
    retry: false,
    queryKey: ["paymentMethode"],
    queryFn: () => apiClient.get(`payment-methods/${userId}`).json(),
  })

export const useAttachPaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`payment-methods/attach-payment-method`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachPaymentMethod"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
