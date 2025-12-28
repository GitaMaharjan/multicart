import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type Payload = {
  userId: string;
  userType: string;
};

export async function GET(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return NextResponse.json(
      { message: "JWT_SECRET is not defined" },
      { status: 500 }
    );
  }
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    const decoded = jwt.verify(token, JWT_SECRET) as Payload;

    if (decoded.userType !== "SELLER") {
      return NextResponse.json(
        { message: "Access denied: Not a seller" },
        { status: 403 }
      );
    }

    const stores = await prisma.store.findMany({
      where: { sellerId: decoded.userId },
    });
    const storeCount = stores.length;
    return NextResponse.json({ storeCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
