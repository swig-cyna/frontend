import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  plugins: [adminClient()],
})

export const {
  signIn,
  signUp,
  sendVerificationEmail,
  forgetPassword,
  signOut,
  useSession,
  updateUser,
  changeEmail,
} = authClient
