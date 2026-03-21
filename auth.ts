import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// INitialize NextAuth with providers and credentials logic
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Facebook,
    Twitter,
    Credentials({
      async authorize(credentials) {
        // Implementation requires database lookup and password
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
});
