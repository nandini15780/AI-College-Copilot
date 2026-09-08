export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSharedAIChat, getAIChatHistory } from "@/lib/db";
import os from "os";

function getLocalNetworkIp() {
    try {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const net of interfaces[name] || []) {
                if (net.family === "IPv4" && !net.internal) {
                    return net.address;
                }
            }
        }
    } catch {
        // Fallback if OS module restricted
    }
    return "localhost";
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        let messages = body.messages;
        const title = body.title || "AI Tutor Session";
        const sharedBy = body.sharedBy || "Student";

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            messages = getAIChatHistory();
        }

        if (!messages || messages.length === 0) {
            return NextResponse.json(
                { error: "No chat history available to share" },
                { status: 400 }
            );
        }

        const sharedChat = createSharedAIChat({
            title,
            messages,
            sharedBy,
        });

        const networkIp = getLocalNetworkIp();

        return NextResponse.json({
            success: true,
            shareId: sharedChat.id,
            sharedChat,
            networkIp,
            sharePath: `/share/ai-tutor/${sharedChat.id}`,
        });
    } catch (error) {
        console.error("Error sharing AI Tutor chat:", error);
        return NextResponse.json(
            { error: "Failed to share chat" },
            { status: 500 }
        );
    }
}
