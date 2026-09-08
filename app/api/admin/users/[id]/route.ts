import { NextResponse } from "next/server";
import { updateUser, deleteUser, findUserById } from "@/lib/db";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const updates = await req.json();

        const user = findUserById(id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const updated = updateUser(id, updates);
        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            user: {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
                collegeId: updated.collegeId,
            },
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const user = findUserById(id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const success = deleteUser(id);
        if (success) {
            return NextResponse.json({
                success: true,
                message: "User deleted successfully",
            });
        }

        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
