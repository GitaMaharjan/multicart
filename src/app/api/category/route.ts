import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log("Category data received:", body);

        const { name, description } = body

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                description,
                store: {
                    create: {
                        name: "Default Store",
                        description: "Temporary store",
                        seller: {
                            create: {
                                firstName: "Default",
                                lastName: "Seller",
                                email: `default${Date.now()}@seller.com`, // must be unique
                                password: "password123", // hash in real app
                                phoneNumber: "0000000000",
                                gender: "OTHER",
                                userType: "SELLER",
                            },
                        },
                    }
                }
            }
        })

        return NextResponse.json(category, { status: 201 });
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });

    }


}

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                store: true,
            },
        });

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );

    }
}