import { NextResponse } from "next/server";
import { getRawTableData } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const table = searchParams.get("table") || "users";

        const availableTables = [
            { id: "users", name: "Users Table (users.json)", description: "Registered students, faculty, and administrators" },
            { id: "student_dashboard", name: "Student Dashboard Data (dashboard.json)", description: "Student classes, assignments, notices & timetable" },
            { id: "faculty_dashboard", name: "Faculty Dashboard Data (faculty_dashboard.json)", description: "Faculty courses, student roster & materials" },
            { id: "ai_chats", name: "AI Tutor History (ai_chats.json)", description: "Saved AI Tutor chat logs" },
            { id: "shared_chats", name: "Shared AI Chats (shared_chats.json)", description: "Publicly shared study sessions" },
        ];

        const data = getRawTableData(table);

        if (data === null) {
            return NextResponse.json(
                { error: "Invalid database table requested" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            selectedTable: table,
            availableTables,
            recordCount: Array.isArray(data) ? data.length : typeof data === "object" ? Object.keys(data).length : 1,
            data,
        });
    } catch (error) {
        console.error("Error inspecting database table:", error);
        return NextResponse.json(
            { error: "Failed to load database table data" },
            { status: 500 }
        );
    }
}
