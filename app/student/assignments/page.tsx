"use client";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import StudentHeader from "@/components/StudentHeader";
import { downloadAssignmentPdf } from "@/lib/pdfGenerator";
import {
  Home,
  Bot,
  Bell,
  FileText,
  CalendarDays,
  ClipboardList,
  ChartNoAxesCombined,
  Settings,
  Search,
  ChevronDown,
  Moon,
  CircleHelp,
  CircleUserRound,
  ArrowRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Printer,
  Download,
  X,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { dueLabel, formatDueDate } from "@/lib/date-utils";

export default function Assignments() {
  const [userName, setUserName] = useState("Student");
  const { darkMode, setDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Student");

    fetch("/api/student/assignments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.assignments) {
          const mapped = data.assignments.map((a: any) => ({
            id: a.id,
            title: a.title,
            due: formatDueDate(a.due),
            extra: dueLabel(a.due, a.status),
            status: a.status,
            downloadUrl: a.downloadUrl,
            statusType: a.status === "In Progress" ? "progress" : a.status === "Submitted" ? "submitted" : a.status === "Overdue" ? "overdue" : "notstarted",
            icon: a.status === "Submitted" ? "check" : a.status === "Overdue" ? "alert" : "file",
            iconBg: a.status === "Submitted" ? "bg-[#e4f8ed]" : a.status === "Overdue" ? "bg-[#ffe6e9]" : "bg-[#eee7ff]",
            iconColor: a.status === "Submitted" ? "text-[#10a660]" : a.status === "Overdue" ? "text-[#ef3346]" : "text-[#6735dc]",
            category: a.category || (a.status === "Submitted" ? "Submitted" : a.status === "Overdue" ? "Overdue" : "Upcoming"),
          }));
          setAssignmentsList(mapped);
        }
      })
      .catch((err) => console.error("Failed to fetch assignments:", err));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch("/api/student/assignments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) return;
    setAssignmentsList((current) => current.map((assignment) => assignment.id === id ? {
      ...assignment,
      status,
      statusType: status === "Completed" || status === "Submitted" ? "submitted" : status === "In Progress" ? "progress" : "notstarted",
      category: status === "Submitted" ? "Submitted" : status === "Completed" ? "Completed" : status === "Overdue" ? "Overdue" : "Upcoming",
    } : assignment));
  };

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/student/dashboard" },
    { label: "AI Tutor", icon: Bot, href: "/student/ai-tutor" },
    { label: "Notices", icon: Bell, href: "/student/notices" },
    { label: "Materials", icon: FileText, href: "/student/materials" },
    { label: "Timetable", icon: CalendarDays, href: "/student/timetable" },
    { label: "Assignments", icon: ClipboardList, href: "/student/assignments" },
    { label: "Progress", icon: ChartNoAxesCombined, href: "/student/progress" },
    { label: "Settings", icon: Settings, href: "/student/settings" },
  ];

  const defaultAssignments = [
    {
      id: "default-ml",
      title: "Machine Learning Assignment",
      due: formatDueDate(new Date(Date.now() + 2 * 86400000).toISOString()),
      extra: dueLabel(new Date(Date.now() + 2 * 86400000).toISOString()),
      status: "In Progress",
      statusType: "progress",
      icon: "bell",
      iconBg: "bg-[#fff0d9]",
      iconColor: "text-[#f3a323]",
      category: "Upcoming",
    },
    {
      id: "default-dbms",
      title: "DBMS Mini Project",
      due: formatDueDate(new Date(Date.now() + 7 * 86400000).toISOString()),
      extra: dueLabel(new Date(Date.now() + 7 * 86400000).toISOString()),
      status: "Not Started",
      statusType: "notstarted",
      icon: "file",
      iconBg: "bg-[#eee7ff]",
      iconColor: "text-[#6735dc]",
      category: "Upcoming",
    },
    {
      id: "default-nlp",
      title: "NLP Assignment",
      due: formatDueDate(new Date(Date.now() - 1 * 86400000).toISOString()),
      extra: "Overdue",
      status: "Overdue",
      statusType: "overdue",
      icon: "alert",
      iconBg: "bg-[#ffe6e9]",
      iconColor: "text-[#ef3346]",
      category: "Overdue",
    },
    {
      id: "default-web",
      title: "Web Development Project",
      due: formatDueDate(new Date(Date.now() + 14 * 86400000).toISOString()),
      extra: dueLabel(new Date(Date.now() + 14 * 86400000).toISOString(), "Submitted"),
      status: "Submitted",
      statusType: "submitted",
      icon: "check",
      iconBg: "bg-[#e4f8ed]",
      iconColor: "text-[#10a660]",
      category: "Submitted",
    },
  ];

  const assignments = assignmentsList.length > 0 ? assignmentsList : defaultAssignments;

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Upcoming" && assignment.category === "Upcoming") ||
      (activeTab === "In Progress" && assignment.status === "In Progress") ||
      (activeTab === "Submitted" && assignment.status === "Submitted") ||
      (activeTab === "Overdue" && assignment.status === "Overdue");

    return matchesSearch && matchesTab;
  });

  return (
    <main
      className={`h-screen overflow-hidden ${
        darkMode ? "bg-[#11182b]" : "bg-[#edf3ff]"
      } p-1.5 sm:p-2`}
    >
      <div
        className={`mx-auto flex h-full max-w-[1600px] overflow-hidden rounded-[20px] border ${
          darkMode
            ? "border-slate-700 bg-[#18223a]"
            : "border-[#dce7f8] bg-white"
        } shadow-[0_10px_40px_rgba(40,75,130,0.08)]`}
      >
        <aside
          className={`hidden w-[325px] shrink-0 flex-col border-r lg:flex ${
            darkMode
              ? "border-slate-700 bg-[#17223a]"
              : "border-[#e5edf9] bg-[#fbfdff]"
          }`}
        >
          <div className="flex h-[90px] items-center gap-3 px-7">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center">
                <div className="absolute h-8 w-10 -rotate-[25deg] bg-[#3934d8] [clip-path:polygon(50%_0,100%_28%,50%_55%,0_28%)]" />
                <div className="absolute left-[12px] top-[17px] h-6 w-3 bg-[#2225ad] [clip-path:polygon(0_0,100%_25%,100%_100%,0_75%)]" />
                <div className="absolute left-[28px] top-[17px] h-6 w-3 bg-[#2225ad] [clip-path:polygon(0_25%,100%_0,100%_75%,0_100%)]" />
              </div>
            </div>
            <h1 className={`text-[22px] font-bold tracking-tight ${darkMode ? "text-white" : "text-[#101c43]"}`}>
              AI College Copilot
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === "Assignments";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`mb-1.5 flex w-full items-center gap-5 rounded-[17px] px-6 py-[12px] text-left transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#eee8ff] to-[#e7e1ff] text-[#4334d8]"
                      : darkMode
                      ? "text-slate-300 hover:bg-slate-700/50"
                      : "text-[#172346] hover:bg-[#f3f6ff]"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.7 : 2.1} />
                  <span className={`text-[14px] ${isActive ? "font-semibold" : "font-medium"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* BOTTOM DARK/LIGHT CONTROL & HELP BUTTON */}
          <div className="flex items-center justify-between px-7 pb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-3 rounded-full px-4 py-2 transition ${
                darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-[#edf3ff] hover:bg-indigo-100/60"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                <Moon size={18} className="text-[#20285a]" />
              </div>
              <span className={`text-[15px] font-medium ${darkMode ? "text-white" : "text-[#152043]"}`}>
                {darkMode ? "Dark" : "Light"}
              </span>
              <ChevronDown size={15} className={darkMode ? "text-white" : "text-[#17234b]"} />
            </button>

            <Link href="/student/settings#help-support" title="Help & Support">
              <CircleHelp
                size={24}
                className={darkMode ? "text-white hover:text-indigo-400" : "text-[#17234b] hover:text-[#3934d8]"}
              />
            </Link>
          </div>
        </aside>

        <section className="flex flex-1 flex-col overflow-hidden">
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={userName}
            searchPlaceholder="Search assignments..."
            searchValue={search}
            onSearchChange={setSearch}
          />

          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-6 flex gap-3">
              {["All", "Upcoming", "In Progress", "Submitted", "Overdue"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-[14px] font-medium transition ${
                    activeTab === tab
                      ? "bg-[#4334d8] text-white"
                      : darkMode
                      ? "bg-[#1f2c4d] text-slate-300 hover:bg-slate-700"
                      : "bg-[#f0f4fd] text-[#55647a] hover:bg-[#e2ebfa]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredAssignments.map((assignment, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAssignment(assignment)}
                  className={`card-highlight cursor-pointer flex flex-col justify-between rounded-[18px] border p-6 transition ${
                    darkMode ? "border-slate-700 bg-[#1f2c4d] hover:bg-[#25365c]" : "border-[#e5edf9] bg-white hover:bg-indigo-50/40"
                  } shadow-sm`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[12px] font-semibold uppercase px-3 py-1 rounded-full ${assignment.iconBg} ${assignment.iconColor}`}>
                        {assignment.status}
                      </span>
                      <span className={`text-[12px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                        Due: {assignment.due}
                      </span>
                    </div>

                    <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                      {assignment.title}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t pt-4 border-dashed border-slate-600/30" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition"
                    >
                      <Eye size={14} /> View Details
                    </button>
                    <div className="flex items-center gap-2">
                      {assignment.downloadUrl && assignment.downloadUrl !== "#" && (
                        <a href={assignment.downloadUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[13px] font-semibold text-[#4334d8] hover:underline">
                          Attachment <ArrowRight size={15} />
                        </a>
                      )}
                      <select
                        value={assignment.status}
                        onChange={(event) => updateStatus(assignment.id, event.target.value)}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold ${darkMode ? "border-slate-600 bg-[#202d49] text-slate-200" : "border-[#dce6f4] bg-white text-[#4334d8]"}`}
                        aria-label={`Change status for ${assignment.title}`}
                      >
                        <option>Not Started</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Submitted</option>
                        <option>Overdue</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================
          DOCUMENT / ASSIGNMENT SHEET VIEWER MODAL
      ========================================================= */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/90 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-bold text-xs">
                  ASG
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedAssignment.title}</h3>
                  <p className="text-xs text-slate-400">Due: {selectedAssignment.due} • Status: {selectedAssignment.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    downloadAssignmentPdf({
                      title: selectedAssignment.title,
                      due: selectedAssignment.due,
                      status: selectedAssignment.status,
                    })
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                  title="Download genuine printable PDF file"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-[#4334d8] px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition shadow-md"
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
                    Official Student Course Assignment Sheet | Term 2026
                  </p>
                </div>

                <div className="my-6 border-y border-slate-300 py-4 text-center font-sans">
                  <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider block mb-1">
                    COURSE WORK TASK ({selectedAssignment.status})
                  </span>
                  <h2 className="text-xl font-black text-slate-900 uppercase">
                    {selectedAssignment.title}
                  </h2>
                </div>

                <div className="bg-slate-50 border border-slate-300 rounded-md p-4 mb-6 text-xs font-sans space-y-1.5">
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Assignment Title</span>
                    <span>:</span>
                    <span className="font-bold text-slate-900">{selectedAssignment.title}</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Submission Due Date</span>
                    <span>:</span>
                    <span className="font-bold text-red-600">{selectedAssignment.due}</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Current Status</span>
                    <span>:</span>
                    <span className="text-slate-900">{selectedAssignment.status}</span>
                  </div>
                </div>

                <div className="my-8 text-sm text-slate-800 space-y-4 font-mono whitespace-pre-line leading-relaxed border border-slate-300 p-6 bg-slate-50 rounded-lg">
{`STUDENT ASSIGNMENT SPECIFICATION SHEET
--------------------------------------------------
Course Code: CSE-407 | Academic Session 2026

1. TASK OVERVIEW & OBJECTIVES:
Complete the technical exercises and problem statements outlined for ${selectedAssignment.title}. 

2. REQUIRED DELIVERABLES:
• Complete written response or source code implementation
• Verification test cases and execution outputs
• System diagram or architectural schema

3. SUBMISSION INSTRUCTIONS:
• Upload final solution before ${selectedAssignment.due}.
• Plagiarism rules apply. Submit original work.`}
                </div>

                <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans text-xs text-slate-600">
                  <div>
                    <p className="font-bold text-slate-800">AI College Student Portal</p>
                    <p>Verified Academic Assignment Sheet</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 uppercase">Department of Computer Engineering</p>
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