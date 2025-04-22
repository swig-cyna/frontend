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

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .put(`payment-methods`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethode"] })
    },
  })
}

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentMethodId) =>
      apiClient.delete(`payment-methods/${paymentMethodId}`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethode"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
