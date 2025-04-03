import { apiClient } from "@/utils/fetch"
import { useQuery } from "@tanstack/react-query"

export const useCarousel = () =>
  useQuery({
    queryKey: ["carousel"],
    queryFn: () => apiClient.get(`carousel`).json(),
  })
