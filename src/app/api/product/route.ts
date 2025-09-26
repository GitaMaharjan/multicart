import cloudinary from "cloudinary";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            userType: string;
        };
        if (!decoded.userId || decoded.userType !== "SELLER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Parse formData
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const stock = formData.get("stock") as string;
        const categoryId = formData.get("categoryId") as string;
        const imageFile = formData.get("image") as File;

        if (!name || !description || !price || !stock || !categoryId || !imageFile) {
            return NextResponse.json(
                { message: "All fields including image are required" },
                { status: 400 }
            );
        }

        // Find category
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { store: true },
        });

        if (!category || category.store.sellerId !== decoded.userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadedImage = await new Promise<{ secure_url: string }>(
            (resolve, reject) => {
                cloudinary.v2.uploader
                    .upload_stream(
                        { folder: "products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result as { secure_url: string });
                        }
                    )
                    .end(buffer);
            }
        );

        const product = await prisma.product.create({
            data: {
                name,
                description: description,
                price: parseFloat(price),
                stock: parseInt(stock),
                categoryId,
                storeId: category.store.id,
                image: uploadedImage.secure_url,
            },
        });




        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string };
        if (!decoded.userId || decoded.userType !== "SELLER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const stores = await prisma.store.findMany({
            where: { sellerId: decoded.userId },
            select: { id: true },
        })

        if (stores.length === 0) {
            return NextResponse.json({ message: "No stores found" }, { status: 404 });
        }

        const storeIds = stores.map(store => store.id);

        const products = await prisma.product.findMany({
            where: {
                storeId: { in: storeIds }
            },
            orderBy: { createdAt: "desc" },
            include: { category: true, store: true },
        });
        return NextResponse.json(products, { status: 200 });


    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}