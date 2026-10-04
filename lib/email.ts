import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { getUsers } from "@/lib/db";

type FacultyUpdateType = "notice" | "material" | "assignment" | "timetable";

type FacultyUpdate = {
  title?: string;
  subject?: string;
  department?: string;
  due?: string;
  day?: string;
  slot?: string;
  room?: string;
  downloadUrl?: string;
};

function getTransporter() {
  let host = process.env.SMTP_HOST;
  let port = Number(process.env.SMTP_PORT || 465);
  let user = process.env.SMTP_USER?.trim();
  let pass = process.env.SMTP_PASSWORD?.replace(/\s+/g, "").trim();

  if (!host || !user || !pass || user.includes("your-") || pass.includes("your-") || pass === "your-gmail-app-password") {
    try {
      const envLocalPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envLocalPath)) {
        const envContent = fs.readFileSync(envLocalPath, "utf8");
        const parsed: Record<string, string> = {};
        envContent.split("\n").forEach((line: string) => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            let val = (match[2] || "").trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
            parsed[match[1]] = val;
          }
        });
        if (parsed.SMTP_HOST) host = parsed.SMTP_HOST;
        if (parsed.SMTP_PORT) port = Number(parsed.SMTP_PORT);
        if (parsed.SMTP_USER) user = parsed.SMTP_USER.trim();
        if (parsed.SMTP_PASSWORD) pass = parsed.SMTP_PASSWORD.replace(/\s+/g, "").trim();
      }
    } catch (e) {
      // Ignore reading error
    }
  }

  if (!host || !user || !pass || user.includes("your-") || pass.includes("your-") || pass === "your-gmail-app-password") return null;

  const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

function getUpdateDetails(type: FacultyUpdateType, update: FacultyUpdate) {
  switch (type) {
    case "material":
      return {
        subject: `New study material: ${update.title || "Course material"}`,
        heading: "New study material uploaded",
        details: `Material: ${update.title || "Course material"}`,
      };
    case "assignment":
      return {
        subject: `New assignment: ${update.title || "Assignment"}`,
        heading: "New assignment posted",
        details: `Assignment: ${update.title || "Assignment"}\nDue date: ${update.due || "See student portal"}`,
      };
    case "timetable":
      return {
        subject: `Timetable updated: ${update.subject || "Class schedule"}`,
        heading: "Class timetable updated",
        details: `${update.day || "Day"} at ${update.slot || "scheduled time"}\nClass: ${update.subject || "Class"}\nRoom: ${update.room || "See student portal"}`,
      };
    default:
      return {
        subject: `New college notice: ${update.title || "Notice"}`,
        heading: "New college notice",
        details: `${update.title || "Notice"}${update.department ? `\nDepartment: ${update.department}` : ""}`,
      };
  }
}

export async function sendFacultyUpdateEmails(type: FacultyUpdateType, update: FacultyUpdate) {
  const transporter = getTransporter();
  const recipients = getUsers()
    .filter((user: any) => user.role === "Student" && user.email && user.notifications?.emailAlerts !== false && (type !== "assignment" || user.notifications?.assignmentReminders !== false))
    .map((user: any) => user.email);

  if (!transporter) {
    console.warn("Student email notifications skipped: SMTP credentials missing or placeholder used.");
    return { sent: false, configured: false, recipientCount: recipients.length, reason: "Configure SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in Vercel Environment Variables." };
  }

  if (recipients.length === 0) {
    return { sent: false, configured: true, recipientCount: 0 };
  }

  const details = getUpdateDetails(type, update);
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const portalUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const safeDetails = escapeHtml(details.details).replace(/\n/g, "<br />");

  try {
    await transporter.sendMail({
      from,
      to: from,
      bcc: recipients,
      subject: details.subject,
      text: `${details.heading}\n\n${details.details}\n\nOpen the student portal: ${portalUrl}${update.downloadUrl ? `\nAttachment: ${portalUrl}${update.downloadUrl}` : ""}`,
      html: `<h2>${escapeHtml(details.heading)}</h2><p>${safeDetails}</p><p><a href="${portalUrl}">Open the student portal</a></p>${update.downloadUrl ? `<p><a href="${portalUrl}${update.downloadUrl}">Open attachment</a></p>` : ""}`,
    });

    return { sent: true, configured: true, recipientCount: recipients.length };
  } catch (error) {
    console.error("Student email notification failed:", error);
    const code = (error as { code?: string })?.code;
    const reason = code === "EAUTH"
      ? "SMTP authentication failed. Check your Gmail App Password in Vercel settings."
      : code === "ECONNECTION" || code === "ETIMEDOUT" || code === "ESOCKET"
      ? "SMTP connection failed. On Vercel, use SMTP_PORT=465 and SMTP_SECURE=true."
      : "SMTP rejected the message. Check sender email and credentials.";
    return { sent: false, configured: true, recipientCount: recipients.length, reason };
  }
}

export async function sendAssignmentReminderEmails(assignment: FacultyUpdate) {
  const transporter = getTransporter();
  const recipients = getUsers()
    .filter((user: any) => user.role === "Student" && user.email && user.notifications?.emailAlerts !== false && user.notifications?.assignmentReminders !== false)
    .map((user: any) => user.email);

  if (!transporter || recipients.length === 0) {
    return { sent: false, configured: Boolean(transporter), recipientCount: recipients.length };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const portalUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const title = assignment.title || "Assignment";
  const due = assignment.due || "soon";

  try {
    await transporter.sendMail({
      from,
      to: from,
      bcc: recipients,
      subject: `Reminder: ${title} is due ${due}`,
      text: `Reminder: ${title} is due ${due}.\n\nOpen the student portal: ${portalUrl}`,
      html: `<h2>Assignment deadline reminder</h2><p><strong>${escapeHtml(title)}</strong> is due ${escapeHtml(due)}.</p><p><a href="${portalUrl}">Open the student portal</a></p>`,
    });
    return { sent: true, configured: true, recipientCount: recipients.length };
  } catch (error) {
    console.error("Assignment reminder email failed:", error);
    return { sent: false, configured: true, recipientCount: recipients.length };
  }
}
