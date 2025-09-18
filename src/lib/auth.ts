import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
    userType: string;
}

export function verifyJWT(req: NextRequest): TokenPayload | null {
    const authHeader = req.headers.get("authorization");
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}
