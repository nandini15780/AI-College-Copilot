import { NextResponse } from "next/server";
import { getDashboardData, addNotice, markNoticeRead } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const data = getDashboardData();
        return NextResponse.json({
            success: true,
            notices: data.notices || []
        }, { status: 200 });
    } catch (error) {
        console.error("Notices GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const created = addNotice(body);
        return NextResponse.json({ success: true, notice: created }, { status: 201 });
    } catch (error) {
        console.error("Notices POST Error:", error);
        return NextResponse.json({ error: "Failed to add notice" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;
        if (!id) {
            return NextResponse.json({ error: "Notice ID is required" }, { status: 400 });
        }
        markNoticeRead(id);
        return NextResponse.json({ success: true, message: "Notice marked as read" }, { status: 200 });
    } catch (error) {
        console.error("Notices PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
    }
}
