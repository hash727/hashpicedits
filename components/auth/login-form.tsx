"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Optional, for better a11y
import { FaGoogle, FaTwitter, FaFacebook } from "react-icons/fa";
import { loginWithSocial, loginWithCredentials } from "@/app/actions/auth-actions";
import Link from "next/link";

export function LoginForm() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 px-4">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

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
              className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800 hover:text-white"
              onClick={() => loginWithSocial("google")}
            >
              <FaGoogle className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800 hover:text-white"
              onClick={() => loginWithSocial("twitter")}
            >
              <FaTwitter className="h-4 w-4 text-sky-500" />
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800 hover:text-white"
              onClick={() => loginWithSocial("facebook")}
            >
              <FaFacebook className="h-4 w-4 text-blue-600" />
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Credentials Form */}
          <form action={loginWithCredentials} className="space-y-4">
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
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
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
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all" type="submit">
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
