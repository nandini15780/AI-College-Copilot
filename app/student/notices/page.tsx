"use client";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { useState, useEffect } from "react";
import StudentHeader from "@/components/StudentHeader";
import { formatTimestamp } from "@/lib/date-utils";
import { downloadNoticePdf } from "@/lib/pdfGenerator";
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
  CalendarCheck,
  FileCheck2,
  PartyPopper,
  BookOpen,
  ArrowRight,
  Printer,
  X,
  Download,
  Building2,
  FileDown,
} from "lucide-react";

export default function Notices() {
  const [userName, setUserName] = useState("Student");
  const { darkMode, setDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [noticesList, setNoticesList] = useState<any[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Student");

    const cleanTitle = (raw: string) => {
      if (!raw) return "Official College Notice";
      return raw
        .replace(/^\[OFFICIAL\]\s*/i, '')
        .replace(/^\{?\s*"content"\s*:\s*"?/i, '')
        .replace(/["{}]/g, '')
        .trim();
    };

    fetch("/api/student/notices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.notices) {
          const mapped = data.notices.map((n: any, idx: number) => ({
            id: n.id || `notif-${idx}`,
            title: cleanTitle(n.title),
            department: n.department || "Academic Cell",
            date: n.createdAt ? formatTimestamp(n.createdAt) : n.date || "Sep 8, 2026",
            category: n.category || "Academic",
            content: n.content || n.description || "",
            downloadUrl: n.downloadUrl,
            icon: n.category === "Urgent" ? CalendarCheck : n.category === "Event" ? PartyPopper : BookOpen,
            iconBg: n.category === "Urgent" ? "bg-[#ffe8ee]" : n.category === "Event" ? "bg-[#fff3db]" : "bg-[#e8f1ff]",
            iconColor: n.category === "Urgent" ? "text-[#ef3155]" : n.category === "Event" ? "text-[#f4a11f]" : "text-[#2866d5]",
            tagBg: n.category === "Urgent" ? "bg-[#ffe1e7]" : n.category === "Event" ? "bg-[#ffedd3]" : "bg-[#dcf7e3]",
            tagColor: n.category === "Urgent" ? "text-[#e52f50]" : n.category === "Event" ? "text-[#e89417]" : "text-[#149b52]",
          }));
          setNoticesList(mapped);
        }
      })
      .catch((err) => console.error("Failed to fetch notices:", err));
  }, []);

  const defaultNotices = [
    {
      id: "n-hacknova",
      title: "Annual National-Level Hackathon HackNova 2026",
      department: "Faculty / Academic Cell",
      date: "Sep 8, 2026, 8:34 PM",
      category: "Academic",
      content: "All students of SE, TE, and BE are hereby informed that the Department of Computer Engineering is organizing 'HackNova 2026' - Annual National Level 24-Hour Hackathon. Teams of 3-4 members can register. Cash prizes worth ₹1,00,000, industry mentorship, and certificates will be provided. Registration closes on September 20, 2026.",
      icon: BookOpen,
      iconBg: "bg-[#e8f1ff]",
      iconColor: "text-[#2866d5]",
      tagBg: "bg-[#dcf7e3]",
      tagColor: "text-[#149b52]",
    },
    {
      id: "n-midterm",
      title: "Mid-Term Examination Schedule & Lab Submission Guidelines",
      department: "Faculty / Academic Cell",
      date: "Sep 8, 2026, 8:17 PM",
      category: "Academic",
      content: "The Mid-Term Semester Examinations for Sem V and Sem VII are scheduled from September 22 to September 28, 2026. All students must complete and submit their certified practical lab manuals to their respective subject incharges prior to September 20, 2026. Attendance in mid-term exams is mandatory.",
      icon: BookOpen,
      iconBg: "bg-[#e8f1ff]",
      iconColor: "text-[#2866d5]",
      tagBg: "bg-[#dcf7e3]",
      tagColor: "text-[#149b52]",
    },
    {
      id: "n-volleyball",
      title: "Volleyball Selection Trials for Inter-College Tournament",
      department: "Sports Cell / Student Council",
      date: "Sep 8, 2026, 2:55 AM",
      category: "Urgent",
      content: "Selection trials for the College Men's & Women's Volleyball Teams will take place on Thursday at 3:30 PM in the college sports ground. Interested students should report in sports uniform with college ID cards to the Physical Education Director.",
      icon: CalendarCheck,
      iconBg: "bg-[#ffe8ee]",
      iconColor: "text-[#ef3155]",
      tagBg: "bg-[#ffe1e7]",
      tagColor: "text-[#e52f50]",
    },
    {
      id: "n-exam",
      title: "Exam Timetable & Hall Ticket Release Notice",
      department: "Examination Cell",
      date: "Sep 7, 2026",
      category: "Urgent",
      content: "The official timetable for End-Semester Theory & Practical examinations has been published. Students can download their digital hall tickets from the student portal starting Monday. Ensure all library dues and fee clearances are completed.",
      icon: CalendarCheck,
      iconBg: "bg-[#ffe8ee]",
      iconColor: "text-[#ef3155]",
      tagBg: "bg-[#ffe1e7]",
      tagColor: "text-[#e52f50]",
    },
    {
      id: "n-fest",
      title: "College Cultural & Technical Fest Registration Open",
      department: "Student Council",
      date: "Sep 6, 2026",
      category: "Event",
      content: "Annual Inter-College Fest 'Innovision 2026' registration is now open! Participate in coding contests, robotics wars, paper presentations, music, and dance events. Contact your class representatives or visit the registration booth in the main atrium.",
      icon: PartyPopper,
      iconBg: "bg-[#fff3db]",
      iconColor: "text-[#f4a11f]",
      tagBg: "bg-[#ffedd3]",
      tagColor: "text-[#e89417]",
    },
  ];

  const notices = noticesList.length > 0 ? noticesList : defaultNotices;

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/student/dashboard" },
    { label: "AI Tutor", icon: Bot, href: "/student/ai-tutor" },
    { label: "Notices", icon: Bell, href: "/student/notices", active: true },
    { label: "Materials", icon: FileText, href: "/student/materials" },
    { label: "Timetable", icon: CalendarDays, href: "/student/timetable" },
    { label: "Assignments", icon: ClipboardList, href: "/student/assignments" },
    { label: "Progress", icon: FileCheck2, href: "/student/progress" },
    { label: "Settings", icon: Settings, href: "/student/settings" },
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || notice.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getNoticeBody = (notice: any) => {
    if (notice.content && notice.content.length > 20) {
      return notice.content;
    }
    return `This is an official administrative notice issued by the ${notice.department} regarding ${notice.title}. All concerned students are instructed to strictly comply with the guidelines, schedules, and submission deadlines mentioned in this official circular. Failure to adhere to the directives may attract academic disciplinary action as per college regulations.`;
  };

  return (
    <main className={`h-screen overflow-hidden p-2 sm:p-3 ${darkMode ? "bg-[#11182b]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex h-full max-w-[1550px] overflow-hidden rounded-[20px] border ${darkMode ? "border-slate-700 bg-[#18223a]" : "border-[#dce7f8] bg-white"} shadow-sm`}>
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

          <nav className="flex-1 overflow-y-auto px-4">
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

        <section className="min-w-0 flex-1 flex flex-col">
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={userName}
            searchPlaceholder="Search notices..."
            searchValue={search}
            onSearchChange={setSearch}
          />

          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="mb-6 flex gap-3 overflow-x-auto">
              {["All", "Urgent", "Academic", "Event", "General"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-[14px] font-medium transition ${
                    activeTab === tab
                      ? "bg-[#4334d8] text-white shadow-sm"
                      : darkMode
                      ? "bg-[#1f2c4d] text-slate-300 hover:bg-slate-700"
                      : "bg-[#f0f4fd] text-[#55647a] hover:bg-[#e2ebfa]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {filteredNotices.map((notice, idx) => {
                const NoticeIcon = notice.icon || Bell;
                return (
                  <div
                    key={notice.id || idx}
                    onClick={() => setSelectedNotice(notice)}
                    className={`group flex items-center justify-between rounded-[18px] border p-5 cursor-pointer transition hover:shadow-md ${
                      darkMode
                        ? "border-slate-700 bg-[#1f2c4d] hover:border-indigo-500/50"
                        : "border-[#e5edf9] bg-white hover:border-indigo-300"
                    } shadow-sm`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${notice.iconBg} ${notice.iconColor}`}>
                        <NoticeIcon size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className={`text-[16px] font-bold ${darkMode ? "text-white group-hover:text-indigo-400" : "text-[#101c43] group-hover:text-[#4334d8]"} transition`}>
                            {notice.title}
                          </h3>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${notice.tagBg} ${notice.tagColor}`}>
                            {notice.category}
                          </span>
                        </div>
                        <p className={`text-[13px] mt-0.5 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                          {notice.department} • {notice.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {notice.downloadUrl && notice.downloadUrl !== "#" && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <FileDown size={14} /> Attachment
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNotice(notice);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 px-4 py-2 text-[13px] font-bold text-[#4334d8] dark:text-indigo-300 group-hover:bg-[#4334d8] group-hover:text-white transition"
                      >
                        Read Notice <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================
          OFFICIAL NOTICE PDF VIEWER MODAL
      ========================================================= */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 overflow-hidden">
            
            {/* MODAL CONTROL HEADER (Hidden when printing) */}
            <div className="no-print-bar flex items-center justify-between border-b border-slate-700 bg-slate-800/90 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold">
                  PDF
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Official College Circular PDF Document</h3>
                  <p className="text-xs text-slate-400">Issued by {selectedNotice.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedNotice.downloadUrl && selectedNotice.downloadUrl !== "#" && (
                  <a
                    href={selectedNotice.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                  >
                    <Download size={14} /> Attachment
                  </a>
                )}
                <button
                  onClick={() =>
                    downloadNoticePdf({
                      id: selectedNotice.id,
                      title: selectedNotice.title,
                      department: selectedNotice.department,
                      date: selectedNotice.date,
                      category: selectedNotice.category,
                      content: selectedNotice.content,
                    })
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                  title="Download genuine PDF notice"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-[#4334d8] px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition shadow-md"
                >
                  <Printer size={15} /> Print Notice
                </button>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL PDF NOTICE DOCUMENT */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center items-start">
              <div
                id="printable-notice-pdf"
                className="w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded-2xl p-8 sm:p-12 border border-slate-200 font-serif leading-relaxed text-left relative my-4"
              >
                {/* WATERMARK */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
                  <div className="text-center font-bold text-9xl tracking-widest text-slate-900 uppercase">
                    OFFICIAL<br/>NOTICE
                  </div>
                </div>

                {/* COLLEGE HEADER */}
                <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                  <div className="flex justify-center items-center gap-3 mb-2">
                    <Building2 className="h-9 w-9 text-slate-900" />
                    <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 font-sans uppercase">
                      AI COLLEGE OF ENGINEERING & TECHNOLOGY
                    </h1>
                  </div>
                  <p className="text-[11px] font-sans font-bold text-slate-700 uppercase tracking-widest">
                    (Approved by AICTE, New Delhi & Affiliated to University of Mumbai)
                  </p>
                  <p className="text-[11px] font-sans text-slate-600">
                    Knowledge City, Sector 10, Airoli, Navi Mumbai - 400708 | Website: www.aicet.edu.in
                  </p>
                </div>

                {/* REF NO & DATE ROW */}
                <div className="flex justify-between items-center text-xs font-sans font-bold text-slate-800 border-b border-slate-300 pb-3 mb-6">
                  <span>Ref No: AICET/CIRCULAR/2026/{(selectedNotice.id || "01").replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}</span>
                  <span>Date: {selectedNotice.date}</span>
                </div>

                {/* NOTICE TITLE BANNER */}
                <div className="text-center my-6">
                  <h2 className="text-xl font-extrabold tracking-widest text-slate-900 font-sans underline decoration-2 underline-offset-4 uppercase">
                    OFFICIAL CIRCULAR / NOTICE
                  </h2>
                </div>

                {/* METADATA SUMMARY TABLE */}
                <div className="bg-slate-50 border border-slate-300 rounded-md p-4 mb-6 text-xs font-sans space-y-1.5">
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Subject / Purpose</span>
                    <span>:</span>
                    <span className="font-bold text-slate-900">{selectedNotice.title}</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Issuing Authority</span>
                    <span>:</span>
                    <span className="text-slate-900">{selectedNotice.department}</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Category / Urgency</span>
                    <span>:</span>
                    <span className="font-semibold text-indigo-700 uppercase">{selectedNotice.category}</span>
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr]">
                    <span className="font-bold text-slate-700">Target Audience</span>
                    <span>:</span>
                    <span className="text-slate-900">All Students & Faculty Members</span>
                  </div>
                </div>

                {/* NOTICE CONTENT BODY */}
                <div className="my-8 text-sm text-slate-800 space-y-4 font-sans leading-relaxed text-justify">
                  <p className="font-semibold text-slate-900">Dear Students,</p>
                  
                  <p className="whitespace-pre-line">
                    {getNoticeBody(selectedNotice)}
                  </p>

                  <div className="bg-amber-50/60 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-900 font-sans my-4">
                    <strong>Important Note:</strong> All students must strictly adhere to the guidelines and schedules mentioned above. Any delay or non-compliance will be viewed seriously by the institution authorities.
                  </div>
                </div>

                {/* ATTACHMENT PROMPT IF AVAILABLE */}
                {selectedNotice.downloadUrl && selectedNotice.downloadUrl !== "#" && (
                  <div className="my-6 border border-dashed border-slate-400 p-3 rounded-lg bg-slate-50 flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-slate-700">📄 Attached File: {selectedNotice.downloadUrl.split("/").pop()}</span>
                    <a
                      href={selectedNotice.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#4334d8] hover:underline"
                    >
                      Download Document →
                    </a>
                  </div>
                )}

                {/* OFFICIAL SIGNATURE & STAMP FOOTER */}
                <div className="mt-16 pt-8 border-t border-slate-300 flex justify-between items-end font-sans">
                  <div className="text-left text-xs text-slate-600">
                    <div className="inline-block border-2 border-indigo-900 text-indigo-900 font-bold p-2 rounded text-[10px] uppercase tracking-wider mb-2 opacity-80 rotate-[-5deg]">
                      AICET EXAM CELL<br/>SEALED & APPROVED
                    </div>
                    <p>Copy to:</p>
                    <p>1. Dean Academic Affairs</p>
                    <p>2. Notice Boards & Student Portal</p>
                  </div>

                  <div className="text-right text-xs font-sans text-slate-900">
                    <div className="h-12 flex items-end justify-end pb-1 font-signature text-lg text-indigo-950 italic font-bold">
                      Dr. S. K. Mahajan
                    </div>
                    <p className="font-extrabold uppercase text-slate-900">Principal / Controller of Exams</p>
                    <p className="text-slate-600">AI College of Engineering & Technology</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* PRINT MEDIA STYLES FOR CLEAN PDF GENERATION */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-notice-pdf, #printable-notice-pdf * {
            visibility: visible;
          }
          #printable-notice-pdf {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 20px !important;
          }
          .no-print-bar {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}