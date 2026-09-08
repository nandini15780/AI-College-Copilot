import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmailOrId } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_production";

export async function POST(req: Request) {
    try {
        const { identifier, password, role } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json(
                { error: role === "Admin" ? "Admin email and password are required" : "College ID/email and password are required" },
                { status: 400 }
            );
        }

        // Find user
        const user = findUserByEmailOrId(identifier);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify role (optional, but good for security since they select role)
        if (user.role !== role) {
            return NextResponse.json(
                { error: `You do not have a ${role} account` },
                { status: 403 }
            );
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create a token
        const token = jwt.sign(
            { userId: user.id, name: user.name, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Create response
        const response = NextResponse.json(
            { message: "Login successful", user: { name: user.name, role: user.role } },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Failed to login" },
            { status: 500 }
        );
    }
}
