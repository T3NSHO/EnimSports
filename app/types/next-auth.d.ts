// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Ensure `id` is included
    full_name: string;
    email: string;
    role: string;
    team?: string;
    school?: string;
    phone_number?: string;
  }

  interface Session {
    user: User;
  }
}