import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the default types so that we can include a custom role property

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    username?: string;
  }

  interface Session {
    user: {
      role?: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    role?: string;
    username?: string;
  }
}
