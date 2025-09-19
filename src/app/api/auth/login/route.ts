import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";


const loginSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})



export async function POST(request: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");

    try {
        const body = await request.json()
        console.log("Login data received:", body);

        const parsedData = loginSchema.safeParse(body)
        if (!parsedData.success) {
            return NextResponse.json(
                { message: "Validation error", errors: parsedData.error.flatten() },
                { status: 400 }
            );
        }
        const { email, password } = parsedData.data;

        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                userType: user.userType,
            },
            JWT_SECRET, {
            expiresIn: '1h'
        }
        )

        const res = NextResponse.json({ message: "Login successful", token, redirect: '/home', userType: user.userType });

        res.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60, // 1 hour
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        return res
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}
