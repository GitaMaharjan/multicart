// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public routes (no auth required)
    if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth/login")) {
        return NextResponse.next();
    }

    // Get token from HttpOnly cookie
    const token = req.cookies.get("token")?.value;

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

    // Verify token
    if (!token) {
        const loginUrl = new URL("/auth", req.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
        jwt.verify(token, JWT_SECRET);
        // Token is valid → allow request
        return NextResponse.next();
    } catch (err) {
        const loginUrl = new URL("/auth", req.url);
        return NextResponse.redirect(loginUrl);
    }
}

// Configure matcher
export const config = {
    matcher: [
        "/home/:path*",       // protect /home
        "/dashboard/:path*",  // protect dashboard
        "/api/:path*",        // protect API routes
    ],
};
