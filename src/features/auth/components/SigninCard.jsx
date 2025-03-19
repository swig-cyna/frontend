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
import Link from "next/link"
import { useForm } from "react-hook-form"
import { signinSchema } from "../schemas/signin"
import { signIn } from "@/features/auth/utils/authClient"
import { useState } from "react"

const CALLBACK_URL = "http://localhost:3000/"

const fields = [
  generateFormFieldInput({
    name: "email",
    placeholder: "Email",
    label: "Email",
    type: "email",
  }),
  generateFormFieldInput({
    name: "password",
    placeholder: "Password",
    label: "Password",
    type: "password",
  }),
]

const SigninCard = () => {
  const [error, setError] = useState(null)
  const [isSigninComplete, setIsSigninComplete] = useState(false)

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values) {
    try {
      const { error: signInError } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: CALLBACK_URL,
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        setIsSigninComplete(true)
      }
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError("An error occurred during sign in.")
    }
  }

  if (isSigninComplete) {
    return <div>Sign in successful! Redirecting...</div>
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">Sign in</CardTitle>
        <CardDescription>
          Use your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <Button type="submit" className="mt-4 w-full">
              Sign in
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline text-primary">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SigninCard
