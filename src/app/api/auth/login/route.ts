import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})
export async function POST(request: NextRequest) {

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

        return NextResponse.json({ message: "Login successful", userId: user.id, redirect: '/home', userType: user.userType });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}
