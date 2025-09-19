import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ message: "Logged out successfully" });

    // Clear cookie
    res.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "strict",
    });

    return res;
}
