import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = request.cookies.get("token")?.value
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string }
        if (decoded.userType != "SELLER") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

        const { name, description } = await request.json();
        if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 })

        // Check store belongs to this seller
        const store = await prisma.store.findUnique({ where: { id: params.id } });
        if (!store || store.sellerId !== decoded.userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updatedStore = await prisma.store.update({
            where: { id: params.id },
            data: { name, description },
        });
        return NextResponse.json(updatedStore, { status: 200 });



    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to update store" }, { status: 500 });

    }
}