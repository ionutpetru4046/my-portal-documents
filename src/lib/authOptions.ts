import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabaseClient";

export const authOptions = {
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
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, token }: { session: { user?: { id?: string; email?: string; name?: string } }; token: { id?: string } }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: Record<string, unknown>; user?: { id?: string } }) {
      if (user?.id) (token as Record<string, unknown>).id = user.id;
      return token;
    },
  },
};
