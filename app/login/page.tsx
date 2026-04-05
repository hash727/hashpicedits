import { signIn } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

import React from 'react'

// type Props = {}

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-4 p-8 max-w-sm mx-auto">
        <LoginForm />
    </div>
  )
}

export default LoginPage