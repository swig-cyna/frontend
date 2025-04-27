import { apiClient } from "@/utils/fetch"
import { useQuery } from "@tanstack/react-query"

export const useAllOrders = () =>
  useQuery({
    retry: false,
    queryKey: ["orders"],
    queryFn: () => apiClient.get("orders").json(),
  })

export const useOrder = (userId) =>
  useQuery({
    retry: false,
    queryKey: ["order"],
    queryFn: () => apiClient.get(`orders/${userId}`).json(),
  })
