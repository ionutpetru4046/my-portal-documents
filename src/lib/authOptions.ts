import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabaseClient";
import type { NextAuthOptions, DefaultSession } from "next-auth";

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

        return { id: data.user.id, email: data.user.email, name: data.user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // Optional: add type-safe session
    maxAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.id) {
        // Add the user id to session
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
  },
};
