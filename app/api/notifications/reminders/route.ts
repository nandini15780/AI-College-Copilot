import { NextResponse } from "next/server";
import { getRawDashboardData, saveDashboardData } from "@/lib/db";
import { sendAssignmentReminderEmails } from "@/lib/email";

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(
    (secret && req.headers.get("authorization") === `Bearer ${secret}`) ||
    req.headers.get("x-vercel-cron") === "1"
  );
}

function parseDueDate(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (dateOnly) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }
  return new Date(value);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Reminder job is unauthorized." }, { status: 401 });
  }

  const dashboard = getRawDashboardData();
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  const dueSoon = (dashboard.assignments || []).filter((assignment: any) => {
    if (!assignment.due || ["Completed", "Submitted"].includes(assignment.status) || assignment.reminderSentAt) return false;
    const dueDate = parseDueDate(assignment.due);
    return !Number.isNaN(dueDate.getTime()) && dueDate >= now && dueDate <= tomorrow;
  });

  const results = [];
  for (const assignment of dueSoon) {
    const result = await sendAssignmentReminderEmails(assignment);
    results.push({ id: assignment.id, title: assignment.title, ...result });
    if (result.sent) assignment.reminderSentAt = new Date().toISOString();
  }

  if (results.some((result: any) => result.sent)) {
    saveDashboardData(dashboard);
  }

  return NextResponse.json({ success: true, checked: dashboard.assignments?.length || 0, reminders: results });
}
