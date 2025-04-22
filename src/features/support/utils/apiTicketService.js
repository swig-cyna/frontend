import { apiClient } from "@/utils/fetch"
import { parseApiError } from "./parseApiError"

export const TicketService = {
  fetchTickets: async (context) => {
    try {
      const response = await apiClient.get(`tickets?context=${context}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw { response: { status: response.status, data: response.json() } }
      }

      return response.json()
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
      throw new Error(parseApiError(error))
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await apiClient.post("tickets", {
        json: ticketData,
        credentials: "include",
      })

      if (!response.ok) {
        throw { response: { status: response.status, data: response.json() } }
      }

      return await response.json()
    } catch (error) {
      console.error("Ticket creation failed:", error)
      throw new Error(parseApiError(error))
    }
  },

  updateTicket: async (ticketId, updateData) => {
    try {
      const response = await apiClient.patch(`tickets/${ticketId}`, {
        json: updateData,
        credentials: "include",
      })

      if (!response.ok) {
        throw { response: { status: response.status, data: response.json() } }
      }

      return await response.json()
    } catch (error) {
      console.error("Ticket update failed:", error)
      throw new Error(parseApiError(error))
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const response = await apiClient.delete(`tickets/${ticketId}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw { response: { status: response.status, data: response.json() } }
      }

      return true
    } catch (error) {
      console.error("Ticket deletion failed:", error)
      throw new Error(parseApiError(error))
    }
  },

  fetchSupportUsers: async () => {
    try {
      const response = await apiClient.get(
        "admin/users?role=support,admin,superadmin",
        { credentials: "include" },
      )

      if (!response.ok) {
        throw { response: { status: response.status, data: response.json() } }
      }

      const data = await response.json()

      return data.users.map((user) => ({
        label: user.name,
        value: user.id,
      }))
    } catch (error) {
      console.error("Failed to fetch support users:", error)
      throw new Error(parseApiError(error))
    }
  },
}
