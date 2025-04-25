import { apiClient } from "@/utils/fetch"
import { useQuery } from "@tanstack/react-query"

export const usePlants = () =>
  useQuery({
    queryKey: ["plants"],
    queryFn: () => apiClient.get(`plants/`).json(),
  })

export const usePlant = (userId) =>
  useQuery({
    queryKey: ["plants"],
    queryFn: () => apiClient.get(`plants/${userId}`).json(),
  })
