import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";

// import your authOptions from lib
import { authOptions } from "@/lib/authOptions";

// NextAuth handler
const handler = NextAuth(authOptions);

// Define GET and POST route handlers
export { handler as GET, handler as POST };
