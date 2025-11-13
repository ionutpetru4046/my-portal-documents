import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextAuthOptions } from "next-auth";

const handler = NextAuth(authOptions as unknown as NextAuthOptions);

export { handler as GET, handler as POST };
