import { apiClient } from "@/utils/fetch"
import { useQuery } from "@tanstack/react-query"

export const useProducts = ({ page = 1, limit = 10 }) =>
  useQuery({
    queryKey: ["products", page, limit],
    queryFn: () =>
      apiClient
        .get(`products`, {
          searchParams: {
            page,
            limit,
          },
        })
        .json(),
  })
