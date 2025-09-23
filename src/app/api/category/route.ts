import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;


export async function POST(request: NextRequest) {
    try {
        // Get token
        const token = request.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Decode token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string };
        if (!decoded.userId || decoded.userType !== "SELLER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Parse request body
        const { name, description } = await request.json();
        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        // Find the seller's store
        const store = await prisma.store.findFirst({
            where: { sellerId: decoded.userId },
        });

        if (!store) {
            return NextResponse.json({ message: "No store found for seller" }, { status: 404 });
        }

        // Create category under the seller's existing store
        const category = await prisma.category.create({
            data: {
                name,
                description,
                storeId: store.id, // attach to the logged-in seller's store
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Failed to create category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // Get token from cookies
        const token = request.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string };

        if (!decoded.userId || decoded.userType !== "SELLER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Fetch only categories for stores that belong to this seller
        const categories = await prisma.category.findMany({
            where: {
                store: { sellerId: decoded.userId },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                store: true,
            },
        });

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("GET /category error:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}