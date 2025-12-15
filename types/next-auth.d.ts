import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extends the built-in session types to include the user's ID.
   */
  interface Session {
    user: {
      /** The user's database ID. */
      id: string
    } & DefaultSession["user"] // Keep the default properties like name, email, image
  }
}