"use client";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { useState, useEffect } from "react";
import StudentHeader from "@/components/StudentHeader";
import {
  Home,
  Bot,
  Bell,
  FileText,
  CalendarDays,
  ClipboardList,
  ChartNoAxesCombined,
  Settings,
  ChevronDown,
  CalendarCheck,
  Coffee,
  Utensils,
  Laptop,
  Moon,
  HelpCircle,
  FileText as DocumentIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  BookOpen,
} from "lucide-react";

export default function Timetable() {
  const [userName, setUserName] = useState("Student");
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode, setDarkMode } = useTheme();
  const [timetableList, setTimetableList] = useState<any[]>([]);
  const [view, setView] = useState<"Today" | "Week" | "Month">("Today");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedMonthDay, setSelectedMonthDay] = useState<number | null>(8);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Student");

    fetch("/api/student/timetable")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.timetable && data.timetable.length > 0) {
          setTimetableList(data.timetable);
        }
      })
      .catch((err) => console.error("Failed to fetch timetable:", err));
  }, []);

  const filterSlot = (slot: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (slot.subject && slot.subject.toLowerCase().includes(q)) ||
      (slot.room && slot.room.toLowerCase().includes(q)) ||
      (slot.time && slot.time.toLowerCase().includes(q)) ||
      (slot.slot && slot.slot.toLowerCase().includes(q)) ||
      (slot.day && slot.day.toLowerCase().includes(q))
    );
  };

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const defaultWeeklySchedule: Record<string, any[]> = {
    Monday: [
      { time: "09:00 – 10:00", subject: "Artificial Intelligence", room: "Room 101", iconType: "calendar", iconBg: "bg-[#d8f8ef]", iconColor: "text-[#13ae87]" },
      { time: "10:00 – 11:00", subject: "Database Management Systems", room: "Room 102", iconType: "doc", iconBg: "bg-[#eee0ff]", iconColor: "text-[#8635dc]" },
      { time: "11:00 – 11:30", subject: "Recess Break", room: "Cafeteria", iconType: "coffee", iconBg: "bg-[#fff0d6]", iconColor: "text-[#f4a321]" },
      { time: "11:30 – 12:30", subject: "Natural Language Processing", room: "Room 103", iconType: "doc", iconBg: "bg-[#eee0ff]", iconColor: "text-[#8635dc]" },
      { time: "12:30 – 01:30", subject: "Lunch Break", room: "Dining Hall", iconType: "utensils", iconBg: "bg-[#e2eefc]", iconColor: "text-[#3970b7]" },
      { time: "02:00 – 03:00", subject: "Machine Learning", room: "Room 104", iconType: "doc", iconBg: "bg-[#e2ecff]", iconColor: "text-[#2167d7]" },
      { time: "03:00 – 04:00", subject: "Web Technology Lab", room: "Lab 5", iconType: "laptop", iconBg: "bg-[#fff0d6]", iconColor: "text-[#f19b18]" },
    ],
    Tuesday: [
      { time: "09:00 – 10:00", subject: "Operating Systems", room: "Room 201", iconType: "doc", iconBg: "bg-[#e2ecff]", iconColor: "text-[#2167d7]" },
      { time: "10:00 – 11:00", subject: "Computer Networks", room: "Room 202", iconType: "calendar", iconBg: "bg-[#d8f8ef]", iconColor: "text-[#13ae87]" },
      { time: "11:30 – 12:30", subject: "Cloud Computing", room: "Room 203", iconType: "doc", iconBg: "bg-[#eee0ff]", iconColor: "text-[#8635dc]" },
      { time: "02:00 – 04:00", subject: "AI & ML Practical Lab", room: "Lab 3", iconType: "laptop", iconBg: "bg-[#fff0d6]", iconColor: "text-[#f19b18]" },
    ],
    Wednesday: [
      { time: "09:00 – 10:00", subject: "Data Structures & Algorithms", room: "Room 101", iconType: "doc", iconBg: "bg-[#eee0ff]", iconColor: "text-[#8635dc]" },
      { time: "10:00 – 11:00", subject: "Software Engineering", room: "Room 102", iconType: "calendar", iconBg: "bg-[#d8f8ef]", iconColor: "text-[#13ae87]" },
      { time: "11:30 – 12:30", subject: "Cybersecurity Fundamentals", room: "Room 103", iconType: "doc", iconBg: "bg-[#e2ecff]", iconColor: "text-[#2167d7]" },
      { time: "02:00 – 03:30", subject: "DBMS Mini Project Review", room: "Lab 1", iconType: "laptop", iconBg: "bg-[#fff0d6]", iconColor: "text-[#f19b18]" },
    ],
    Thursday: [
      { time: "09:00 – 10:00", subject: "Database Management Systems", room: "Room 102", iconType: "doc", iconBg: "bg-[#eee0ff]", iconColor: "text-[#8635dc]" },
      { time: "10:00 – 11:00", subject: "Machine Learning", room: "Room 104", iconType: "calendar", iconBg: "bg-[#d8f8ef]", iconColor: "text-[#13ae87]" },
      { time: "11:30 – 12:30", subject: "Web Technology", room: "Room 105", iconType: "laptop", iconBg: "bg-[#fff0d6]", iconColor: "text-[#f19b18]" },
      { time: "02:00 – 04:00", subject: "Full Stack Web Lab", room: "Lab 5", iconType: "laptop", iconBg: "bg-[#fff0d6]", iconColor: "text-[#f19b18]" },
    ],
    Friday: [
      { time: "09:00 – 10:00", subject: "Natural Language Processing", room: "Room 103", iconType: "doc", iconBg: "bg-[#eee0ff]", iconColor: "text-[#8635dc]" },
      { time: "10:00 – 11:00", subject: "Artificial Intelligence", room: "Room 101", iconType: "calendar", iconBg: "bg-[#d8f8ef]", iconColor: "text-[#13ae87]" },
      { time: "11:30 – 12:30", subject: "Research Seminar", room: "Seminar Hall A", iconType: "doc", iconBg: "bg-[#e2ecff]", iconColor: "text-[#2167d7]" },
      { time: "02:00 – 03:30", subject: "Sports & Club Activity", room: "College Ground", iconType: "coffee", iconBg: "bg-[#fff0d6]", iconColor: "text-[#f4a321]" },
    ],
    Saturday: [
      { time: "09:30 – 11:30", subject: "HackNova 2026 Mentorship", room: "Auditorium", iconType: "calendar", iconBg: "bg-[#d8f8ef]", iconColor: "text-[#13ae87]" },
      { time: "11:30 – 01:00", subject: "Library Self-Study", room: "Central Library", iconType: "doc", iconBg: "bg-[#eee0ff]", iconColor: "text-[#8635dc]" },
    ],
  };

  const getEntriesForDay = (day: string) => {
    const apiDayEntries = timetableList.filter((slot) => slot.day === day);
    if (apiDayEntries.length > 0) return apiDayEntries;
    return defaultWeeklySchedule[day] || [];
  };

  const groupedEntries = weekDays.map((day) => ({
    day,
    entries: getEntriesForDay(day).filter(filterSlot),
  }));

  const todayEntries = getEntriesForDay(selectedDay).filter(filterSlot);

  // Month Calendar Events (September 2026)
  const monthEvents: Record<number, { title: string; color: string; type?: string }> = {
    4: { title: "Orientation Day", color: "bg-blue-500 text-white" },
    8: { title: "Today (4 Classes)", color: "bg-emerald-500 text-white", type: "today" },
    12: { title: "Hackathon Intro", color: "bg-purple-500 text-white" },
    15: { title: "DBMS Assignment Due", color: "bg-amber-500 text-white" },
    20: { title: "HackNova Deadline", color: "bg-[#3934d8] text-white" },
    22: { title: "Mid-Term Exam Start", color: "bg-red-500 text-white" },
    25: { title: "Mid-Term Exam Day 4", color: "bg-red-500 text-white" },
    28: { title: "Mid-Term Exam Ends", color: "bg-red-500 text-white" },
    30: { title: "Lab Manual Submission", color: "bg-indigo-600 text-white" },
  };

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/student/dashboard" },
    { label: "AI Tutor", icon: Bot, href: "/student/ai-tutor" },
    { label: "Notices", icon: Bell, href: "/student/notices" },
    { label: "Materials", icon: FileText, href: "/student/materials" },
    { label: "Timetable", icon: CalendarDays, href: "/student/timetable", active: true },
    { label: "Assignments", icon: ClipboardList, href: "/student/assignments" },
    { label: "Progress", icon: ChartNoAxesCombined, href: "/student/progress" },
    { label: "Settings", icon: Settings, href: "/student/settings" },
  ];

  return (
    <main
      className={`h-screen overflow-hidden p-2 sm:p-3 transition-colors ${
        darkMode ? "bg-[#11182b]" : "bg-[#edf3ff]"
      }`}
    >
      <div
        className={`mx-auto flex h-full max-w-[1550px] overflow-hidden rounded-[20px] border shadow-[0_10px_40px_rgba(40,75,130,0.08)] transition-colors ${
          darkMode
            ? "border-slate-700 bg-[#18223a]"
            : "border-[#dce7f8] bg-white"
        }`}
      >
        {/* SIDEBAR */}
        <aside
          className={`hidden w-[325px] shrink-0 flex-col border-r lg:flex ${
            darkMode
              ? "border-slate-700 bg-[#17223a]"
              : "border-[#e5edf9] bg-[#fbfdff]"
          }`}
        >
          {/* LOGO */}
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

          {/* NAVIGATION */}
          <nav className="flex-1 px-4">
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

            {/* WORKING HELP & SUPPORT BUTTON */}
            <button
              onClick={() => setHelpModalOpen(true)}
              title="Help & Support"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  : "border-slate-200 bg-[#edf3ff] text-[#17234b] hover:bg-indigo-100"
              }`}
            >
              <HelpCircle size={22} />
            </button>
          </div>
        </aside>

        {/* MAIN SECTION */}
        <section className="min-w-0 flex-1 flex flex-col">
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={userName}
            searchPlaceholder="Search timetable by subject, room, time..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* PAGE CONTENT */}
          <div className={`flex-1 min-h-0 flex flex-col overflow-hidden px-5 pb-4 pt-4 sm:px-8 ${darkMode ? "bg-[#18223a]" : "bg-white"}`}>
            <h2 className={`text-[29px] font-bold tracking-tight shrink-0 ${darkMode ? "text-white" : "text-[#101d46]"}`}>
              Timetable & Academic Schedule
            </h2>

            {/* TABS */}
            <div className="mt-3 flex max-w-[650px] gap-3 shrink-0">
              {(["Today", "Week", "Month"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setView(item)}
                  className={`flex h-[44px] flex-1 items-center justify-center rounded-full text-[15px] font-semibold transition ${
                    view === item
                      ? "bg-gradient-to-r from-[#4f35df] to-[#6c42eb] text-white shadow-[0_5px_15px_rgba(82,54,220,0.18)]"
                      : darkMode
                      ? "border border-slate-600 bg-[#202d49] text-slate-300 hover:bg-slate-700/60"
                      : "border border-[#dce6f4] bg-[#f5f8fd] text-[#6680a6] hover:bg-indigo-50/50"
                  }`}
                >
                  {item} View
                </button>
              ))}
            </div>

            {/* DAY SELECTOR (For Today View) */}
            {view === "Today" && (
              <div className="mt-3 flex gap-2 overflow-x-auto shrink-0 pb-1">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      selectedDay === day
                        ? "bg-[#3934d8] text-white shadow-sm"
                        : darkMode
                        ? "bg-[#202d49] text-slate-300 hover:bg-slate-700/50"
                        : "bg-[#f0f4fd] text-[#6680a6] hover:bg-indigo-50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}

            {/* MAIN TIMETABLE CONTAINER */}
            <div className={`mt-4 flex-1 min-h-0 flex flex-col overflow-hidden rounded-[18px] border shadow-[0_5px_20px_rgba(36,74,130,0.05)] ${darkMode ? "border-slate-700 bg-[#202d49]" : "border-[#dce6f4] bg-white"}`}>
              
              {/* HEADER ROW */}
              <div className={`flex h-[75px] shrink-0 items-center justify-between border-b px-5 sm:px-7 ${darkMode ? "border-slate-700" : "border-[#e6edf7]"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#e7f8fc] text-[#16aeb9]">
                    <CalendarCheck size={24} />
                  </div>
                  <div>
                    <p className={`text-[16px] font-bold ${darkMode ? "text-white" : "text-[#152348]"}`}>
                      {view === "Today" ? `${selectedDay} Schedule` : view === "Week" ? "Weekly Class Overview" : "September 2026 Academic Calendar"}
                    </p>
                    <p className="text-xs text-[#6680a6]">
                      {view === "Today" ? `${todayEntries.length} lectures & labs` : view === "Week" ? "All 6 days lecture slots" : "Monthly events & exams"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {view === "Week" && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-500">
                      <Clock size={14} /> Full Week View
                    </span>
                  )}
                  {view === "Month" && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <ChevronLeft size={16} className="cursor-pointer hover:text-white" />
                      <span>September 2026</span>
                      <ChevronRight size={16} className="cursor-pointer hover:text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* =====================================================
                  1. TODAY VIEW
              ===================================================== */}
              {view === "Today" && (
                <div className="space-y-3.5 overflow-y-auto p-4 sm:p-6 flex-1">
                  {todayEntries.length === 0 ? (
                    <div className="py-12 text-center">
                      <BookOpen size={36} className="mx-auto text-slate-400 mb-2" />
                      <p className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>No classes matching "{searchQuery}" on {selectedDay}</p>
                    </div>
                  ) : (
                    todayEntries.map((slot, idx) => (
                      <TimetableRow
                        key={slot.id || idx}
                        time={slot.time}
                        subject={slot.subject}
                        room={slot.room}
                        icon={
                          slot.iconType === "calendar" ? <CalendarCheck size={22} /> :
                          slot.iconType === "coffee" ? <Coffee size={22} /> :
                          slot.iconType === "utensils" ? <Utensils size={22} /> :
                          slot.iconType === "laptop" ? <Laptop size={22} /> :
                          <DocumentIcon size={22} />
                        }
                        iconBg={slot.iconBg || "bg-[#eee0ff]"}
                        iconColor={slot.iconColor || "text-[#8635dc]"}
                        darkMode={darkMode}
                      />
                    ))
                  )}
                </div>
              )}

              {/* =====================================================
                  2. WEEK VIEW (PROPER GRID LAYOUT)
              ===================================================== */}
              {view === "Week" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedEntries.map((group) => (
                      <div
                        key={group.day}
                        className={`rounded-2xl border p-4 transition ${
                          darkMode ? "border-slate-700/70 bg-[#19243d]" : "border-[#e3edf9] bg-[#fbfdff]"
                        } shadow-sm`}
                      >
                        <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-200 dark:border-slate-700/60">
                          <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#14224a]"}`}>
                            {group.day}
                          </h3>
                          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-500">
                            {group.entries.length} Classes
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {group.entries.length === 0 ? (
                            <p className="text-xs italic text-slate-400 py-3 text-center">No classes scheduled</p>
                          ) : (
                            group.entries.map((slot, idx) => (
                              <div
                                key={idx}
                                className={`rounded-xl border p-3 text-xs transition hover:shadow-md ${
                                  darkMode
                                    ? "border-slate-700 bg-[#202d49] text-white"
                                    : "border-[#e3edf9] bg-white text-slate-800"
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold text-indigo-600 dark:text-indigo-400">
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} /> {slot.time}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-normal">📍 {slot.room}</span>
                                </div>
                                <div className="mt-1 font-bold text-[13px] line-clamp-1">{slot.subject}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =====================================================
                  3. MONTH VIEW (PROPER CALENDAR GRID)
              ===================================================== */}
              {view === "Month" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {/* CALENDAR DAYS OF WEEK HEADER */}
                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs py-2 text-slate-500 dark:text-slate-400 border-b border-slate-700/30 mb-2">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>

                  {/* 30 DAYS GRID */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty offset for Tuesday start (Sep 1) */}
                    <div className="h-20 rounded-xl bg-transparent opacity-0"></div>

                    {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                      const event = monthEvents[dayNum];
                      const isSelected = selectedMonthDay === dayNum;
                      const isToday = dayNum === 8;

                      return (
                        <div
                          key={dayNum}
                          onClick={() => setSelectedMonthDay(dayNum)}
                          className={`min-h-[75px] rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition ${
                            isToday
                              ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/40"
                              : isSelected
                              ? "border-indigo-500 bg-indigo-500/10"
                              : darkMode
                              ? "border-slate-700/60 bg-[#1c2944] hover:bg-slate-700/50"
                              : "border-[#e3edf9] bg-white hover:bg-indigo-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isToday ? "text-emerald-600 dark:text-emerald-400" : darkMode ? "text-slate-200" : "text-slate-700"}`}>
                              {dayNum}
                            </span>
                            {isToday && (
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                          </div>

                          {event ? (
                            <span className={`mt-1 rounded px-1.5 py-0.5 text-[10px] font-bold line-clamp-1 ${event.color}`}>
                              {event.title}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {dayNum % 7 === 0 || dayNum % 7 === 6 ? "Weekend" : "Regular Class"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </div>

      {/* =========================================================
          WORKING HELP & SUPPORT MODAL (Activated by ? button)
      ========================================================= */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl ${darkMode ? "border-slate-700 bg-[#18243e] text-white" : "border-[#e2ebf8] bg-white text-gray-800"}`}>
            <div className="flex items-center justify-between border-b pb-4 border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 font-bold">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold">Help & Support Assistant</h3>
                  <p className="text-xs text-slate-400">Quick answers to student portal questions</p>
                </div>
              </div>
              <button onClick={() => setHelpModalOpen(false)} className="rounded-lg p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="my-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              <div className={`rounded-xl p-3.5 border ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-gray-100 bg-gray-50"}`}>
                <h4 className="text-xs font-bold text-indigo-500 mb-1">📅 How do I view my daily class schedule?</h4>
                <p className="text-xs leading-relaxed text-slate-400">Navigate to the Timetable page and use the Day pill buttons (Monday to Saturday) or switch between Today, Week, and Month views.</p>
              </div>

              <div className={`rounded-xl p-3.5 border ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-gray-100 bg-gray-50"}`}>
                <h4 className="text-xs font-bold text-indigo-500 mb-1">🔍 How does the header search bar work?</h4>
                <p className="text-xs leading-relaxed text-slate-400">Type any subject, room name, time slot, or assignment topic into the top search bar to filter your page items in real time.</p>
              </div>

              <div className={`rounded-xl p-3.5 border ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-gray-100 bg-gray-50"}`}>
                <h4 className="text-xs font-bold text-indigo-500 mb-1">📄 How do I view official notice PDFs?</h4>
                <p className="text-xs leading-relaxed text-slate-400">Go to the Notices section and click "Read Notice →". This opens an official college circular PDF document which you can view or download.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <Link
                href="/student/settings#help-support"
                onClick={() => setHelpModalOpen(false)}
                className="text-xs font-bold text-indigo-500 hover:underline"
              >
                Go to Full Settings & Support Page →
              </Link>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="rounded-xl bg-[#4334d8] px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   TIMETABLE ROW
============================================================ */

function TimetableRow({
  time,
  subject,
  room,
  icon,
  iconBg,
  iconColor,
  darkMode,
}: {
  time: string;
  subject: string;
  room: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  darkMode: boolean;
}) {
  return (
    <div className="grid grid-cols-[210px_1fr] items-center">
      <div
        className={`flex h-[64px] items-center rounded-l-[17px] border px-5 ${
          darkMode
            ? "border-slate-700 bg-[#1c2944]"
            : "border-[#e3ebf6] bg-white"
        }`}
      >
        <p className={`text-[14px] font-bold ${darkMode ? "text-slate-300" : "text-[#6580a8]"}`}>
          {time}
        </p>
      </div>

      <div
        className={`flex h-[64px] items-center justify-between rounded-r-[17px] border border-l-0 px-5 ${
          darkMode
            ? "border-slate-700 bg-[#202d49]"
            : "border-[#e3ebf6] bg-[#fbfcff]"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] ${iconBg} ${iconColor}`}>
            {icon}
          </div>
          <p className={`text-[15px] font-bold ${darkMode ? "text-white" : "text-[#132348]"}`}>
            {subject}
          </p>
        </div>

        <p className={`text-[13px] font-bold ${darkMode ? "text-slate-300" : "text-[#6680a6]"}`}>
          📍 {room}
        </p>
      </div>
    </div>
  );
}