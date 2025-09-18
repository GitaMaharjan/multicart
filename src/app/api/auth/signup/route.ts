import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
    userType: z.enum(["CUSTOMER", "SELLER"]),
})

export async function POST(request: NextRequest) {

    try {
        const body = await request.json()
        console.log("Signup data received:", body);

        const parsedData = signupSchema.safeParse(body)
        if (!parsedData.success) {
            return NextResponse.json(
                { message: "Validation error", errors: parsedData.error.flatten() },
                { status: 400 }
            );
        }

        const { firstName, lastName, email, password, phoneNumber, gender, userType } = parsedData.data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        const newuser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
                gender,
                userType
            }
        })

        return NextResponse.json({ message: "User created successfully", userId: newuser.id });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}