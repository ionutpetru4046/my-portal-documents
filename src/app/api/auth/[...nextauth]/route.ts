import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";

// 1️⃣ Extend DefaultSession to include user id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// 2️⃣ Extend JWT to include user id
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Supabase",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) return null;

        // Return a typed user object
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      // Add id from JWT to session.user
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add id from user to JWT token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
