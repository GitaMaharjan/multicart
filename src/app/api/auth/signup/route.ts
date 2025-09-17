import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

    try {
        const body = await request.json()
        console.log("Signup data received:", body);

        const { firstName, lastName, email, password, phoneNumber, gender, userType } = body;

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