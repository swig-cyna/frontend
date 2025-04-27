import { apiClient } from "@/utils/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

const updateAddressFactory = (type) => {
  const endpoint = type === "shipping" ? "shipping-address" : "billing-address"

  return () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: ({ id, address }) =>
        apiClient.patch(`orders/${id}/${endpoint}`, { json: address }).json(),
      onSuccess: (updatedOrder) => {
        queryClient.setQueryData(["orders"], (old) =>
          old.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order,
          ),
        )
      },
    })
  }
}

export const useUpdateShippingAddress = updateAddressFactory("shipping")
export const useUpdateBillingAddress = updateAddressFactory("billing")
