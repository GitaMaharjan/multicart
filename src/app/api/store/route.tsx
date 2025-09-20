import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, sellerId } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: {
        name,
        description,
        sellerId,
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
    const stores = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        store: true,
      },
    });

    return NextResponse.json(stores, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
