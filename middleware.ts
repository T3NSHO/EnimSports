
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (pathname.includes('/dashboard')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token);
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: ['/dashboard/:path*'], 
};