import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
    getDashboardData,
    updateDashboardStats,
    addUpcomingClass,
    removeUpcomingClass,
    addAssignment,
    updateAssignment,
    addNotice,
    markNoticeRead,
} from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_production";

function extractToken(req: Request, cookieToken?: string): string | null {
    if (cookieToken) return cookieToken;

    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }

    return null;
}

// GET /api/student/dashboard
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const strict = searchParams.get("strict") === "true";

        const cookieStore = await cookies();
        const cookieToken = cookieStore.get("auth_token")?.value;
        const token = extractToken(req, cookieToken);

        let decoded: any = null;
        if (token) {
            try {
                decoded = jwt.verify(token, JWT_SECRET);
            } catch {
                if (strict) {
                    return NextResponse.json(
                        { error: "Invalid or expired token." },
                        { status: 401 }
                    );
                }
            }
        } else if (strict) {
            return NextResponse.json(
                { error: "Unauthorized. No authentication token found." },
                { status: 401 }
            );
        }

        const userId = decoded?.userId;
        const data = getDashboardData(userId);

        // If authenticated via token, ensure user details match token payload
        if (decoded) {
            data.user.name = decoded.name || data.user.name;
            data.user.role = decoded.role || data.user.role;
            data.user.email = decoded.email || data.user.email;
        }

        return NextResponse.json(
            {
                success: true,
                authenticated: !!decoded,
                ...data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Dashboard GET error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST /api/student/dashboard - Add class, assignment, or notice
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (!type || !data) {
            return NextResponse.json(
                { error: "Missing required fields: 'type' and 'data' are required." },
                { status: 400 }
            );
        }

        let createdItem: any;

        switch (type) {
            case "class": {
                if (!data.subject || !data.time) {
                    return NextResponse.json(
                        { error: "Subject and time are required for class." },
                        { status: 400 }
                    );
                }
                createdItem = addUpcomingClass(data);
                break;
            }
            case "assignment": {
                if (!data.title || !data.due) {
                    return NextResponse.json(
                        { error: "Title and due date are required for assignment." },
                        { status: 400 }
                    );
                }
                createdItem = addAssignment(data);
                break;
            }
            case "notice": {
                if (!data.title || !data.department) {
                    return NextResponse.json(
                        { error: "Title and department are required for notice." },
                        { status: 400 }
                    );
                }
                createdItem = addNotice(data);
                break;
            }
            default:
                return NextResponse.json(
                    { error: `Unsupported item type: ${type}. Expected 'class', 'assignment', or 'notice'.` },
                    { status: 400 }
                );
        }

        const updatedDashboard = getDashboardData();

        return NextResponse.json(
            {
                success: true,
                message: `Successfully created ${type}`,
                item: createdItem,
                stats: updatedDashboard.stats,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Dashboard POST error:", error);
        return NextResponse.json(
            { error: "Failed to create item" },
            { status: 500 }
        );
    }
}

// PATCH /api/student/dashboard - Update progress, assignment status, or mark notice read
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { action, id, progressPercentage, status } = body;

        if (action === "updateProgress") {
            if (typeof progressPercentage !== "number" || progressPercentage < 0 || progressPercentage > 100) {
                return NextResponse.json(
                    { error: "progressPercentage must be a number between 0 and 100." },
                    { status: 400 }
                );
            }
            updateDashboardStats({ progressPercentage });
            return NextResponse.json({
                success: true,
                message: "Progress updated successfully",
                progressPercentage,
            });
        }

        if (action === "updateAssignment") {
            if (!id || !status) {
                return NextResponse.json(
                    { error: "Assignment 'id' and 'status' are required." },
                    { status: 400 }
                );
            }
            updateAssignment(id, { status });
            const updated = getDashboardData();
            return NextResponse.json({
                success: true,
                message: "Assignment updated successfully",
                stats: updated.stats,
            });
        }

        if (action === "markNoticeRead") {
            if (!id) {
                return NextResponse.json(
                    { error: "Notice 'id' is required." },
                    { status: 400 }
                );
            }
            markNoticeRead(id);
            const updated = getDashboardData();
            return NextResponse.json({
                success: true,
                message: "Notice marked as read",
                stats: updated.stats,
            });
        }

        return NextResponse.json(
            { error: "Invalid action. Supported actions: 'updateProgress', 'updateAssignment', 'markNoticeRead'." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Dashboard PATCH error:", error);
        return NextResponse.json(
            { error: "Failed to update dashboard" },
            { status: 500 }
        );
    }
}

// DELETE /api/student/dashboard - Remove upcoming class
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        if (!classId) {
            return NextResponse.json(
                { error: "Missing classId parameter." },
                { status: 400 }
            );
        }

        removeUpcomingClass(classId);
        const updated = getDashboardData();

        return NextResponse.json({
            success: true,
            message: "Class removed successfully",
            stats: updated.stats,
            upcomingClasses: updated.upcomingClasses,
        });
    } catch (error) {
        console.error("Dashboard DELETE error:", error);
        return NextResponse.json(
            { error: "Failed to delete item" },
            { status: 500 }
        );
    }
}
