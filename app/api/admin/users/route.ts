import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUsers, addUser, findUserByEmailOrId } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        const query = searchParams.get("query")?.toLowerCase();

        let users = getUsers().map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            collegeId: u.collegeId || "N/A",
            createdAt: u.createdAt || new Date().toISOString(),
        }));

        if (role && role !== "All") {
            users = users.filter((u: any) => u.role === role);
        }

        if (query) {
            users = users.filter(
                (u: any) =>
                    u.name?.toLowerCase().includes(query) ||
                    u.email?.toLowerCase().includes(query) ||
                    u.collegeId?.toLowerCase().includes(query)
            );
        }

        return NextResponse.json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Error fetching admin users list:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { name, email, collegeId, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Name, email, password, and role are required" },
                { status: 400 }
            );
        }

        if (role !== "Admin" && !collegeId) {
            return NextResponse.json(
                { error: "College ID is required for Students and Faculty" },
                { status: 400 }
            );
        }

        const existingUser = findUserByEmailOrId(email) || (collegeId && findUserByEmailOrId(collegeId));
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or ID already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            collegeId: role === "Admin" ? null : collegeId,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
        };

        addUser(newUser);

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    collegeId: newUser.collegeId,
                    createdAt: newUser.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}
