"use client"

import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { FaGoogle, FaTwitter, FaFacebook } from "react-icons/fa";
import { loginWithSocial, loginWithCredentials } from "@/app/actions/auth-actions";
import Link from "next/link";
import { AlertCircle } from "lucide-react"; // Import Icon for error

export function LoginForm() {
  // 1. Local state to store server errors
  const [error, setError] = useState<string | null>(null);

  // 2. Wrapper function to handle the response
  async function handleLogin(formData: FormData) {
    setError(null); // Clear previous errors
    
    // Call server action
    const result = await loginWithCredentials(formData);

    // Check if server returned an error
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <Card className="relative mx-auto max-w-sm w-full bg-slate-900 border-slate-800 shadow-2xl z-10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
              onClick={() => loginWithSocial("google")}
            >
              <FaGoogle className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
              onClick={() => loginWithSocial("twitter")}
            >
              <FaTwitter className="h-4 w-4 text-sky-500" />
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
              onClick={() => loginWithSocial("facebook")}
            >
              <FaFacebook className="h-4 w-4 text-blue-600" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* 3. Pass the WRAPPER function here */}
          <form action={handleLogin} className="space-y-4">
            
            {/* Error Alert */}
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                Email
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Password
                </Label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500"
              />
            </div>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" type="submit">
              Sign In
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline hover:text-indigo-400 text-white">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
