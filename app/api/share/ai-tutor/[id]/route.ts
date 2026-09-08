export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSharedAIChat } from "@/lib/db";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const sharedChat = getSharedAIChat(id);

        if (!sharedChat) {
            return NextResponse.json(
                { error: "Shared chat session not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            sharedChat,
        });
    } catch (error) {
        console.error("Error fetching shared AI Tutor chat:", error);
        return NextResponse.json(
            { error: "Failed to fetch shared chat" },
            { status: 500 }
        );
    }
}
