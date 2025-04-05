import { toast } from "@/hooks/useToast"
import { HTTPError } from "ky"

export const handleQueryError = async (error) => {
  if (error instanceof HTTPError) {
    try {
      const errorData = await error.response.json()

      return errorData.error || "Something went wrong"
    } catch (errorThrow) {
      console.error("Error parsing error response:", errorThrow)

      return "Something went wrong"
    }
  }

  console.error("Client error:", error)

  return error.message || "Something went wrong"
}

export const createErrorHandler = async (error) => {
  console.error("Query error:", error)
  const message = await handleQueryError(error)
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  })
}
