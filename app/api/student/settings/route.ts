import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { findUserById, getUsers, saveUsers } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_production";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        
        let user: any = {
            name: "Student",
            email: "student@college.edu",
            collegeId: "123",
            role: "Student",
            profileImage: "",
            notifications: {
                emailAlerts: true,
                assignmentReminders: true,
                examUpdates: true
            }
        };

        if (token) {
            try {
                const decoded: any = jwt.verify(token, JWT_SECRET);
                const found = findUserById(decoded.userId);
                if (found) {
                    user = {
                        ...user,
                        name: found.name,
                        email: found.email,
                        collegeId: found.collegeId || "123",
                        role: found.role || "Student",
                        profileImage: found.profileImage || "",
                        notifications: found.notifications || user.notifications,
                    };
                }
            } catch {
                // Return default settings
            }
        }

        return NextResponse.json({ success: true, settings: user }, { status: 200 });
    } catch (error) {
        console.error("Settings GET Error:", error);
        return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (token) {
            try {
                const decoded: any = jwt.verify(token, JWT_SECRET);
                const users = getUsers();
                const updated = users.map((u: any) => {
                    if (u.id === decoded.userId) {
                        return {
                            ...u,
                            name: body.name || u.name,
                            email: body.email || u.email,
                            profileImage: body.profileImage !== undefined ? body.profileImage : u.profileImage,
                            notifications: body.notifications ? {
                                emailAlerts: body.notifications.emailAlerts !== false,
                                assignmentReminders: body.notifications.assignmentReminders !== false,
                                examUpdates: body.notifications.examUpdates !== false,
                            } : u.notifications,
                        };
                    }
                    return u;
                });
                saveUsers(updated);
            } catch {
                // Ignore token error
            }
        }

        return NextResponse.json({ success: true, message: "Settings saved successfully" }, { status: 200 });
    } catch (error) {
        console.error("Settings PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
