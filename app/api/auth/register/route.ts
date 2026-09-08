import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmailOrId, addUser } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, email, collegeId, password, role } = await req.json();

        if (!name || !email || !password || !role || (role !== "Admin" && !collegeId)) {
            return NextResponse.json(
            { error: role === "Admin" ? "Name, email, password, and role are required" : "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = findUserByEmailOrId(email) || (collegeId && findUserByEmailOrId(collegeId));
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or ID already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            collegeId: collegeId || null,
            password: hashedPassword,
            role, // "Student" | "Faculty" | "Admin"
            createdAt: new Date().toISOString(),
        };

        addUser(newUser);

        return NextResponse.json(
            { message: "User registered successfully", user: { name: newUser.name, email: newUser.email, role: newUser.role } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}
