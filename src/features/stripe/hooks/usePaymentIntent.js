import { apiClient } from "@/utils/fetch"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const usePaymentIntent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`payments/create-intent`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["create-intent"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const usePaymentConfirm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`payments/confirm`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentConfirm"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
