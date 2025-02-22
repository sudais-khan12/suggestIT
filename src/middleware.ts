import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/settings"]; // Add your protected routes here

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const signInUrl = new URL("/signIn", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // Redirect back to the original page after sign-in
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}
