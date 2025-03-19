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
import { signupSchema } from "../schemas/signup"
import { signUp } from "@/features/auth/utils/authClient"
import { useState } from "react"
import EmailVerification from "./EmailVerification"

const CALLBACK_URL = process.env.NEXT_PUBLIC_FRONTEND

const fields = [
  generateFormFieldInput({
    name: "firstname",
    placeholder: "First name",
    label: "First name",
  }),
  generateFormFieldInput({
    name: "lastname",
    placeholder: "Last name",
    label: "Last name",
  }),
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
  generateFormFieldInput({
    name: "confirmPassword",
    placeholder: "Confirm password",
    label: "Confirm password",
    type: "password",
  }),
]

const SignupCard = () => {
  const [error, setError] = useState(null)
  const [isSignupComplete, setIsSignupComplete] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values) {
    try {
      const { error: signUpError } = await signUp.email({
        email: values.email,
        password: values.password,
        name: `${values.firstname} ${values.lastname}`,
        callbackURL: CALLBACK_URL,
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setIsSignupComplete(true)
        setUserEmail(values.email)
      }
    } catch (err) {
      console.error(`An error has occurred: ${err}`)
      setError("An error occurred during registration.")
    }
  }

  if (isSignupComplete) {
    return <EmailVerification userEmail={userEmail} />
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">Sign up</CardTitle>
        <CardDescription>
          Create an account using your email and password
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
              Sign up
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="underline text-primary">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignupCard
