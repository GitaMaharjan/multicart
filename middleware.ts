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
        const decoded = jwt.verify(token, JWT_SECRET) as { userType: string }

        if (pathname.startsWith("/seller") && decoded.userType !== "SELLER") {
            const homeUrl = new URL("/home", req.url);
            return NextResponse.redirect(homeUrl)
        }
        // Restrict home to customers only
        if (pathname.startsWith("/home") && decoded.userType === "SELLER") {
            const dashboardUrl = new URL("/seller/dashboard", req.url);
            return NextResponse.redirect(dashboardUrl);
        }

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
        "/seller/:path*",  // protect dashboard
        "/api/:path*",        // protect API routes
    ],
};
