import { apiClient } from "@/utils/fetch"
import { useMutation } from "@tanstack/react-query"

export const useAddSlide = ({ refetch }) =>
  useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`carousel`, {
          json: data,
        })
        .json(),
    onError: (err) => {
      console.error(err)
    },
    onSuccess: () => {
      refetch()
    },
  })
