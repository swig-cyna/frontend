export function parseApiError(error) {
  if (error?.name === "TypeError" && error.message === "Failed to fetch") {
    return "Erreur réseau. Vérifiez votre connexion internet."
  }

  if (error?.response) {
    if (error.response.status === 401) {
      return "Vous devez être connecté pour effectuer cette action."
    }

    if (error.response.status === 403) {
      return "Vous n'avez pas la permission d'effectuer cette action."
    }

    if (error.response.data?.error) {
      return error.response.data.error
    }

    if (error.response.data?.message) {
      return error.response.data.message
    }

    return "Erreur serveur inconnue."
  }

  if (error?.error) {
    return error.error
  }

  if (error?.message) {
    return error.message
  }

  return "Une erreur inconnue est survenue."
}
