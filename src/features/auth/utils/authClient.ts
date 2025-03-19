import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
})

export const {
  signIn,
  signUp,
  sendVerificationEmail,
  forgetPassword,
  signOut,
  useSession,
} = authClient
