import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";

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
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
