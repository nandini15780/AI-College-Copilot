import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/db";

export async function GET() {
    try {
        const stats = getAdminStats();
        
        // Construct recent activities from system data
        const recentActivities = [
            {
                id: "1",
                icon: "UserRound",
                title: "New student account registered",
                time: "Recently",
                type: "user",
            },
            {
                id: "2",
                icon: "FileText",
                title: "Faculty materials updated in system",
                time: "Today",
                type: "material",
            },
            {
                id: "3",
                icon: "Bell",
                title: "Exam cell published urgent notice",
                time: "1 day ago",
                type: "notice",
            },
        ];

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers: stats.totalUsers,
                students: stats.students,
                faculty: stats.faculty,
                admins: stats.admins,
                totalMaterials: stats.totalMaterials,
                totalNotices: stats.totalNotices,
                sharedChatsCount: stats.sharedChatsCount,
            },
            activities: recentActivities,
        });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        return NextResponse.json(
            { error: "Failed to fetch admin dashboard metrics" },
            { status: 500 }
        );
    }
}
