import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import {
  getFacultyDashboardData,
  updateFacultyDashboardStats,
  addFacultyNotice,
  addFacultyAssignment,
  addFacultyMaterial,
  addFacultyTimetable,
  markFacultyNoticeRead,
  removeFacultyNotice,
} from "@/lib/db";
import { sendFacultyUpdateEmails } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_production";

function extractToken(req: Request, cookieToken?: string): string | null {
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

async function requireFaculty(req: Request) {
  const cookieStore = await cookies();
  const token = extractToken(req, cookieStore.get("auth_token")?.value);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string; userId?: string };
    return decoded.role === "Faculty" ? decoded : null;
  } catch {
    return null;
  }
}

async function saveUpload(file: File, type: string) {
  if (!file.size) return null;
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Files must be smaller than 10 MB.");
  }

  const extension = path.extname(file.name).toLowerCase() || ".bin";
  const fileName = `${type}-${crypto.randomUUID()}${extension}`;
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), Buffer.from(await file.arrayBuffer()));

  return {
    fileName: file.name,
    fileType: file.type || extension.slice(1).toUpperCase(),
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    downloadUrl: `/uploads/${fileName}`,
  };
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("auth_token")?.value;
    const token = extractToken(req, cookieToken);

    let decoded: any = null;
    if (token) {
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch {
        return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Unauthorized. No authentication token found." }, { status: 401 });
    }

    if (decoded.role !== "Faculty") {
      return NextResponse.json({ error: "Faculty access required." }, { status: 403 });
    }

    const data = getFacultyDashboardData(decoded.userId);

    return NextResponse.json({
      success: true,
      authenticated: true,
      ...data,
    });
  } catch (error) {
    console.error("Faculty dashboard GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const faculty = await requireFaculty(req);
    if (!faculty) {
      return NextResponse.json({ error: "Faculty access required." }, { status: 403 });
    }

    let type: string | null = null;
    let data: any = null;
    let file: File | null = null;

    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      type = String(formData.get("type") || "");
      file = formData.get("file") instanceof File ? formData.get("file") as File : null;
      data = {
        title: String(formData.get("title") || ""),
        department: String(formData.get("department") || ""),
        category: String(formData.get("category") || "Academic"),
        due: String(formData.get("due") || ""),
        students: Number(formData.get("students") || 0),
        type: String(formData.get("materialType") || "PDF"),
        subject: String(formData.get("subject") || ""),
      };
    } else {
      const body = await req.json();
      type = body.type;
      data = body.data;
    }

    if (!type || !data) {
      return NextResponse.json({ error: "Missing required fields: 'type' and 'data' are required." }, { status: 400 });
    }

    if (file) {
      const upload = await saveUpload(file, type);
      data = { ...data, ...upload };
    }

    data = { ...data, author: "Faculty", postedBy: faculty.userId };
    let createdItem: any;

    switch (type) {
      case "notice": {
        if (!data.title || !data.department) {
          return NextResponse.json({ error: "Title and department are required for notice." }, { status: 400 });
        }
        createdItem = addFacultyNotice(data);
        break;
      }
      case "assignment": {
        if (!data.title || !data.due) {
          return NextResponse.json({ error: "Title and due date are required for assignment." }, { status: 400 });
        }
        createdItem = addFacultyAssignment(data);
        break;
      }
      case "material": {
        if (!data.title || !data.type) {
          return NextResponse.json({ error: "Title and type are required for material." }, { status: 400 });
        }
        createdItem = addFacultyMaterial(data);
        break;
      }
      case "timetable": {
        if (!data.day || !data.slot || !data.subject || !data.room) {
          return NextResponse.json({ error: "Day, slot, subject, and room are required for timetable." }, { status: 400 });
        }
        createdItem = addFacultyTimetable(data);
        break;
      }
      default:
        return NextResponse.json({ error: `Unsupported item type: ${type}.` }, { status: 400 });
    }

    const emailNotification = await sendFacultyUpdateEmails(type as "notice" | "material" | "assignment" | "timetable", createdItem);

    const updated = getFacultyDashboardData();

    return NextResponse.json({
      success: true,
      message: `Successfully created ${type}`,
      item: createdItem,
      stats: updated.stats,
      emailNotification,
    }, { status: 201 });
  } catch (error) {
    console.error("Faculty dashboard POST error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const faculty = await requireFaculty(req);
    if (!faculty) {
      return NextResponse.json({ error: "Faculty access required." }, { status: 403 });
    }

    const body = await req.json();
    const { action, id, stats, noticeId } = body;

    if (action === "updateProfile") {
      if (faculty.userId) {
        const { updateUser } = await import("@/lib/db");
        updateUser(faculty.userId, {
          name: body.name,
          email: body.email,
          profileImage: body.profileImage,
        });
      }
      return NextResponse.json({ success: true, message: "Faculty profile updated successfully." });
    }

    if (action === "updateStats") {
      if (!stats || typeof stats !== "object") {
        return NextResponse.json({ error: "Stats payload is required." }, { status: 400 });
      }
      updateFacultyDashboardStats(stats);
      return NextResponse.json({ success: true, message: "Stats updated successfully." });
    }

    if (action === "markNoticeRead") {
      if (!noticeId) {
        return NextResponse.json({ error: "Notice id is required." }, { status: 400 });
      }
      markFacultyNoticeRead(noticeId);
      return NextResponse.json({ success: true, message: "Notice marked as read." });
    }

    if (action === "updateAssignmentStatus") {
      if (!id) {
        return NextResponse.json({ error: "Assignment id is required." }, { status: 400 });
      }
      const current = getFacultyDashboardData();
      const updatedAssignments = (current.assignments || []).map((item: any) =>
        item.id === id ? { ...item, status: body.status || item.status } : item
      );

      const allData = JSON.parse(JSON.stringify(current));
      allData.assignments = updatedAssignments;
      // persist via file helper
      const { saveFacultyDashboardData } = await import("@/lib/db");
      saveFacultyDashboardData(allData);

      return NextResponse.json({ success: true, message: "Assignment updated successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Faculty dashboard PATCH error:", error);
    return NextResponse.json({ error: "Failed to update faculty dashboard" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const faculty = await requireFaculty(req);
    if (!faculty) {
      return NextResponse.json({ error: "Faculty access required." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.noticeId) {
      return NextResponse.json({ error: "Notice id is required." }, { status: 400 });
    }

    removeFacultyNotice(body.noticeId);
    return NextResponse.json({ success: true, message: "Notice deleted successfully." });
  } catch (error) {
    console.error("Faculty notice DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete notice." }, { status: 500 });
  }
}
