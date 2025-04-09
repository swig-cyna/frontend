import { apiClient } from "@/utils/fetch"

export const sendSupportEmail = async ({
  name,
  email,
  subject,
  theme,
  message,
}) => {
  try {
    const response = await apiClient.post("tickets", {
      json: {
        user_name: name,
        user_email: email,
        title: subject,
        theme,
        description: message,
        status: "open",
      },
      credentials: "include",
    })

    console.log(response)

    if (!response.ok) {
      throw new Error("Erreur lors de la création du ticket")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur dans sendSupportEmail :", error)
    throw error
  }
}
