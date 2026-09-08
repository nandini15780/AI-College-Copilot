"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import {
  Bell,
  Bot,
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Moon,
  CircleHelp,
  Plus,
  Settings,
  Clock,
  MapPin,
  Users,
  Trash2,
  Calendar,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FacultyTimetablePage() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState("Faculty");
  const [userProfileImage, setUserProfileImage] = useState<string>("");
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [activeTab, setActiveTab] = useState<"Today" | "Week">("Today");

  // Form State
  const [day, setDay] = useState("Monday");
  const [slot, setSlot] = useState("10:00 AM – 11:00 AM");
  const [subject, setSubject] = useState("DBMS");
  const [room, setRoom] = useState("Room 302");
  const [batch, setBatch] = useState("CSE-7A");
  const [submitting, setSubmitting] = useState(false);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const defaultFacultySchedule = [
    { id: "f1", day: "Monday", slot: "10:00 AM – 11:00 AM", subject: "Database Management Systems (DBMS)", room: "Room 302", batch: "CSE-7A", color: "from-indigo-600 to-blue-500" },
    { id: "f2", day: "Monday", slot: "11:30 AM – 12:30 PM", subject: "AI & Machine Learning Lab", room: "Lab 4", batch: "CSE-7B", color: "from-purple-600 to-indigo-500" },
    { id: "f3", day: "Tuesday", slot: "09:00 AM – 10:00 AM", subject: "Operating Systems (OS)", room: "Room 105", batch: "CSE-5A", color: "from-emerald-600 to-teal-500" },
    { id: "f4", day: "Wednesday", slot: "02:00 PM – 03:00 PM", subject: "Computer Networks & Security", room: "Seminar Hall A", batch: "CSE-7A", color: "from-amber-600 to-orange-500" },
    { id: "f5", day: "Thursday", slot: "10:00 AM – 11:00 AM", subject: "DBMS Mini Project Review", room: "Lab 2", batch: "CSE-7A", color: "from-[#6651ee] to-[#3023a5]" },
    { id: "f6", day: "Friday", slot: "11:30 AM – 12:30 PM", subject: "Full Stack Web Development", room: "Lab 5", batch: "CSE-7B", color: "from-cyan-600 to-blue-600" },
  ];

  const fetchTimetable = async () => {
    try {
      const res = await fetch("/api/faculty/dashboard");
      const data = await res.json();
      if (data.timetable && data.timetable.length > 0) {
        setEntries(data.timetable);
      } else {
        setEntries(defaultFacultySchedule);
      }
    } catch {
      setEntries(defaultFacultySchedule);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "Faculty" && role !== "Admin") router.replace("/login");
    setUserName(localStorage.getItem("userName") || "Faculty");
    const savedImg = localStorage.getItem("userProfileImage_Faculty");
    if (savedImg) setUserProfileImage(savedImg);

    fetchTimetable();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/faculty/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "timetable", data: { day, slot, subject, room, batch } }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchTimetable();
        setSelectedDay(day);
      }
    } catch (err) {
      console.error("Failed to save slot:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfileImage_Faculty");
    router.push("/login");
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filterEntry = (e: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (e.subject && e.subject.toLowerCase().includes(q)) ||
      (e.room && e.room.toLowerCase().includes(q)) ||
      (e.slot && e.slot.toLowerCase().includes(q)) ||
      (e.batch && e.batch.toLowerCase().includes(q)) ||
      (e.day && e.day.toLowerCase().includes(q))
    );
  };

  const filteredEntries = entries.filter((e) => e.day === selectedDay && filterEntry(e));

  return (
    <main className={`min-h-screen p-3 ${darkMode ? "bg-[#111827]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[24px] border ${darkMode ? "border-[#263248] bg-[#172033]" : "border-white bg-[#f8fbff]"}`}>
        
        {/* Sidebar */}
        <aside className={`hidden w-[280px] flex-col justify-between border-r p-5 lg:flex ${darkMode ? "border-[#263248] bg-[#172033]" : "border-[#e1e8f5] bg-[#f8fbff]"}`}>
          <div className="w-full flex flex-col justify-between h-full">
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
                <SidebarLink href="/faculty/assignments" label="Assignments" icon={<ClipboardList size={18} />} darkMode={darkMode} />
                <SidebarLink href="/faculty/timetable" label="Timetable" icon={<CalendarDays size={18} />} active darkMode={darkMode} />
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

        {/* Main Section */}
        <section className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className={`flex items-center justify-between border-b px-6 py-4 ${darkMode ? "border-[#263248] bg-[#1a2438]" : "border-[#edf0f6] bg-white"}`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-indigo-400/40 bg-[#6651ee]/20 flex items-center justify-center text-[#6651ee] font-bold">
                {userProfileImage ? (
                  <img src={userProfileImage} alt="Faculty Profile" className="h-full w-full object-cover" />
                ) : (
                  <CalendarDays size={20} />
                )}
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Faculty Timetable & Class Schedule</h1>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage lecture slots, lab timings, and classroom schedules</p>
              </div>
            </div>

            {/* Header Search Bar */}
            <div className={`hidden md:flex h-[38px] w-[320px] items-center gap-2.5 rounded-xl border px-3 text-xs ${darkMode ? "border-slate-700 bg-slate-800/80 text-white" : "border-slate-200 bg-white text-slate-800"}`}>
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search schedule, subject, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-3">
              {/* Profile Section Pill */}
              <div className="flex items-center gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5">
                <div className="h-8 w-8 overflow-hidden rounded-full border border-indigo-400/40 bg-[#6651ee]/20 flex items-center justify-center text-[#6651ee] font-bold">
                  {userProfileImage ? (
                    <img src={userProfileImage} alt="Faculty Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-[#6651ee]">F</span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className={`text-xs font-bold leading-tight ${darkMode ? "text-white" : "text-[#152653]"}`}>{userName}</p>
                  <p className="text-[10px] text-indigo-400 font-medium">Faculty</p>
                </div>
              </div>

              <button onClick={() => setDarkMode(!darkMode)} className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white" : "border-[#e3e8f2] bg-white text-[#263b64]"}`}><Moon size={18} /></button>
              <Link href="/faculty/settings#help-support" title="Help & Support" className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white hover:bg-slate-700" : "border-[#e3e8f2] bg-white text-[#263b64] hover:bg-indigo-50"}`}><CircleHelp size={18} /></Link>
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20"><LogOut size={16} /> Logout</button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* DAY TABS & VIEW TOGGLE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {weekDays.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      selectedDay === d
                        ? "bg-[#6651ee] text-white shadow-md"
                        : darkMode
                        ? "border border-[#324364] bg-[#202d47] text-slate-300 hover:bg-[#283959]"
                        : "border border-[#e2e8f5] bg-white text-slate-700 hover:bg-indigo-50/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-800/20 p-1 border border-slate-700/30">
                <button
                  onClick={() => setActiveTab("Today")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeTab === "Today" ? "bg-[#6651ee] text-white" : "text-slate-400"}`}
                >
                  Day View
                </button>
                <button
                  onClick={() => setActiveTab("Week")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeTab === "Week" ? "bg-[#6651ee] text-white" : "text-slate-400"}`}
                >
                  Weekly View
                </button>
              </div>
            </div>

            {/* ADD TIMETABLE SLOT CARD */}
            <div className={`rounded-2xl border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"} shadow-sm`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6651ee]/10 text-[#6651ee]">
                  <Plus size={18} />
                </div>
                <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Add New Lecture / Lab Slot</h3>
              </div>

              <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Day of Week</label>
                  <select value={day} onChange={(e) => setDay(e.target.value)} className={`w-full rounded-xl border px-3 py-2 text-xs ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`}>
                    {weekDays.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Time Slot</label>
                  <input value={slot} onChange={(e) => setSlot(e.target.value)} placeholder="e.g. 10:00 AM – 11:00 AM" className={`w-full rounded-xl border px-3 py-2 text-xs ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} required />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject Name" className={`w-full rounded-xl border px-3 py-2 text-xs ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} required />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Room / Lab</label>
                  <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 302 or Lab 4" className={`w-full rounded-xl border px-3 py-2 text-xs ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} required />
                </div>

                <div className="flex items-end">
                  <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#6651ee] py-2 text-xs font-bold text-white hover:bg-[#523ed6] transition disabled:opacity-50">
                    <Plus size={14} /> {submitting ? "Saving..." : "Add Slot"}
                  </button>
                </div>
              </form>
            </div>

            {/* SCHEDULE DISPLAY SECTION */}
            {activeTab === "Today" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>
                    Schedule for {selectedDay} ({filteredEntries.length} Slots)
                  </h3>
                </div>

                {filteredEntries.length === 0 ? (
                  <div className={`rounded-2xl border p-8 text-center ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                    <Calendar size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>No classes scheduled for {selectedDay}</p>
                    <p className="text-xs text-slate-400 mt-1">Use the form above to add a lecture or lab timing slot.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEntries.map((entry, idx) => (
                      <div
                        key={entry.id || idx}
                        className={`rounded-2xl border p-5 relative overflow-hidden transition shadow-sm hover:shadow-md ${darkMode ? "border-[#2e3e5c] bg-[#1f2c47]" : "border-[#e5eaf4] bg-white"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#6651ee]">
                            <Clock size={14} />
                            <span>{entry.slot}</span>
                          </div>
                          <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-500">
                            {entry.batch || "CSE-7A"}
                          </span>
                        </div>

                        <h4 className={`mt-3 text-base font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>
                          {entry.subject}
                        </h4>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-700/20 pt-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin size={13} className="text-emerald-500" /> {entry.room}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={13} className="text-indigo-400" /> 60 Students
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* WEEKLY VIEW GRID */
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weekDays.map((d) => {
                  const daySlots = entries.filter((e) => e.day === d);
                  return (
                    <div
                      key={d}
                      className={`rounded-2xl border p-4 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"} shadow-sm`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-700/30 pb-3 mb-3">
                        <span className="font-bold text-sm text-[#6651ee]">{d}</span>
                        <span className="text-xs text-slate-400 font-medium">{daySlots.length} Classes</span>
                      </div>

                      <div className="space-y-2.5">
                        {daySlots.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2">No lectures scheduled</p>
                        ) : (
                          daySlots.map((slotItem, i) => (
                            <div
                              key={slotItem.id || i}
                              className={`rounded-xl border p-3 text-xs ${darkMode ? "border-slate-700/60 bg-[#152033]" : "border-slate-100 bg-[#f8fbff]"}`}
                            >
                              <div className="font-bold text-[#6651ee]">{slotItem.slot}</div>
                              <div className={`font-semibold mt-0.5 ${darkMode ? "text-white" : "text-slate-800"}`}>{slotItem.subject}</div>
                              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                                <span>📍 {slotItem.room}</span>
                                <span>👥 {slotItem.batch || "CSE"}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarLink({ href, label, icon, active, darkMode }: { href: string; label: string; icon: React.ReactNode; active?: boolean; darkMode: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active ? (darkMode ? "bg-[#283556] text-[#6b63ff]" : "bg-[#e9e8ff] text-[#4c56dc]") : (darkMode ? "text-slate-300 hover:bg-[#202c42]" : "text-[#29446f] hover:bg-[#f0f3ff]")}`}>
      {icon}
      {label}
    </Link>
  );
}
