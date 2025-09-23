import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;


export async function POST(request: NextRequest) {
    try {

        const token = request.cookies.get("token")?.value

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, userType: string }

        if (!decoded.userId || decoded.userType !== "SELLER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }


        const body = await request.json()
        console.log("Category data received:", body);

        const { name, description } = body

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        const store = await prisma.store.findFirst({
            where: { sellerId: decoded.userId }
        })

        if (!store) {
            return NextResponse.json({ message: "No store found for seller" }, { status: 404 });
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