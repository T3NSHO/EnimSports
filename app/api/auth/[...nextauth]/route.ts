import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; // Assuming you extract `authOptions` to a separate file for cleaner structure

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
