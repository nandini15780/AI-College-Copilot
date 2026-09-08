import jsPDF from "jspdf";

export interface AssignmentPdfData {
  title: string;
  course?: string;
  due?: string;
  status?: string;
  marks?: string;
  instructor?: string;
  content?: string;
}

export interface MaterialPdfData {
  title: string;
  subject?: string;
  type?: string;
  size?: string;
  author?: string;
  uploadedAt?: string;
  content?: string;
}

export interface NoticePdfData {
  id?: string;
  title: string;
  department?: string;
  date?: string;
  category?: string;
  content?: string;
}

export function downloadAssignmentPdf(data: AssignmentPdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // College Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("AI COLLEGE OF ENGINEERING & TECHNOLOGY", 105, 18, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("Department of Computer Engineering & Information Technology", 105, 23, { align: "center" });
  doc.text("Official Student Course Assignment Sheet | Academic Year 2026", 105, 27, { align: "center" });

  // Divider Line
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.6);
  doc.line(15, 31, 195, 31);

  // Document Badge/Title
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(126, 34, 206); // purple-700
  doc.text(`COURSE EVALUATION TASK (${(data.status || "ACTIVE").toUpperCase()})`, 105, 38, { align: "center" });

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(data.title.toUpperCase(), 105, 45, { align: "center" });

  // Metadata Table Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(15, 50, 180, 28, "F");
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.rect(15, 50, 180, 28, "S");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Assignment Title:", 19, 57);
  doc.text("Submission Due:", 19, 64);
  doc.text("Course / Subject:", 19, 71);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(data.title, 55, 57);
  doc.setTextColor(220, 38, 38); // red-600
  doc.text(data.due || "End of Term", 55, 64);
  doc.setTextColor(15, 23, 42);
  doc.text(data.course || "Computer Engineering", 55, 71);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Faculty Instructor:", 115, 57);
  doc.text("Max Marks:", 115, 64);
  doc.text("Status:", 115, 71);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(data.instructor || "J Mathew", 150, 57);
  doc.text(data.marks || "100 Marks", 150, 64);
  doc.text(data.status || "Active", 150, 71);

  // Specification Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("ASSIGNMENT SPECIFICATION & INSTRUCTIONS", 15, 86);

  const defaultContent = `1. TASK OVERVIEW & OBJECTIVES:
Complete all problem statements, algorithms, and implementation tasks outlined for ${data.title}. Ensure all source code is clean, properly commented, and adheres to department standards.

2. REQUIRED DELIVERABLES:
• Well-documented source code implementation or written solution
• Complete test suite execution outputs & result snapshots
• System architecture diagram / ER schema where applicable

3. SUBMISSION GUIDELINES:
• Upload final solution PDF or GitHub repository link before ${data.due || "deadline"}.
• Academic integrity rules apply strictly. Plagiarized submissions will receive zero marks.`;

  const textToDraw = data.content || defaultContent;

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  const splitLines = doc.splitTextToSize(textToDraw, 170);

  // Background box for content
  const boxHeight = Math.max(splitLines.length * 4.5 + 8, 60);
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 90, 180, boxHeight, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, 90, 180, boxHeight, "S");

  doc.text(splitLines, 20, 97);

  // Footer
  const footerY = Math.min(90 + boxHeight + 25, 280);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(15, footerY, 195, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("AI College Student Portal", 15, footerY + 5);
  doc.setFont("helvetica", "normal");
  doc.text("Official Verified Academic Assignment Document", 15, footerY + 9);

  doc.setFont("helvetica", "bold");
  doc.text("Department of Computer Engineering", 195, footerY + 5, { align: "right" });

  doc.save(`${data.title.replace(/[^a-zA-Z0-9]/g, "_")}_Assignment.pdf`);
}

