import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the default User type
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // add id
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}
