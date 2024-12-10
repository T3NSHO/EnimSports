import { get } from "http";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getuserdata, { getoneuser } from "../../../queries/getuser-data";
import db_connect from "@/lib/db_connect";
import { NextResponse } from "next/server";

export const authOptions = {
  session: {
    strategy: "jwt" as "jwt",
  },

  pages: {
    signIn: "/login",
  },

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        await db_connect();
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        const user = await getoneuser(credentials.email);
        if (
          user.email === credentials.email &&
          user.password === credentials.password
        ) {
          return user;
        }
        return new NextResponse("Invalid email or password", { status: 401 });
      },
    }),
  ],
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
