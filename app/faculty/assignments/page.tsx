"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { downloadAssignmentPdf } from "@/lib/pdfGenerator";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Moon,
  CircleHelp,
  Plus,
  Settings,
  Bot,
  Eye,
  Download,
  Trash2,
  Printer,
  X,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const defaultAssignments = [
  {
    id: "asg-1",
    title: "DBMS Mini Project - Schema & Query Design",
    due: "2026-09-18",
    students: 45,
    status: "Pending Grading",
    course: "Database Management Systems",
    marks: "100 Marks",
  },
  {
    id: "asg-2",
    title: "Artificial Intelligence - Neural Network Search Lab",
    due: "2026-09-22",
    students: 50,
    status: "Active",
    course: "Artificial Intelligence",
    marks: "50 Marks",
  },
  {
    id: "asg-3",
    title: "NLP Text Tokenization & Sentiment Classifier",
    due: "2026-09-28",
    students: 42,
    status: "Upcoming",
    course: "Natural Language Processing",
    marks: "75 Marks",
  },
];

export default function FacultyAssignmentsPage() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>(defaultAssignments);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [students, setStudents] = useState("45");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState("Faculty");
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "Faculty") router.replace("/login");
    setUserName(localStorage.getItem("userName") || "Faculty");

    fetch("/api/faculty/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.assignments && data.assignments.length > 0) {
          setAssignments(data.assignments);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("type", "assignment");
      formData.append("title", title);
      if (due) formData.append("due", due);
      if (students) formData.append("students", students);
      if (file) formData.append("file", file);

      const res = await fetch("/api/faculty/dashboard", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");

      setTitle("");
      setDue("");
      setStudents("45");
      setFile(null);
      const refreshed = await fetch("/api/faculty/dashboard");
      const result = await refreshed.json();
      setAssignments(result.assignments?.length ? result.assignments : [
        { id: Date.now().toString(), title, due: due || "2026-09-25", students: Number(students) || 45, status: "Active", course: "Computer Engineering", marks: "100 Marks" },
        ...assignments,
      ]);
    } catch (e) {
      setAssignments([
        { id: Date.now().toString(), title, due: due || "2026-09-25", students: Number(students) || 45, status: "Active", course: "Computer Engineering", marks: "100 Marks" },
        ...assignments,
      ]);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const getAssignmentSheet = (asg: any) => {
    return `OFFICIAL ACADEMIC ASSIGNMENT & QUESTION SHEET
--------------------------------------------------
Course / Department: ${asg.course || "Computer Engineering"}
Faculty Instructor: ${userName}
Submission Deadline: ${asg.due || "End of Term"} | Maximum Score: ${asg.marks || "100 Marks"}
Target Enrollment: ${asg.students || 45} Registered Students

1. OBJECTIVES & INSTRUCTIONS:
Students must complete all problem statements listed below. Solutions should be formatted cleanly and submitted as a single PDF or repository link on the Student Portal before 11:59 PM of the submission deadline.

2. PROBLEM STATEMENTS & TASKS:
Task 1: System Architecture & Requirements Analysis (${asg.title}) [30 Marks]
• Formulate the underlying ER Diagram or system workflow schema.
• Identify functional dependencies, key constraints, and normal forms.

Task 2: Implementation & Code Artifacts [40 Marks]
• Write clean, documented source code addressing core algorithmic constraints.
• Provide step-by-step execution outputs and sample test suite results.

Task 3: Performance Analysis & Conclusion [30 Marks]
• Benchmark algorithmic time and space complexity ($O(N)$ / $O(N \\log N)$).
• Highlight edge cases and propose optimizations for high-throughput scaling.

3. SUBMISSION RULES:
• Late submissions incur a 10% score deduction per 24-hour delay.
• Plagiarism above 15% will lead to immediate score invalidation.`;
  };

  return (
    <main className={`min-h-screen p-3 ${darkMode ? "bg-[#111827]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[24px] border ${darkMode ? "border-[#263248] bg-[#172033]" : "border-white bg-[#f8fbff]"}`}>
        
        {/* SIDEBAR */}
        <aside className={`hidden w-[280px] shrink-0 border-r p-5 lg:flex ${darkMode ? "border-[#263248] bg-[#172033]" : "border-[#e1e8f5] bg-[#f8fbff]"}`}>
          <div className="w-full flex flex-col justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6651ee] to-[#3023a5] flex items-center justify-center text-white font-bold text-lg">
                  AC
                </div>
                <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>AI College Copilot</div>
              </div>

              <nav className="space-y-2">
                <SidebarLink href="/faculty-dashboard" label="Dashboard" icon={<Home size={18} />} darkMode={darkMode} />
                <SidebarLink href="/faculty/ai-tutor" label="AI Tutor" icon={<Bot size={18} />} darkMode={darkMode} />
                <SidebarLink href="/faculty/materials" label="Materials" icon={<FileText size={18} />} darkMode={darkMode} />
                <SidebarLink href="/faculty/assignments" label="Assignments" icon={<ClipboardList size={18} />} active darkMode={darkMode} />
                <SidebarLink href="/faculty/timetable" label="Timetable" icon={<CalendarDays size={18} />} darkMode={darkMode} />
                <SidebarLink href="/faculty/settings" label="Settings" icon={<Settings size={18} />} darkMode={darkMode} />
              </nav>
            </div>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-700/30">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  darkMode
                    ? "border-[#35435e] bg-[#202c42] text-white"
                    : "border-[#e3e8f2] bg-white text-[#263b64]"
                }`}
              >
                <Moon size={15} />
                <span>{darkMode ? "Dark" : "Light"}</span>
              </button>
              <Link href="/faculty/settings#help-support" title="Help & Support">
                <CircleHelp
                  size={22}
                  className={
                    darkMode
                      ? "text-white hover:text-indigo-400"
                      : "text-[#17234b] hover:text-[#3934d8]"
                  }
                />
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN SECTION */}
        <section className="flex-1 min-w-0 flex flex-col">
          <header className={`flex items-center justify-between border-b px-6 py-4 ${darkMode ? "border-[#263248] bg-[#1a2438]" : "border-[#edf0f6] bg-white"}`}>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Assignments</h1>
              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>Create and track class tasks</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white" : "border-[#e3e8f2] bg-white text-[#263b64]"}`}><Moon size={18} /></button>
              <Link href="/faculty/settings#help-support" title="Help & Support" className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white hover:bg-slate-700" : "border-[#e3e8f2] bg-white text-[#263b64] hover:bg-indigo-50"}`}><CircleHelp size={18} /></Link>
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/20"><LogOut size={16} /> Logout</button>
            </div>
          </header>

          <div className="space-y-6 p-6 overflow-y-auto">
            
            {/* CREATE FORM */}
            <div className={`card-highlight rounded-[20px] border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              <div className="mb-4 flex items-center gap-2">
                <Plus size={18} className="text-[#7a52f4]" />
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Create assignment</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white focus:border-purple-500" : "border-[#dfe7f6] bg-white text-[#1b2e4d] focus:border-purple-500"}`} />
                <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                <input type="number" value={students} onChange={(e) => setStudents(e.target.value)} placeholder="Target Students" className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => setFile(e.target.files?.[0] || null)} className={`md:col-span-2 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                <div className="flex justify-end">
                  <button onClick={handleCreate} disabled={saving} className="rounded-xl bg-[#7a52f4] px-5 py-2.5 font-bold text-white shadow-sm hover:bg-purple-600 transition disabled:opacity-60">{saving ? "Saving..." : "Create Assignment"}</button>
                </div>
              </div>
            </div>

            {/* RECENT ASSIGNMENTS LIST */}
            <div className={`card-highlight rounded-[20px] border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-[#4d62d8]" />
                  <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Recent assignments</h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">Total: {assignments.length}</span>
              </div>

              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <p className={darkMode ? "text-slate-400" : "text-slate-500"}>No assignments created yet.</p>
                ) : (
                  assignments.map((assignment: any) => (
                    <div
                      key={assignment.id}
                      onClick={() => setSelectedAssignment(assignment)}
                      className={`group flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${
                        darkMode ? "border-[#2c3b54] bg-[#1f2c47] hover:bg-[#253554]" : "border-[#e7ecf5] bg-[#f8fbff] hover:bg-purple-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs">
                          {assignment.students || 45}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1c2d52] dark:text-white truncate group-hover:text-purple-400 transition">{assignment.title}</p>
                          <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>Due: {assignment.due || "TBD"} • {assignment.course || "Computer Engineering"}</p>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition"
                          title="View Assignment Sheet"
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button
                          onClick={() =>
                            downloadAssignmentPdf({
                              title: assignment.title,
                              course: assignment.course,
                              due: assignment.due,
                              status: "Active",
                              instructor: userName,
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-600/40 bg-slate-700/20 text-slate-300 hover:bg-slate-700/50 transition"
                          title="Download Assignment PDF"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(assignment.id, e)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                          title="Delete Assignment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* =========================================================
          FACULTY ASSIGNMENT SHEET VIEWER MODAL
      ========================================================= */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 overflow-hidden">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/90 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-bold text-xs">
                  ASG
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedAssignment.title}</h3>
                  <p className="text-xs text-slate-400">Target Students: {selectedAssignment.students || 45} • Due: {selectedAssignment.due}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    downloadAssignmentPdf({
                      title: selectedAssignment.title,
                      course: selectedAssignment.course,
                      due: selectedAssignment.due,
                      marks: selectedAssignment.marks,
                      instructor: userName,
                    })
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                  title="Download genuine printable PDF file"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-[#7a52f4] px-4 py-2 text-xs font-bold text-white hover:bg-purple-600 transition shadow-md"
                >
                  <Printer size={15} /> Print Sheet
                </button>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* DOCUMENT PREVIEW */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center items-start">
              <div id="printable-assignment-sheet" className="w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded-2xl p-8 sm:p-12 border border-slate-200 font-serif leading-relaxed text-left relative my-4">
                
                <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 font-sans">
                  <div className="flex justify-center items-center gap-3 mb-2">
                    <Building2 className="h-9 w-9 text-slate-900" />
                    <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase">
                      AI COLLEGE OF ENGINEERING & TECHNOLOGY
                    </h1>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                    Department of Computer Engineering & Information Technology
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Official Course Assignment Sheet | Academic Year 2026-2027
                  </p>
                </div>

                <div className="my-6 border-y border-slate-300 py-4 text-center font-sans">
                  <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider block mb-1">
                    STUDENT EVALUATION TASK
                  </span>
                  <h2 className="text-xl font-black text-slate-900 uppercase">
                    {selectedAssignment.title}
                  </h2>
                </div>

                <div className="bg-slate-50 border border-slate-300 rounded-md p-4 mb-6 text-xs font-sans space-y-1.5">
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Course / Subject</span>
                    <span>:</span>
                    <span className="font-bold text-slate-900">{selectedAssignment.course || "Computer Engineering"}</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Faculty Instructor</span>
                    <span>:</span>
                    <span className="text-slate-900">{userName}</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Deadline</span>
                    <span>:</span>
                    <span className="font-bold text-red-600">{selectedAssignment.due || "End of Semester"} (11:59 PM)</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Evaluation Weightage</span>
                    <span>:</span>
                    <span className="text-slate-900">{selectedAssignment.marks || "100 Marks"}</span>
                  </div>
                </div>

                <div className="my-8 text-sm text-slate-800 space-y-4 font-mono whitespace-pre-line leading-relaxed border border-slate-300 p-6 bg-slate-50 rounded-lg">
                  {getAssignmentSheet(selectedAssignment)}
                </div>

                <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans text-xs text-slate-600">
                  <div>
                    <p className="font-bold text-slate-800">Academic Assessment Portal</p>
                    <p>Verified Faculty Course Work</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 uppercase">{userName}</p>
                    <p>Department Incharge</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}

function SidebarLink({ href, label, icon, active, darkMode }: { href: string; label: string; icon: React.ReactNode; active?: boolean; darkMode: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? (darkMode ? "bg-[#283556] text-[#6b63ff]" : "bg-[#e9e8ff] text-[#4c56dc]") : (darkMode ? "text-slate-300 hover:bg-[#202c42]" : "text-[#29446f] hover:bg-[#f0f3ff]")}`}>
      {icon}
      {label}
    </Link>
  );
}
