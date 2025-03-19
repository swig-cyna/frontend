"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/features/auth/utils/authClient"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { generateFormFieldInput } from "@/components/functions"
import { useSearchParams } from "next/navigation"
import { resetPasswordSchema } from "../schemas/passwordReset"

const fields = [
  generateFormFieldInput({
    name: "password",
    placeholder: "Password",
    label: "Password",
    type: "password",
  }),
  generateFormFieldInput({
    name: "confirmPassword",
    placeholder: "Confirm password",
    label: "Confirm password",
    type: "password",
  }),
]

const PasswordResetCard = () => {
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [error, setError] = useState(null)
  const [isResetComplete, setIsResetComplete] = useState(false)

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")

    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values) {
    try {
      await authClient.resetPassword({
        token,
        newPassword: values.password,
      })
      setIsResetComplete(true)
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError("An error occurred while resetting the password.")
    }
  }

  if (isResetComplete) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Password reset</CardTitle>
          <CardDescription>
            Your password has been successfully reset. You can now log in with
            your new password.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">Reset password </CardTitle>
        <CardDescription>Enter your new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            <Button type="submit" className="mt-4 w-full">
              Reset password
            </Button>
          </form>
        </Form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default PasswordResetCard
