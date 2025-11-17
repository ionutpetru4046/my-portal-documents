import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { supabase } from "./supabaseClient";

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
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.id) {
        // Cast session.user to allow id property
        (session.user as typeof session.user & { id?: string }).id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, trigger, session: sessionData }) {
      if (user) {
        token.id = user.id;
      }
      // Handle Supabase OAuth users
      if (trigger === "signIn" && sessionData?.supabaseUserId) {
        token.id = sessionData.supabaseUserId;
      }
      return token;
    },
  },
};