export function downloadMaterialPdf(data: MaterialPdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text("AI COLLEGE OF ENGINEERING & TECHNOLOGY", 105, 18, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Department of Computer Engineering & Information Technology", 105, 23, { align: "center" });
  doc.text("Official Course Study Resource | Academic Year 2026", 105, 27, { align: "center" });

  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.6);
  doc.line(15, 31, 195, 31);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(67, 56, 202);
  doc.text(`COURSE MATERIAL (${(data.type || "DOCUMENT").toUpperCase()})`, 105, 38, { align: "center" });

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(data.title.toUpperCase(), 105, 45, { align: "center" });

  doc.setFillColor(248, 250, 252);
  doc.rect(15, 50, 180, 28, "F");
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 50, 180, 28, "S");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Subject / Course:", 19, 57);
  doc.text("Resource Type:", 19, 64);
  doc.text("Uploaded By:", 19, 71);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(data.subject || data.title, 55, 57);
  doc.text(`${data.type || "PDF"} Document (${data.size || "1.8 MB"})`, 55, 64);
  doc.text(data.author || "Dr. S. Sharma", 55, 71);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Upload Date:", 120, 57);
  doc.text("Access Status:", 120, 64);

  doc.setFont("helvetica", "normal");
  doc.text(data.uploadedAt || "2026", 150, 57);
  doc.setTextColor(22, 163, 74);
  doc.text("Verified Academic Content", 150, 64);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("DOCUMENT CONTENT & SYLLABUS NOTES", 15, 86);

  const rawContent = data.content || `OFFICIAL STUDY MATERIAL & LECTURE NOTES\n--------------------------------------------\nCourse: ${data.subject || data.title}\nAuthor: ${data.author || "Faculty Instructor"}\n\nOVERVIEW & TOPIC OUTLINE:\nThis material covers essential theory, algorithmic foundations, code implementations, and practice problem sets for ${data.title}.\n\nKEY CONCEPTS:\n1. Core Definitions & Architectural Diagrams\n2. Practical Implementation Steps\n3. Self-Assessment Questions and Reference Answers\n\nStudents are advised to review all chapters prior to laboratory practicals and term examinations.`;

  const splitLines = doc.splitTextToSize(rawContent, 170);
  const boxHeight = Math.max(splitLines.length * 4.5 + 8, 60);

  doc.setFillColor(248, 250, 252);
  doc.rect(15, 90, 180, boxHeight, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, 90, 180, boxHeight, "S");

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(splitLines, 20, 97);

  const footerY = Math.min(90 + boxHeight + 25, 280);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(15, footerY, 195, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("AI College Library & Course Materials", 15, footerY + 5);

  doc.text("Department of Computer Engineering", 195, footerY + 5, { align: "right" });

  doc.save(`${data.title.replace(/[^a-zA-Z0-9]/g, "_")}_Material.pdf`);
}

export function downloadNoticePdf(data: NoticePdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text("AI COLLEGE OF ENGINEERING & TECHNOLOGY", 105, 18, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("(Approved by AICTE, New Delhi & Affiliated to University of Mumbai)", 105, 23, { align: "center" });
  doc.text("Knowledge City, Sector 10, Airoli, Navi Mumbai - 400708 | Website: www.aicet.edu.in", 105, 27, { align: "center" });

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.6);
  doc.line(15, 31, 195, 31);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text(`Ref No: AICET/CIRCULAR/2026/${(data.id || "01").replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`, 15, 37);
  doc.text(`Date: ${data.date || "2026-09-08"}`, 195, 37, { align: "right" });

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("OFFICIAL CIRCULAR / NOTICE", 105, 46, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(67, 56, 202);
  doc.text(data.title.toUpperCase(), 105, 53, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text(`ISSUED BY: ${(data.department || "Dean of Academic Affairs").toUpperCase()}`, 15, 62);

  const rawContent = data.content || `Notice regarding ${data.title}.\n\nAll students and faculty members are hereby requested to strictly follow the guidelines detailed in this notice.\nFor further queries, contact the Department Administration office during working hours.`;

  const splitLines = doc.splitTextToSize(rawContent, 170);
  const boxHeight = Math.max(splitLines.length * 4.5 + 10, 60);

  doc.setFillColor(248, 250, 252);
  doc.rect(15, 67, 180, boxHeight, "F");
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 67, 180, boxHeight, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(splitLines, 20, 75);

  const footerY = Math.min(67 + boxHeight + 30, 280);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(15, footerY, 195, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("By Order,", 195, footerY - 15, { align: "right" });
  doc.text("Dean of Academic Affairs", 195, footerY - 10, { align: "right" });
  doc.text("AI College of Engineering & Technology", 195, footerY - 5, { align: "right" });

  doc.text("AI College Official Notice Portal", 15, footerY + 5);

  doc.save(`${data.title.replace(/[^a-zA-Z0-9]/g, "_")}_Notice.pdf`);
}
