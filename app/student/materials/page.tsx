"use client";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { useState, useEffect } from "react";
import StudentHeader from "@/components/StudentHeader";
import { formatTimestamp } from "@/lib/date-utils";
import { downloadMaterialPdf } from "@/lib/pdfGenerator";
import {
  Home,
  Bot,
  Bell,
  FileText,
  CalendarDays,
  ClipboardList,
  Settings,
  Search,
  ChevronDown,
  Moon,
  CircleHelp,
  Download,
  MoreVertical,
  Presentation,
  FileText as PdfIcon,
  X,
  Printer,
  FileDown,
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  Share2,
} from "lucide-react";

export default function Materials() {
  const [userName, setUserName] = useState("Student");
  const { darkMode, setDarkMode } = useTheme();

  const [semester, setSemester] = useState("Sem 7");
  const [subject, setSubject] = useState("All Subjects");
  const [type, setType] = useState("All Types");
  const [search, setSearch] = useState("");
  const [materialsList, setMaterialsList] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Student");

    fetch("/api/student/materials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.materials) {
          const mapped = data.materials.map((m: any, idx: number) => ({
            id: m.id || `mat-${idx}`,
            subject: m.title || m.subject,
            title: m.title || m.subject,
            semester: m.semester || "Sem 7",
            type: String(m.fileType || m.type || "PDF").toLowerCase().includes("ppt") ? "PPT" : "PDF",
            size: m.size || "2.4 MB",
            uploaded: m.createdAt ? formatTimestamp(m.createdAt) : m.uploadedDate || "10 Aug 2025",
            icon: String(m.fileType || m.type || "PDF").toLowerCase().includes("ppt") ? "ppt" : (idx % 2 === 0 ? "pdf-purple" : "pdf-blue"),
            downloadUrl: m.downloadUrl,
            fileName: m.fileName,
            fileDataUrl: m.fileDataUrl,
            author: m.author || "Dr. S. Sharma",
          }));
          setMaterialsList(mapped);
        }
      })
      .catch((err) => console.error("Failed to fetch materials:", err));
  }, []);

  const defaultMaterials = [
    {
      id: "mat-1",
      subject: "Database Management Systems Notes",
      semester: "Sem 7",
      type: "PDF",
      size: "1.8 MB",
      uploaded: "10 Aug 2025",
      icon: "pdf-purple",
      author: "Dr. S. Sharma",
    },
    {
      id: "mat-2",
      subject: "Artificial Intelligence Lecture Slides",
      semester: "Sem 7",
      type: "PDF",
      size: "2.4 MB",
      uploaded: "12 Aug 2025",
      icon: "pdf",
      author: "Prof. Alan Turing",
    },
    {
      id: "mat-3",
      subject: "Machine Learning Model Evaluation",
      semester: "Sem 7",
      type: "PPT",
      size: "4.2 MB",
      uploaded: "08 Aug 2025",
      icon: "ppt",
      author: "Dr. K. Mehta",
    },
    {
      id: "mat-4",
      subject: "NLP Introduction & Text Processing",
      semester: "Sem 7",
      type: "PDF",
      size: "2.1 MB",
      uploaded: "06 Aug 2025",
      icon: "pdf",
      author: "Prof. Alan Turing",
    },
    {
      id: "mat-5",
      subject: "Computer Networks Protocols Guide",
      semester: "Sem 7",
      type: "PDF",
      size: "3.6 MB",
      uploaded: "02 Aug 2025",
      icon: "pdf-blue",
      author: "Dr. S. Sharma",
    },
    {
      id: "mat-6",
      subject: "Web Technologies & Frameworks",
      semester: "Sem 6",
      type: "PDF",
      size: "3.1 MB",
      uploaded: "15 Jan 2025",
      icon: "pdf",
      author: "Prof. R. Verma",
    },
    {
      id: "mat-7",
      subject: "Design & Analysis of Algorithms",
      semester: "Sem 6",
      type: "PPT",
      size: "5.0 MB",
      uploaded: "18 Jan 2025",
      icon: "ppt",
      author: "Dr. K. Patel",
    },
    {
      id: "mat-8",
      subject: "Compiler Design Architecture",
      semester: "Sem 6",
      type: "PDF",
      size: "2.8 MB",
      uploaded: "20 Jan 2025",
      icon: "pdf-purple",
      author: "Dr. S. Sharma",
    },
    {
      id: "mat-9",
      subject: "Operating Systems Core Concepts",
      semester: "Sem 5",
      type: "PDF",
      size: "2.9 MB",
      uploaded: "10 Aug 2024",
      icon: "pdf-blue",
      author: "Dr. P. Deshmukh",
    },
    {
      id: "mat-10",
      subject: "Software Engineering Methodology",
      semester: "Sem 5",
      type: "PPT",
      size: "4.1 MB",
      uploaded: "14 Aug 2024",
      icon: "ppt",
      author: "Prof. M. Gupta",
    },
    {
      id: "mat-11",
      subject: "Cloud Computing & DevOps Pipelines",
      semester: "Sem 8",
      type: "PDF",
      size: "3.8 MB",
      uploaded: "05 Feb 2026",
      icon: "pdf",
      author: "Dr. A. Nambiar",
    },
    {
      id: "mat-12",
      subject: "Cyber Security & Cryptography Handbook",
      semester: "Sem 8",
      type: "PDF",
      size: "2.7 MB",
      uploaded: "10 Feb 2026",
      icon: "pdf-purple",
      author: "Prof. R. Singhania",
    },
  ];

  const materials = materialsList.length > 0 ? materialsList : defaultMaterials;

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/student/dashboard" },
    { label: "AI Tutor", icon: Bot, href: "/student/ai-tutor" },
    { label: "Notices", icon: Bell, href: "/student/notices" },
    { label: "Materials", icon: FileText, href: "/student/materials", active: true },
    { label: "Timetable", icon: CalendarDays, href: "/student/timetable" },
    { label: "Assignments", icon: ClipboardList, href: "/student/assignments" },
    { label: "Progress", icon: ClipboardList, href: "/student/progress" },
    { label: "Settings", icon: Settings, href: "/student/settings" },
  ];

  /* FILTER MATERIALS LOGIC */
  const filteredMaterials = materials.filter((material) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || material.subject.toLowerCase().includes(q);

    const matchesSemester =
      semester === "All Semesters" ||
      material.semester === semester;

    const matchesSubject =
      subject === "All Subjects" ||
      material.subject.toLowerCase().includes(subject.toLowerCase().replace("notes", "").replace("slides", "").trim());

    const matchesType =
      type === "All Types" ||
      material.type.toLowerCase() === type.toLowerCase();

    return matchesSearch && matchesSemester && matchesSubject && matchesType;
  });

  const getMaterialBody = (mat: any) => {
    return `CHAPTER STUDY GUIDE & LECTURE SUMMARY
--------------------------------------------------
Course Code: CSE-407 | Academic Term: ${mat.semester || "Semester VII"}
Author / Instructor: ${mat.author || "Faculty Office"}
Document Type: ${mat.type} File (${mat.size})

1. OVERVIEW & OBJECTIVES:
This document contains detailed lecture notes, core architectural diagrams, key mathematical formulas, and review questions for ${mat.subject}. 

2. CORE TOPICS COVERED:
• Fundamental definitions and theoretical concepts of ${mat.subject}
• Algorithmic workflows and step-by-step problem-solving methods
• Solved numerical problems and past university exam questions
• Practical lab exercise instructions and implementation guidelines

3. INSTRUCTIONS FOR STUDENTS:
• Read through Sections 1-4 prior to the upcoming mid-term examinations.
• Solve the self-assessment practice questions at the end of each module.
• Refer to recommended textbooks in the Central Library for deeper reference.`;
  };

  return (
    <main className={`h-screen overflow-hidden p-2 sm:p-3 ${darkMode ? "bg-[#11182b]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex h-full max-w-[1550px] overflow-hidden rounded-[20px] border ${darkMode ? "border-slate-700 bg-[#18223a]" : "border-[#dce7f8] bg-white"} shadow-[0_10px_40px_rgba(40,75,130,0.08)]`}>
        
        {/* SIDEBAR */}
        <aside className={`hidden w-[325px] shrink-0 flex-col border-r lg:flex ${darkMode ? "border-slate-700 bg-[#17223a]" : "border-[#e5edf9] bg-[#fbfdff]"}`}>
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

          <nav className="flex-1 px-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`mb-1.5 flex w-full items-center gap-5 rounded-[17px] px-6 py-[12px] text-left transition ${
                    item.active
                      ? "bg-gradient-to-r from-[#eee8ff] to-[#e7e1ff] text-[#4334d8]"
                      : darkMode
                      ? "text-slate-300 hover:bg-slate-700/50"
                      : "text-[#172346] hover:bg-[#f3f6ff]"
                  }`}
                >
                  <Icon size={22} strokeWidth={item.active ? 2.7 : 2.1} />
                  <span className={`text-[14px] ${item.active ? "font-semibold" : "font-medium"}`}>
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

        {/* MAIN SECTION */}
        <section className="min-w-0 flex-1 flex flex-col overflow-hidden">
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={userName}
            searchPlaceholder="Search notes, subjects, topics..."
            searchValue={search}
            onSearchChange={setSearch}
          />

          <div className="flex h-[calc(100%-75px)] min-h-0 flex-col overflow-hidden px-5 pb-4 pt-4 sm:px-8">
            <div className="shrink-0">
              <h2 className={`text-[24px] font-bold tracking-tight sm:text-[29px] ${darkMode ? "text-white" : "text-[#101d46]"}`}>
                Course Materials & Study Resources
              </h2>
            </div>

            {/* FILTERS */}
            <div className="mt-4 grid shrink-0 grid-cols-1 gap-3 md:grid-cols-3">
              <FilterSelect
                label="Semester"
                value={semester}
                onChange={setSemester}
                options={["All Semesters", "Sem 5", "Sem 6", "Sem 7", "Sem 8"]}
                darkMode={darkMode}
              />

              <FilterSelect
                label="Subject"
                value={subject}
                onChange={setSubject}
                options={[
                  "All Subjects",
                  "Artificial Intelligence",
                  "Database Management Systems",
                  "Machine Learning",
                  "NLP Introduction",
                  "Computer Networks",
                  "Web Technologies",
                  "Algorithms",
                  "Compiler Design",
                  "Operating Systems",
                  "Software Engineering",
                  "Cloud Computing",
                  "Cyber Security",
                ]}
                darkMode={darkMode}
              />

              <FilterSelect
                label="Type"
                value={type}
                onChange={setType}
                options={["All Types", "PDF", "PPT"]}
                darkMode={darkMode}
              />
            </div>

            {/* MATERIAL TABLE */}
            <div className={`mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[17px] border ${darkMode ? "border-slate-700 bg-[#202d49]" : "border-[#dce6f4] bg-white"}`}>
              {/* TABLE HEADER */}
              <div className={`grid shrink-0 grid-cols-[minmax(240px,1.8fr)_140px_120px_180px_60px] items-center px-5 py-3 text-[14px] font-semibold ${darkMode ? "bg-[#25334f] text-slate-200" : "bg-[#eef5ff] text-[#425777]"}`}>
                <span>Subject / Title</span>
                <span>Type</span>
                <span>Size</span>
                <span>Uploaded</span>
                <span className="text-right">Action</span>
              </div>

              {/* MATERIAL ROWS */}
              <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredMaterials.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-8 text-center">
                    <div>
                      <FileText size={42} className="mx-auto mb-3 text-[#5540d9]" />
                      <p className={`text-[17px] font-semibold ${darkMode ? "text-white" : "text-[#18264b]"}`}>
                        No course materials found
                      </p>
                      <p className="mt-1 text-[13px] text-[#7184a4]">
                        Try matching another subject, file type, or search term.
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredMaterials.map((mat, index) => (
                    <div
                      key={mat.id || index}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`group grid grid-cols-[minmax(240px,1.8fr)_140px_120px_180px_60px] items-center px-5 py-4 cursor-pointer transition ${
                        darkMode ? "hover:bg-[#25334f]" : "hover:bg-[#f8fbff]"
                      }`}
                    >
                      {/* TITLE */}
                      <div className="flex min-w-0 items-center gap-4">
                        <FileTypeIcon type={mat.icon} />
                        <span className={`truncate text-[15px] font-bold ${darkMode ? "text-white group-hover:text-indigo-400" : "text-[#20345b] group-hover:text-[#4334d8]"} transition`}>
                          {mat.subject}
                        </span>
                      </div>

                      {/* TYPE */}
                      <div>
                        <span className={`inline-flex rounded-full px-3.5 py-1 text-[12px] font-bold ${mat.type === "PPT" ? "bg-[#fff0da] text-[#eda126]" : "bg-[#ffe8ee] text-[#e33454]"}`}>
                          {mat.type}
                        </span>
                      </div>

                      {/* SIZE */}
                      <span className={`text-[14px] ${darkMode ? "text-slate-300" : "text-[#607596]"}`}>
                        {mat.size}
                      </span>

                      {/* UPLOADED */}
                      <span className={`text-[14px] ${darkMode ? "text-slate-300" : "text-[#607596]"}`}>
                        {mat.uploaded}
                      </span>

                      {/* ACTION MENU BUTTON */}
                      <div className="relative text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedMaterial(mat)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                            darkMode ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-[#12396c] hover:bg-indigo-50"
                          }`}
                          title="Open Material PDF Document"
                        >
                          <MoreVertical size={20} />
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
          COURSE MATERIAL PDF DOCUMENT VIEWER MODAL
      ========================================================= */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 overflow-hidden">
            
            {/* MODAL CONTROL HEADER */}
            <div className="no-print-bar flex items-center justify-between border-b border-slate-700 bg-slate-800/90 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold">
                  PDF
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedMaterial.subject}</h3>
                  <p className="text-xs text-slate-400">Author: {selectedMaterial.author || "Dr. S. Sharma"} • {selectedMaterial.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedMaterial.downloadUrl && selectedMaterial.downloadUrl !== "#" ? (
                  <a
                    href={selectedMaterial.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                  >
                    <Download size={14} /> Download File
                  </a>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        downloadMaterialPdf({
                          title: selectedMaterial.subject || selectedMaterial.title,
                          subject: selectedMaterial.subject,
                          type: selectedMaterial.type,
                          size: selectedMaterial.size,
                          author: selectedMaterial.author,
                        })
                      }
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                      title="Download genuine PDF document"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 rounded-xl bg-[#4334d8] px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition shadow-md"
                    >
                      <Printer size={15} /> Print Document
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PRINTABLE STUDY MATERIAL DOCUMENT / EMBEDDED FILE VIEWER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center items-start">
              {selectedMaterial.fileDataUrl ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                    <span className="font-semibold text-slate-300">{selectedMaterial.fileName || selectedMaterial.subject}</span>
                    {selectedMaterial.size && selectedMaterial.size !== "—" && <span>• {selectedMaterial.size}</span>}
                  </div>
                  <iframe
                    src={selectedMaterial.fileDataUrl}
                    className="w-full rounded-xl border border-slate-700 bg-white"
                    style={{ minHeight: "680px" }}
                    title={selectedMaterial.subject}
                  />
                </div>
              ) : selectedMaterial.downloadUrl && selectedMaterial.downloadUrl !== "#" ? (
                <iframe
                  src={selectedMaterial.downloadUrl}
                  className="w-full h-[650px] rounded-lg border border-slate-700 bg-white"
                  title={selectedMaterial.subject}
                />
              ) : (
                <div
                  id="printable-material-pdf"
                  className="w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded-2xl p-8 sm:p-12 border border-slate-200 font-serif leading-relaxed text-left relative my-4"
                >
                  {/* COLLEGE LETTERHEAD HEADER */}
                  <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 font-sans">
                    <div className="flex justify-center items-center gap-3 mb-2">
                      <Building2 className="h-9 w-9 text-slate-900" />
                      <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase">
                        DATTA MEGHE COLLEGE OF ENGINEERING
                      </h1>
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      Department of Computer Engineering
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Official Course Notes & Reference Document | Academic Term 2026-2027
                    </p>
                  </div>

                  {/* MATERIAL TITLE BANNER */}
                  <div className="my-6 border-y border-slate-300 py-4 text-center font-sans">
                    <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider block mb-1">
                      ACADEMIC STUDY RESOURCE ({selectedMaterial.type})
                    </span>
                    <h2 className="text-xl font-black text-slate-900 uppercase">
                      {selectedMaterial.subject}
                    </h2>
                  </div>

                  {/* METADATA BOX */}
                  <div className="bg-slate-50 border border-slate-300 rounded-md p-4 mb-6 text-xs font-sans space-y-1.5">
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">Course / Subject</span>
                      <span>:</span>
                      <span className="font-bold text-slate-900">{selectedMaterial.subject}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">Prepared By</span>
                      <span>:</span>
                      <span className="text-slate-900">{selectedMaterial.author || "Dr. S. Sharma"}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">File Type & Size</span>
                      <span>:</span>
                      <span className="text-slate-900">{selectedMaterial.type} Document ({selectedMaterial.size})</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">Upload Date</span>
                      <span>:</span>
                      <span className="text-slate-900">{selectedMaterial.uploaded}</span>
                    </div>
                  </div>

                  {/* DOCUMENT BODY */}
                  <div className="my-8 text-sm text-slate-800 space-y-4 font-mono whitespace-pre-line leading-relaxed border p-6 bg-slate-50/50 rounded-lg">
                    {getMaterialBody(selectedMaterial)}
                  </div>

                  {/* FOOTER */}
                  <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans text-xs text-slate-600">
                    <div>
                      <p className="font-bold text-slate-800">AI College Copilot Academic Portal</p>
                      <p>Verified Course Syllabus Material for {selectedMaterial.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 uppercase">Department Incharge</p>
                      <p>Computer Engineering Dept.</p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* FILTER SELECT COMPONENT */
function FilterSelect({
  label,
  value,
  onChange,
  options,
  darkMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  darkMode: boolean;
}) {
  return (
    <div>
      <label className={`mb-2 block text-[14px] font-semibold ${darkMode ? "text-slate-200" : "text-[#17254a]"}`}>
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-[48px] w-full appearance-none rounded-[15px] border px-4 pr-10 text-[15px] font-medium outline-none cursor-pointer ${
            darkMode
              ? "border-slate-600 bg-[#202d49] text-white"
              : "border-[#dce6f4] bg-white text-[#19305a]"
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={19}
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${
            darkMode ? "text-slate-300" : "text-[#234875]"
          }`}
        />
      </div>
    </div>
  );
}

/* FILE ICON COMPONENT */
function FileTypeIcon({ type }: { type: string }) {
  if (type === "ppt") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#fff0dc] text-[#f39b16]">
        <Presentation size={24} strokeWidth={2.2} />
      </div>
    );
  }

  if (type === "pdf-purple") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#eee5ff] text-[#7540df]">
        <PdfIcon size={24} strokeWidth={2.2} />
      </div>
    );
  }

  if (type === "pdf-blue") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#e4efff] text-[#286bd8]">
        <PdfIcon size={24} strokeWidth={2.2} />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#ffe8ee] text-[#e33454]">
      <PdfIcon size={24} strokeWidth={2.2} />
    </div>
  );
}