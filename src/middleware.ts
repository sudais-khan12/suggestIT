import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Define the routes you want to protect
const protectedRoutes = ["/dashboard", "/profile", "/settings"]; // Add your protected routes here

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the requested route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Get the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If no token, redirect to the sign-in page
    if (!token) {
      const signInUrl = new URL("/signIn", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // Redirect back to the original page after sign-in
      return NextResponse.redirect(signInUrl);
    }

    // If the user is authenticated, allow access
    return NextResponse.next();
  }

  // For non-protected routes, allow access
  return NextResponse.next();
}
