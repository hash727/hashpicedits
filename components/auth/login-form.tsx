"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaTwitter, FaFacebook } from "react-icons/fa";
import { loginWithSocial, loginWithCredentials } from "@/app/actions/auth-actions";

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription>Login to your account or continue with social apps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Logins */}
        <div className="grid grid-cols-3 gap-2">
          {/* Note: In Client Components, we wrap the server action in an arrow function */}
          <Button variant="outline" onClick={() => loginWithSocial("google")}>
            <FaGoogle className="text-red-500" />
          </Button>
          <Button variant="outline" onClick={() => loginWithSocial("twitter")}>
            <FaTwitter className="text-sky-500" />
          </Button>
          <Button variant="outline" onClick={() => loginWithSocial("facebook")}>
            <FaFacebook className="text-blue-600" />
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Credentials Form using Server Action */}
        <form action={loginWithCredentials} className="space-y-3">
          <Input name="email" type="email" placeholder="name@example.com" required />
          <Input name="password" type="password" placeholder="••••••••" required />
          <Button className="w-full" type="submit">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
}
