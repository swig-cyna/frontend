import { apiClient } from "@/utils/fetch"

export const TicketService = {
  fetchTickets: async (context) => {
    try {
      const response = await apiClient.get(`tickets?context=${context}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
      throw error
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await apiClient.post("tickets", {
        json: ticketData,
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create ticket")
      }

      return await response.json()
    } catch (error) {
      console.error("Ticket creation failed:", error)
      throw error
    }
  },

  updateTicket: async (ticketId, updateData) => {
    try {
      const response = await apiClient.patch(`tickets/${ticketId}`, {
        json: updateData,
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update ticket")
      }

      return await response.json()
    } catch (error) {
      console.error("Ticket update failed:", error)
      throw error
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const response = await apiClient.delete(`tickets/${ticketId}`, {
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete ticket")
      }

      return true
    } catch (error) {
      console.error("Ticket deletion failed:", error)
      throw error
    }
  },

  fetchSupportUsers: async () => {
    try {
      const response = await apiClient.get(
        "admin/users?role=support,admin,superadmin",
        { credentials: "include" },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return data.users.map((user) => ({
        label: user.name,
        value: user.id,
      }))
    } catch (error) {
      console.error("Failed to fetch support users:", error)
      throw error
    }
  },
}
