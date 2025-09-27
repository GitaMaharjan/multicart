import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.cookies.get("token")?.value;

        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            userType: string;
        };
        console.log("Decoded JWT:", decoded);

        if (decoded.userType !== "SELLER")
            return NextResponse.json({ message: "Forbidden: not a seller" }, { status: 403 });

        const { name, description } = await request.json();
        if (!name)
            return NextResponse.json({ message: "Name is required" }, { status: 400 });

        const category = await prisma.category.findUnique({ where: { id } });
        if (!category)
            return NextResponse.json({ message: "Category not found" }, { status: 404 });

        const store = await prisma.store.findUnique({ where: { id: category.storeId } });
        if (!store)
            return NextResponse.json({ message: "Store not found" }, { status: 404 });

        console.log("Category storeId:", category.storeId, "Store sellerId:", store.sellerId);

        if (store.sellerId !== decoded.userId)
            return NextResponse.json(
                {
                    message: `Forbidden: seller mismatch. Logged-in user: ${decoded.userId}, Store owner: ${store.sellerId}`,
                },
                { status: 403 }
            );

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, description },
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        console.error("PUT /category/:id error:", error);
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string };

        if (decoded.userType !== "SELLER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const categoryId = params.id;

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        const store = await prisma.store.findUnique({
            where: { id: category.storeId },
        });
        if (!store) {
            return NextResponse.json({ message: "Store not found" }, { status: 404 });
        }

        if (store.sellerId !== decoded.userId) {
            return NextResponse.json({ message: "Forbidden: seller mismatch" }, { status: 403 });
        }

        await prisma.category.delete({
            where: { id: categoryId },
        });

        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /category/:id error:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}