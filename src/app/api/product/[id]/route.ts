import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

const JWT_SECRET = process.env.JWT_SECRET as string;

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const productId = id;

        // --- AUTH ---
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            userType: string;
        };
        if (decoded.userType !== "SELLER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // --- VERIFY PRODUCT OWNERSHIP ---
        const stores = await prisma.store.findMany({
            where: { sellerId: decoded.userId },
        });
        if (!stores.length) {
            return NextResponse.json(
                { message: "No stores found for this seller" },
                { status: 404 }
            );
        }
        const storeIds = stores.map((s) => s.id);

        const categories = await prisma.category.findMany({
            where: { storeId: { in: storeIds } },
        });
        if (!categories.length) {
            return NextResponse.json(
                { message: "No categories found for this seller" },
                { status: 404 }
            );
        }
        const categoryIds = categories.map((c) => c.id);

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        if (!categoryIds.includes(product.categoryId)) {
            return NextResponse.json(
                { message: "Forbidden: product does not belong to your categories" },
                { status: 403 }
            );
        }

        // --- PARSE FORM DATA ---
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const stock = formData.get("stock") as string;
        const categoryId = formData.get("categoryId") as string;
        const imageFile = formData.get("image");

        // --- VALIDATION ---
        if (!name || !description || !price || !stock || !categoryId) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }
        if (!categoryIds.includes(categoryId)) {
            return NextResponse.json(
                { message: "Forbidden: cannot assign product to this category" },
                { status: 403 }
            );
        }

        // --- HANDLE IMAGE ---
        let imageUrl = product.image; // keep old image if no new one

        // Only upload if a new file was provided
        if (imageFile && typeof imageFile !== "string") {
            const fileObj = imageFile as File;
            if (fileObj.size > 0) {
                const arrayBuffer = await fileObj.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadedImage = await new Promise<{ secure_url: string }>(
                    (resolve, reject) => {
                        cloudinary.v2.uploader
                            .upload_stream({ folder: "products" }, (error, result) => {
                                if (error) reject(error);
                                else resolve(result as { secure_url: string });
                            })
                            .end(buffer);
                    }
                );

                imageUrl = uploadedImage.secure_url;
            }
        }

        // --- UPDATE PRODUCT ---
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                categoryId,
                image: imageUrl,
            },
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("PUT /product/:id error:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

    try {
        const productId = params.id;

        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            userType: string;
        };
        const { userId, userType } = decoded;

        if (userType !== "SELLER") {
            return NextResponse.json(
                { message: "Forbidden: not a seller" },
                { status: 403 }
            );
        }

        const stores = await prisma.store.findMany({ where: { sellerId: userId } });
        if (!stores.length) {
            return NextResponse.json(
                { message: "No stores found for this seller" },
                { status: 404 }
            );
        }

        const storeIds = stores.map((store) => store.id);

        const categories = await prisma.category.findMany({
            where: { storeId: { in: storeIds } },
        });
        if (!categories.length) {
            return NextResponse.json(
                { message: "No categories found for this seller's stores" },
                { status: 404 }
            );
        }

        const categoryIds = categories.map((c) => c.id);

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        if (!categoryIds.includes(product.categoryId)) {
            return NextResponse.json(
                { message: "Forbidden: product does not belong to your categories" },
                { status: 403 }
            );
        }

        // --- Delete image from Cloudinary if exists ---
        if (product.image) {
            try {
                // Extract public_id from URL
                const publicId = product.image
                    .split("/")
                    .slice(-1)[0]
                    .split(".")[0];
                await cloudinary.v2.uploader.destroy(`products/${publicId}`);
            } catch (err) {
                console.warn("Failed to delete image from Cloudinary:", err);
            }
        }

        // --- Delete product from DB ---
        await prisma.product.delete({ where: { id: productId } });

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("DELETE /product/:id error:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
