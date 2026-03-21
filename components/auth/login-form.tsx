// components/auth/login-form.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn } from "@/auth";
import { FaGoogle, FaTwitter, FaFacebook } from "react-icons/fa"; // react-icons

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
          <Button variant="outline" onClick={() => signIn("google")}><FaGoogle /></Button>
          <Button variant="outline" onClick={() => signIn("twitter")}><FaTwitter /></Button>
          <Button variant="outline" onClick={() => signIn("facebook")}><FaFacebook /></Button>
        </div>
        <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
        </div>
        {/* Credentials Form */}
        <form action={async (formData) => { "use server"; await signIn("credentials", formData); }} className="space-y-3">
          <Input name="email" type="email" placeholder="name@example.com" required />
          <Input name="password" type="password" placeholder="••••••••" required />
          <Button className="w-full" type="submit">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
}
