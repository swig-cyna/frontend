import { useCallback, useEffect, useState } from "react"
import { TicketService } from "./apiTicketService"

export function useTickets(context) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await TicketService.fetchTickets(context)
      setTickets(data)
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des tickets")
    } finally {
      setLoading(false)
    }
  }, [context])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { tickets, loading, error, refresh }
}
