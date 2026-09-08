import { NextResponse } from "next/server";
import { getDashboardData, addAssignment, updateAssignment } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const data = getDashboardData();
        return NextResponse.json({
            success: true,
            assignments: data.assignments || []
        }, { status: 200 });
    } catch (error) {
        console.error("Assignments GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const created = addAssignment(body);
        return NextResponse.json({ success: true, assignment: created }, { status: 201 });
    } catch (error) {
        console.error("Assignments POST Error:", error);
        return NextResponse.json({ error: "Failed to add assignment" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;
        if (!id) {
            return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
        }
        const allowedStatuses = ["Not Started", "In Progress", "Completed", "Submitted"];
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid assignment status" }, { status: 400 });
        }
        updateAssignment(id, { status });
        return NextResponse.json({ success: true, message: "Assignment updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Assignments PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
    }
}
