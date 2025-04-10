import { apiClient } from "@/utils/fetch"
import { useQuery } from "@tanstack/react-query"

export const useNewProducts = () =>
  useQuery({
    queryKey: ["new-products"],
    queryFn: () =>
      apiClient
        .get("products", {
          searchParams: {
            limit: 7,
          },
        })
        .json(),
  })
