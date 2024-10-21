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
const SignupCrad = () => {
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

  function onSubmit(values) {
    console.log(values)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">Sign up</CardTitle>
        <CardDescription>
          Use your email and password to sign up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField key={field.name} control={form.control} {...field} />
            ))}
            <Button type="submit" className="mt-4 w-full">
              Sign in
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

export default SignupCrad
