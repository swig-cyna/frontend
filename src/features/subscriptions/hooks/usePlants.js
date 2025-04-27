import { apiClient } from "@/utils/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usePlants = () =>
  useQuery({
    queryKey: ["plants"],
    queryFn: () => apiClient.get(`plants/`).json(),
  })

export const usePlant = (id) =>
  useQuery({
    queryKey: ["plants", id],
    queryFn: () => apiClient.get(`plants/${id}`).json(),
  })

export const useAddPlant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`plants/`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useUpdatePlant = (id) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .put(`plants/${id}`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] })
    },
  })
}

export const useDeletePlant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (plantId) => apiClient.delete(`plants/${plantId}`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
