import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      userType: string;
    };
    if (!decoded.userId || decoded.userType !== "SELLER")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await request.json();

    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }
    const sellerId = decoded.userId;
    const store = await prisma.store.create({
      data: {
        name,
        description,
        seller: {
          connect: { id: sellerId }, // ✅ relational connection
        },
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(stores, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}
