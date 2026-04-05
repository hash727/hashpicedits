import NextAuth, { type DefaultSession } from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// 1. Extend the session types for your 'plan' field
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: "FREE" | "PRO";
    } & DefaultSession["user"];
  }

  interface User {
    plan?: "FREE" | "PRO";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Required for Credentials & Middleware compatibility
  providers: [
    // 2. Initialize Social Providers correctly
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
    }),
    Resend({
      from: "onboarding@hashpicedit.com",
      apiKey: process.env.AUTH_RESEND_KEY,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        return isValid ? user : null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        if (!user.id) return false;
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        // Block login if email is not verified
        if (!existingUser?.emailVerified) return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      // 3. Persist the 'plan' from DB to JWT
      if (user) {
        token.id = user.id;
        token.plan = user.plan || "FREE";
      }
      return token;
    },
    async session({ session, token }) {
      // 4. Pass the 'plan' and 'id' to the client session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as "FREE" | "PRO") || "FREE";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error handling page
  },
});
