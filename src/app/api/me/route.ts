// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req: NextRequest) {
//     const token = req.cookies.get("token")?.value;
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
//         return NextResponse.json({ userId: decoded.userId, email: decoded.email, userType: decoded.userType });
//     } catch {
//         return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

    try {
        const cookie = req.cookies.get("token")?.value;
        if (!cookie) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

        const decoded = jwt.verify(cookie, JWT_SECRET);
        return NextResponse.json(decoded);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
}
