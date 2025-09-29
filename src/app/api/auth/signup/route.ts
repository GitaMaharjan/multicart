import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const signupSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().min(1, "Email is required").email({ message: "Invalid email address" }),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
        phoneNumber: z
            .string()
            .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
        gender: z.enum(
            ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
            { error: "Please select your gender" }
        ),
        userType: z.enum(["CUSTOMER", "SELLER"]),
        termsAccepted: z.boolean().refine(val => val === true, {
            message: "You must accept the Terms and Privacy Policy",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const parsedData = signupSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                { message: "Validation error", errors: parsedData.error.flatten() },
                { status: 400 }
            );
        }

        const { firstName, lastName, email, password, phoneNumber, gender, userType } = parsedData.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
                gender,
                userType,
            },
        });

        return NextResponse.json({ message: "User created successfully", userId: newUser.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
