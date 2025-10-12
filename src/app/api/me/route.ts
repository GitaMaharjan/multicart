
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
