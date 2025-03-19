"use client"
import { generateFormFieldInput } from "@/components/functions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { forgetPassword } from "@/features/auth/utils/authClient"
import { useState } from "react"
import { passwordResetSchema } from "../schemas/passwordForget"
import ResendEmailButton from "./ResendEmailButton"

const fields = [
  generateFormFieldInput({
    name: "email",
    placeholder: "Email",
    label: "Email",
    type: "email",
  }),
]

const PasswordForgetCard = () => {
  const [error, setError] = useState(null)
  const [isResetEmailSent, setIsResetEmailSent] = useState(false)

  const form = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  async function handleResendPasswordReset(values) {
    try {
      await forgetPassword({
        email: values.email,
        redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND}/reset-password`,
      })
      setIsResetEmailSent(true)
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError("An error occurred while sending the reset email.")
    }
  }

  if (isResetEmailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Email sent</CardTitle>
          <CardDescription>
            If the email address you entered is associated with an account, you
            will shortly receive an email to reset your password. Please check
            your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResendEmailButton
            onResend={handleResendPasswordReset}
            buttonText="Resend password reset email"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">Reset password</CardTitle>
        <CardDescription>
          Enter your email address to receive a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleResendPasswordReset)}
            className="space-y-4"
          >
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            <Button type="submit" className="mt-4 w-full">
              Send password reset link
            </Button>
          </form>
        </Form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default PasswordForgetCard
