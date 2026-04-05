"use client"
import { useState } from "react"
import { registerUser } from "@/app/actions/register"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(fd: FormData) {
    const res = await registerUser(fd)
    if (res.success) setIsSent(true)
  }

  if (isSent) {
    return (
      <Alert className="bg-blue-50">
        <AlertDescription>
          A verification link has been sent to your email. Please click it to activate your account.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Inputs for email/password */}
      <Button type="submit" className="w-full">Create Account</Button>
    </form>
  )
}
