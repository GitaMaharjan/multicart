
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; userType: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                userType: true,
                firstName: true,
                lastName: true,

            },
        })

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            userId: user.id,
            email: user.email,
            userType: user.userType,
            name: user.firstName + " " + user.lastName,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
}
