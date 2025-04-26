import { apiClient } from "@/utils/fetch"
import { useQuery } from "@tanstack/react-query"

export const useDashStatistics = () =>
  useQuery({
    queryKey: ["dashboard", "statistics"],
    queryFn: () => apiClient.get(`dashboard/statistics`).json(),
  })

export const useSalesOverview = () =>
  useQuery({
    queryKey: ["dashboard", "sales-overview"],
    queryFn: () => apiClient.get(`dashboard/sales-overview`).json(),
  })

export const useRecentOrders = () =>
  useQuery({
    queryKey: ["dashboard", "recent-orders"],
    queryFn: () => apiClient.get(`dashboard/recent-orders`).json(),
  })

export const useRecentTickets = () =>
  useQuery({
    queryKey: ["dashboard", "recent-tickets"],
    queryFn: () => apiClient.get(`dashboard/recent-tickets`).json(),
  })
