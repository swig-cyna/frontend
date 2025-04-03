import { apiClient } from "@/utils/fetch"
import { createErrorHandler } from "@/utils/query"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddSlide = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .post(`carousel`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useReorderSlides = () =>
  useMutation({
    mutationFn: (data) =>
      apiClient
        .put(`carousel/${data.slideId}/position`, {
          json: {
            position: data.position,
          },
        })
        .json(),
    onError: (err) => {
      console.error(err)
    },
  })

export const useUploadImageSlide = () =>
  useMutation({
    mutationFn: (data) => {
      const formData = new FormData()
      formData.append("image", data)

      return apiClient
        .post(`carousel/image`, {
          body: formData,
        })
        .json()
    },
    onError: createErrorHandler,
  })

export const useEditSlide = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      apiClient
        .put(`carousel/${data.id}`, {
          json: data,
        })
        .json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] })
    },
  })
}

export const useDeleteSlide = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slideId) => apiClient.delete(`carousel/${slideId}`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
