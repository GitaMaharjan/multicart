// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public routes (no auth required)
    if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth/login")) {
        return NextResponse.next();
    }

    // Verify token for protected routes
    const user = verifyJWT(req);

    if (!user) {
        // If no/invalid token → redirect to /auth
        const loginUrl = new URL("/auth", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Token is valid → allow request
    return NextResponse.next();
}

// Configure matcher
export const config = {
    matcher: [
        "/home/:path*",   // protect /home
        "/dashboard/:path*", // protect dashboard
        "/api/:path*",    // protect API routes
    ],
};
