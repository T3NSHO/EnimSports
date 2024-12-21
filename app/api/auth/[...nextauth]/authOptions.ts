import nextAuth , {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db_connect from "@/lib/db_connect";
import { getoneuser } from "../../../queries/getuser-data";
import { User } from "@/app/types/User";




export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    providers: [
        CredentialsProvider({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(
          credentials: Record<"email" | "password", string> | undefined
        ): Promise<User | null> {
          try {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Email and password are required");
            }
            await db_connect();
            const user = await getoneuser(credentials.email);
        
            if (user && user.password === credentials.password) {
              return {
                id: user._id.toString(),
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                team: user.team,
                school: user.school,
                phone_number: user.phone_number,
              };
            }
        
            throw new Error("Invalid email or password");
          } catch (error) {
            console.error("Authorization error:", error);
            throw error;
          }
        }
        
      }),
    ],
    callbacks: {
      async jwt({ token, user }: { token: any; user?: User }) {
        if (user) {
          token.id = user.id; // Ensure `id` is included in the token
          token.email = user.email;
          token.full_name = user.full_name;
          token.role = user.role;
          token.team = user.team;
          token.school = user.school;
          token.phone_number = user.phone_number;
        }
        return token;
      },
      async session({ session, token }: { session: any; token: any }) {
        session.user = {
          id: token.id as string, // Map `id` to the session's user
          email: token.email as string,
          full_name: token.full_name as string,
          role: token.role as string,
          team: token.team as string | undefined,
          school: token.school as string | undefined,
          phone_number: token.phone_number as string | undefined,
        };
        return session;
      },
    },
  };
  
  
  