import ky from "ky"

export const apiClient = ky.extend({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_API,
})
