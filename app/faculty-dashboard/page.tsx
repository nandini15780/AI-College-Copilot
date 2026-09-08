"use client";

import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Home,
  Menu,
  Moon,
  CircleHelp,
  Plus,
  Settings,
  Upload,
  UserPlus,
  Users,
  X,
  LogOut,
} from "lucide-react";

const defaultFacultyState = {
  user: { name: "Dr. Mehta", role: "Faculty", email: "faculty@college.edu" },
  stats: {
    totalStudents: 120,
    totalCourses: 6,
    pendingAssignments: 8,
    notices: 4,
  },
  courses: [],
  students: [],
  assignments: [],
  notices: [],
  materials: [],
  recentActivity: [],
  timetable: [],
};

export default function FacultyDashboard() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(defaultFacultyState);
  const [selectedAction, setSelectedAction] = useState<
    "notice" | "material" | "assignment" | "timetable" | null
  >(null);
  const [noticeForm, setNoticeForm] = useState({ title: "", department: "", category: "Academic" });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", due: "", students: "20" });
  const [materialForm, setMaterialForm] = useState({ title: "", type: "PDF" });
  const [noticeFile, setNoticeFile] = useState<File | null>(null);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/faculty/dashboard");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load dashboard");

      if (data.user?.name) {
        localStorage.setItem("userName", data.user.name);
      }

      setDashboardData({
        ...defaultFacultyState,
        ...data,
      });
    } catch {
      setDashboardData(defaultFacultyState);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setDashboardData((prev) => ({
        ...prev,
        user: { ...prev.user, name: storedName },
      }));
    }

    fetchDashboard();
  }, []);

  const handleCreate = async (type: "notice" | "material" | "assignment") => {
    setError("");
    setNotificationMessage("");
    setIsSaving(true);

    let payload: { title: string; department?: string; category?: string; due?: string; students?: number; type?: string };

    if (type === "notice") {
      payload = {
        title: noticeForm.title,
        department: noticeForm.department,
        category: noticeForm.category,
      };

      if (!payload.title || !payload.department) {
        setError("Please complete the required notice fields before saving.");
        setIsSaving(false);
        return;
      }
    } else if (type === "assignment") {
      payload = {
        title: assignmentForm.title,
        due: assignmentForm.due,
        students: Number(assignmentForm.students || 0),
      };

      if (!payload.title || !payload.due) {
        setError("Please complete the assignment title and due date.");
        setIsSaving(false);
        return;
      }
    } else {
      payload = {
        title: materialForm.title,
        type: materialForm.type,
      };

      if (!payload.title || !payload.type) {
        setError("Please provide a valid material title and type.");
        setIsSaving(false);
        return;
      }
    }

    try {
      const selectedFile = type === "notice" ? noticeFile : type === "assignment" ? assignmentFile : materialFile;
      const requestBody = selectedFile
        ? (() => {
            const formData = new FormData();
            formData.append("type", type);
            formData.append("title", payload.title);
            if (payload.department) formData.append("department", payload.department);
            if (payload.category) formData.append("category", payload.category);
            if (payload.due) formData.append("due", payload.due);
            if (payload.students !== undefined) formData.append("students", String(payload.students));
            if (payload.type) formData.append("materialType", payload.type);
            formData.append("file", selectedFile);
            return formData;
          })()
        : JSON.stringify({ type, data: payload });

      const response = await fetch("/api/faculty/dashboard", {
        method: "POST",
        ...(selectedFile ? {} : { headers: { "Content-Type": "application/json" } }),
        body: requestBody,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Create failed");
      }

      if (type === "notice") {
        setNoticeForm({ title: "", department: "", category: "Academic" });
        setNoticeFile(null);
      }
      if (type === "assignment") {
        setAssignmentForm({ title: "", due: "", students: "20" });
        setAssignmentFile(null);
      }
      if (type === "material") {
        setMaterialForm({ title: "", type: "PDF" });
        setMaterialFile(null);
      }

      if (data.emailNotification?.sent) {
        setNotificationMessage(`Saved successfully. Email sent to ${data.emailNotification.recipientCount} student(s).`);
      } else if (data.emailNotification?.configured === false) {
        setNotificationMessage(`Saved successfully, but email was not sent: ${data.emailNotification.reason || "Configure SMTP settings in .env.local."}`);
      } else if (data.emailNotification?.recipientCount === 0) {
        setNotificationMessage("Saved successfully, but no student email addresses are registered.");
      } else {
        setNotificationMessage(`Saved successfully, but email delivery failed: ${data.emailNotification?.reason || "Check the SMTP settings."}`);
      }

      setSelectedAction(null);
      await fetchDashboard();
    } catch (err: any) {
      setError(err.message || "Unable to save data right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const markNoticeRead = async (noticeId: string) => {
    try {
      await fetch("/api/faculty/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markNoticeRead", noticeId }),
      });
      await fetchDashboard();
    } catch (error) {
      console.error("Failed to mark notice as read", error);
    }
  };

  const deleteNotice = async (noticeId: string) => {
    if (!window.confirm("Delete this notice for faculty and students?")) return;
    try {
      const response = await fetch("/api/faculty/dashboard", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeId }),
      });
      if (!response.ok) throw new Error("Failed to delete notice");
      await fetchDashboard();
    } catch (error) {
      setError("Unable to delete the notice right now.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const unreadNotices = (dashboardData.notices || []).filter((notice: any) => !notice.read);

  const recentActivity = dashboardData.recentActivity?.length
    ? dashboardData.recentActivity
    : [
        { id: "r1", title: "New assignment created - DBMS Mini Project", time: "2 hours ago", type: "assignment" },
        { id: "r2", title: "Material uploaded - AI Notes.pdf", time: "4 hours ago", type: "material" },
        { id: "r3", title: "Notice posted - Exam Schedule", time: "1 day ago", type: "notice" },
      ];

  return (
    <main className={`min-h-screen p-2 sm:p-3 lg:p-4 transition-colors duration-300 ${darkMode ? "bg-[#111827]" : "bg-[#edf3ff]"}`}>
      <div className={`relative mx-auto flex h-[calc(100vh-16px)] max-w-[1600px] overflow-hidden rounded-[24px] border shadow-[0_10px_40px_rgba(70,90,150,0.12)] transition-colors duration-300 ${darkMode ? "border-[#263248] bg-[#172033]" : "border-white bg-[#f8fbff]"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl lg:hidden ${darkMode ? "bg-[#263248] text-white" : "bg-white text-[#18315e]"}`}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <aside className={`absolute inset-y-0 left-0 z-40 w-[295px] shrink-0 border-r transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${darkMode ? "border-[#263248] bg-[#172033]" : "border-[#e1e8f5] bg-[#f8fbff]"}`}>
          <div className="flex items-center gap-3 px-8 pb-6 pt-7">
            <div className="relative h-[48px] w-[54px] shrink-0">
              <div className="absolute left-[1px] top-[2px] h-[30px] w-[50px] bg-gradient-to-br from-[#6651ee] to-[#3023a5]" style={{ clipPath: "polygon(50% 0%, 100% 45%, 50% 90%, 0% 45%)" }} />
              <div className="absolute left-[10px] top-[23px] h-[18px] w-[36px] rounded-b-[17px] bg-[#30239c]" />
              <div className="absolute left-[47px] top-[20px] h-[28px] w-[3px] bg-[#5041c7]" />
              <div className="absolute left-[44px] top-[45px] h-[6px] w-[6px] rounded-full bg-[#5041c7]" />
            </div>
            <div>
              <h1 className={`whitespace-nowrap text-[21px] font-bold tracking-[-0.6px] ${darkMode ? "text-white" : "text-[#152653]"}`}>AI College Copilot</h1>
            </div>
          </div>

          <nav className="mt-2 space-y-2 px-5">
            <SidebarItem href="/faculty-dashboard" icon={<Home size={23} />} label="Dashboard" active darkMode={darkMode} />
            <SidebarItem href="/faculty/ai-tutor" icon={<Bot size={23} />} label="AI Tutor" darkMode={darkMode} />
            <SidebarItem href="/faculty/materials" icon={<FileText size={23} />} label="Materials" darkMode={darkMode} />
            <SidebarItem href="/faculty/assignments" icon={<ClipboardCheck size={23} />} label="Assignments" darkMode={darkMode} />
            <SidebarItem href="/faculty/timetable" icon={<CalendarDays size={23} />} label="Timetable" darkMode={darkMode} />
            <SidebarItem href="/faculty/settings" icon={<Settings size={23} />} label="Settings" darkMode={darkMode} />
          </nav>

          <div className={`pointer-events-none absolute bottom-0 left-0 h-[170px] w-full overflow-hidden ${darkMode ? "opacity-20" : ""}`}>
            <div className={`absolute -bottom-24 -left-12 h-[180px] w-[360px] rounded-[50%] ${darkMode ? "bg-[#263a64]" : "bg-[#e3efff]"}`} />
          </div>

          <div className="absolute bottom-6 left-7 right-7 flex items-center justify-between z-10">
            <button onClick={() => setDarkMode(!darkMode)} className={`flex h-[48px] items-center gap-3 rounded-full border px-4 transition ${darkMode ? "border-[#35435e] bg-[#202c42] text-white" : "border-[#e3e8f2] bg-white text-[#263b64]"}`}>
              <Moon size={21} />
              <span className="text-[15px] font-semibold">{darkMode ? "Dark" : "Light"}</span>
              <ChevronDown size={16} />
            </button>
            <Link href="/faculty/settings#help-support" title="Help & Support">
              <CircleHelp size={25} className={darkMode ? "text-white hover:text-indigo-400" : "text-[#17234b] hover:text-[#3934d8]"} />
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1 overflow-hidden">
          <header className="flex h-[95px] items-center justify-between px-7 pt-1 sm:px-8 lg:px-10">
            <div className="ml-12 lg:ml-0">
              <h2 className={`text-[30px] font-bold tracking-[-0.8px] sm:text-[32px] ${darkMode ? "text-white" : "text-[#142655]"}`}>
                Welcome, {dashboardData.user?.name || "Dr. Mehta"}!
              </h2>
              <p className={`mt-1 text-[15px] font-semibold ${darkMode ? "text-[#9eacc4]" : "text-[#7185a8]"}`}>
                Manage your courses and help students grow.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative hidden sm:block">
                <button
                  onClick={() => { setNotificationsOpen((open) => !open); setProfileMenuOpen(false); }}
                  title="Notifications"
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full ${darkMode ? "text-[#dce5f5] hover:bg-[#202c42]" : "text-[#17386d] hover:bg-[#edf3ff]"}`}
                >
                  <Bell size={25} strokeWidth={1.9} />
                  {unreadNotices.length > 0 && <span className="absolute right-[6px] top-[4px] h-[7px] w-[7px] rounded-full bg-[#ef3545]" />}
                </button>
                {notificationsOpen && (
                  <div className={`absolute right-0 top-12 z-50 w-80 rounded-2xl border p-4 shadow-2xl ${darkMode ? "border-[#35435e] bg-[#18243e] text-white" : "border-[#e2ebf8] bg-white text-[#172b55]"}`}>
                    <div className="mb-3 flex items-center justify-between border-b border-slate-200/20 pb-3">
                      <h3 className="font-bold">Faculty notifications</h3>
                      <button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={16} /></button>
                    </div>
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {(dashboardData.notices || []).slice(0, 5).map((notice: any) => (
                        <button key={notice.id} onClick={() => { markNoticeRead(notice.id); setNotificationsOpen(false); }} className={`block w-full rounded-xl p-3 text-left ${darkMode ? "bg-[#1f2d4b] hover:bg-[#263858]" : "bg-[#f6f8fc] hover:bg-[#eef3ff]"}`}>
                          <p className="text-sm font-semibold">{notice.title}</p>
                          <p className={`mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{notice.department || "Academic office"} • {notice.date || "Today"}</p>
                        </button>
                      ))}
                      {dashboardData.notices?.length === 0 && <p className="py-3 text-sm text-slate-500">No notifications.</p>}
                    </div>
                    <Link href="#notices" onClick={() => setNotificationsOpen(false)} className="mt-3 block text-center text-sm font-semibold text-[#4d62d8]">View notices</Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => { setProfileMenuOpen((open) => !open); setNotificationsOpen(false); }} className={`flex items-center gap-3 rounded-xl px-1 py-1 ${darkMode ? "text-white" : "text-[#172b55]"}`} aria-label="Open faculty profile menu">
                  <div className="h-[48px] w-[48px] overflow-hidden rounded-full bg-[#e9edf7]">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f3d6ca] to-[#d7a998] text-[19px] font-bold text-[#593d35]">
                      {dashboardData.user?.name ? dashboardData.user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() : "DM"}
                    </div>
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-[15px] font-bold">{dashboardData.user?.name || "Dr. Mehta"}</p>
                    <p className={`text-[14px] ${darkMode ? "text-[#9eacc4]" : "text-[#7085a8]"}`}>{dashboardData.user?.role || "Faculty"}</p>
                  </div>
                  <ChevronDown size={18} />
                </button>
                {profileMenuOpen && (
                  <div className={`absolute right-0 top-14 z-50 w-52 rounded-2xl border p-2 shadow-2xl ${darkMode ? "border-[#35435e] bg-[#18243e]" : "border-[#e2ebf8] bg-white"}`}>
                    <Link href="/faculty/settings" onClick={() => setProfileMenuOpen(false)} className={`block rounded-xl px-3 py-2 text-sm font-semibold ${darkMode ? "text-white hover:bg-[#263858]" : "text-[#172b55] hover:bg-[#f0f4ff]"}`}>Profile settings</Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-500/10"><LogOut size={16} /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="h-[calc(100vh-111px)] overflow-hidden px-5 pb-5 sm:px-7 lg:px-9">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <ActionCard title="Create Notice" subtitle="Post important updates" icon={<Bell size={27} />} iconBg="bg-[#e3f1ff]" iconColor="text-[#3181e8]" darkMode={darkMode} onClick={() => setSelectedAction("notice")} />
              <ActionCard title="Upload Materials" subtitle="Share course content" icon={<Upload size={27} />} iconBg="bg-[#ddfaee]" iconColor="text-[#20b978]" darkMode={darkMode} onClick={() => setSelectedAction("material")} />
              <ActionCard title="Create Assignment" subtitle="Set & manage tasks" icon={<UserPlus size={27} />} iconBg="bg-[#eee5ff]" iconColor="text-[#7137d9]" darkMode={darkMode} onClick={() => setSelectedAction("assignment")} />
              <ActionCard title="Manage Timetable" subtitle="Update class schedule" icon={<CalendarDays size={27} />} iconBg="bg-[#e0edff]" iconColor="text-[#2777df]" darkMode={darkMode} onClick={() => setSelectedAction("timetable")} />
            </div>

            {notificationMessage && <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{notificationMessage}</div>}

            {selectedAction && (
              <div className={`mt-5 rounded-[19px] border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className={`text-[20px] font-bold ${darkMode ? "text-white" : "text-[#142b59]"}`}>
                    {selectedAction === "notice" && "Create Notice"}
                    {selectedAction === "material" && "Upload Material"}
                    {selectedAction === "assignment" && "Create Assignment"}
                    {selectedAction === "timetable" && "Update Timetable"}
                  </h3>
                  <button onClick={() => setSelectedAction(null)} className="text-sm font-medium text-[#4d62d8]">Close</button>
                </div>

                {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
                {selectedAction === "notice" && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <input value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="Notice title" className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <input value={noticeForm.department} onChange={(e) => setNoticeForm({ ...noticeForm, department: e.target.value })} placeholder="Department" className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <select value={noticeForm.category} onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })} className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`}>
                      <option>Academic</option>
                      <option>Urgent</option>
                      <option>Event</option>
                      <option>General</option>
                    </select>
                    <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => setNoticeFile(e.target.files?.[0] || null)} className={`md:col-span-3 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <div className="md:col-span-3 flex justify-end">
                      <button onClick={() => handleCreate("notice")} disabled={isSaving} className="rounded-xl bg-[#4d62d8] px-5 py-2.5 font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : "Publish Notice"}</button>
                    </div>
                  </div>
                )}

                {selectedAction === "material" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} placeholder="Material title" className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <select value={materialForm.type} onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })} className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`}>
                      <option value="PDF">PDF</option>
                      <option value="Slides">Slides</option>
                      <option value="Video">Video</option>
                      <option value="Notes">Notes</option>
                    </select>
                    <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.mp4" onChange={(e) => setMaterialFile(e.target.files?.[0] || null)} className={`md:col-span-2 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <div className="md:col-span-2 flex justify-end">
                      <button onClick={() => handleCreate("material")} disabled={isSaving} className="rounded-xl bg-[#1dbf73] px-5 py-2.5 font-semibold text-white disabled:opacity-60">{isSaving ? "Uploading..." : "Upload Material"}</button>
                    </div>
                  </div>
                )}

                {selectedAction === "assignment" && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <input value={assignmentForm.title} onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })} placeholder="Assignment title" className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <input type="date" value={assignmentForm.due} onChange={(e) => setAssignmentForm({ ...assignmentForm, due: e.target.value })} className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <input type="number" value={assignmentForm.students} onChange={(e) => setAssignmentForm({ ...assignmentForm, students: e.target.value })} placeholder="Students" className={`rounded-xl border px-3 py-2 ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)} className={`md:col-span-3 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                    <div className="md:col-span-3 flex justify-end">
                      <button onClick={() => handleCreate("assignment")} disabled={isSaving} className="rounded-xl bg-[#7a52f4] px-5 py-2.5 font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : "Create Assignment"}</button>
                    </div>
                  </div>
                )}

                {selectedAction === "timetable" && (
                  <div className="flex flex-col gap-3">
                    <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Timetable updates are stored in the faculty dashboard data and can be expanded with a full time-slot manager later.
                    </p>
                    <button onClick={() => setSelectedAction(null)} className="w-fit rounded-xl bg-[#4d62d8] px-5 py-2.5 font-semibold text-white">Done</button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 grid min-h-0 grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
              <section className={`min-h-0 overflow-hidden rounded-[19px] border px-5 py-5 shadow-[0_5px_18px_rgba(75,95,145,0.05)] ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-[20px] font-bold ${darkMode ? "text-white" : "text-[#142b59]"}`}>Recent Activity</h3>
                  <button className="flex items-center gap-1 text-[14px] font-bold text-[#4d62d8]">
                    View All <ArrowRight size={17} />
                  </button>
                </div>

                <div>
                  {recentActivity.map((item, index) => (
                    <ActivityRow
                      key={item.id || index}
                      icon={item.type === "notice" ? <CalendarDays size={23} /> : item.type === "material" ? <Upload size={23} /> : <FileText size={23} />}
                      title={item.title}
                      time={item.time}
                      bg={item.type === "notice" ? "bg-[#fff0d5]" : item.type === "material" ? "bg-[#eee0ff]" : "bg-[#ffe0ee]"}
                      color={item.type === "notice" ? "text-[#ef9512]" : item.type === "material" ? "text-[#773be0]" : "text-[#e52b70]"}
                      darkMode={darkMode}
                      last={index === recentActivity.length - 1}
                    />
                  ))}
                </div>
              </section>

              <section className={`min-h-0 overflow-hidden rounded-[19px] border px-5 py-5 shadow-[0_5px_18px_rgba(75,95,145,0.05)] ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                <h3 className={`mb-4 text-[20px] font-bold ${darkMode ? "text-white" : "text-[#142b59]"}`}>Quick Stats</h3>
                <div className="space-y-3">
                  <StatRow icon={<Users size={25} />} label="Total Students" value={String(dashboardData.stats?.totalStudents ?? 120)} bg="bg-[#e5f1ff]" color="text-[#3583e5]" darkMode={darkMode} />
                  <StatRow icon={<BookOpen size={25} />} label="Total Courses" value={String(dashboardData.stats?.totalCourses ?? 6)} bg="bg-[#ddfaee]" color="text-[#24ad76]" darkMode={darkMode} />
                  <StatRow icon={<ClipboardList size={25} />} label="Pending Assignments" value={String(dashboardData.stats?.pendingAssignments ?? 8)} bg="bg-[#f0e6ff]" color="text-[#703bdb]" darkMode={darkMode} />
                </div>
              </section>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <div id="notices" className={`rounded-[19px] border px-5 py-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#142b59]"}`}>Notices</h3>
                  <span className="rounded-full bg-[#e6f0ff] px-2.5 py-1 text-xs font-semibold text-[#3a64d8]">{dashboardData.notices?.length ?? 0}</span>
                </div>
                <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
                  {(dashboardData.notices || []).map((notice: any) => (
                    <div key={notice.id} className={`rounded-xl border p-3 ${darkMode ? "border-[#2c3b54] bg-[#1f2c47]" : "border-[#e7ecf5] bg-[#f8fbff]"}`}>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="font-semibold text-[#2f5cc7]">{notice.title}</p>
                        <div className="flex items-center gap-2">
                          {!notice.read && <button onClick={() => markNoticeRead(notice.id)} className="text-[11px] font-bold text-[#4d62d8]">Mark Read</button>}
                          <button onClick={() => deleteNotice(notice.id)} className="text-[11px] font-bold text-red-500">Delete</button>
                        </div>
                      </div>
                      <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>{notice.department} • {notice.category}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-[19px] border px-5 py-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#142b59]"}`}>Assignments</h3>
                  <span className="rounded-full bg-[#f3ebff] px-2.5 py-1 text-xs font-semibold text-[#7a52f4]">{dashboardData.assignments?.length ?? 0}</span>
                </div>
                <div className="space-y-3">
                  {(dashboardData.assignments || []).slice(0, 3).map((assignment: any) => (
                    <div key={assignment.id} className={`rounded-xl border p-3 ${darkMode ? "border-[#2c3b54] bg-[#1f2c47]" : "border-[#e7ecf5] bg-[#f8fbff]"}`}>
                      <p className="font-semibold text-[#1c2d52] dark:text-white">{assignment.title}</p>
                      <p className={`mt-1 text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>Due: {assignment.due || "TBD"} • {assignment.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-[19px] border px-5 py-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#142b59]"}`}>Materials</h3>
                  <span className="rounded-full bg-[#eafaf3] px-2.5 py-1 text-xs font-semibold text-[#1dbf73]">{dashboardData.materials?.length ?? 0}</span>
                </div>
                <div className="space-y-3">
                  {(dashboardData.materials || []).slice(0, 3).map((material: any) => (
                    <div key={material.id} className={`rounded-xl border p-3 ${darkMode ? "border-[#2c3b54] bg-[#1f2c47]" : "border-[#e7ecf5] bg-[#f8fbff]"}`}>
                      <p className="font-semibold text-[#1c2d52] dark:text-white">{material.title}</p>
                      <p className={`mt-1 text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>{material.type} • {material.uploadedAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarItem({ href, icon, label, active = false, darkMode }: { href: string; icon: React.ReactNode; label: string; active?: boolean; darkMode: boolean }) {
  return (
    <Link href={href} className={`flex h-[57px] items-center gap-5 rounded-[15px] px-5 transition ${active ? darkMode ? "bg-[#283556] text-[#6b63ff]" : "bg-[#e9e8ff] text-[#4c56dc]" : darkMode ? "text-[#b9c5da] hover:bg-[#202c42]" : "text-[#29446f] hover:bg-[#f0f3ff]"}`}>
      <span className={active ? "text-[#4f59df]" : ""}>{icon}</span>
      <span className="text-[16px] font-semibold">{label}</span>
    </Link>
  );
}

function ActionCard({ title, subtitle, icon, iconBg, iconColor, darkMode, onClick }: { title: string; subtitle: string; icon: React.ReactNode; iconBg: string; iconColor: string; darkMode: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`group relative h-[176px] overflow-hidden rounded-[18px] border px-5 py-5 text-left shadow-[0_5px_18px_rgba(70,90,145,0.06)] transition hover:-translate-y-1 ${darkMode ? "border-[#2b3850] bg-[#1c273b]" : "border-[#e4e9f3] bg-white"}`}>
      <div className={`flex h-[55px] w-[55px] items-center justify-center rounded-full ${iconBg} ${iconColor}`}>{icon}</div>
      <div className="mt-3">
        <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#132b59]"}`}>{title}</h3>
        <p className={`mt-1 text-[14px] font-medium ${darkMode ? "text-[#98a7bf]" : "text-[#7085a8]"}`}>{subtitle}</p>
      </div>
      <span className={`absolute right-5 top-[100px] flex h-[30px] w-[30px] items-center justify-center rounded-full transition group-hover:translate-x-1 ${darkMode ? "bg-[#273650] text-[#7090ff]" : "bg-[#f0f4ff] text-[#315edb]"}`}>
        <ArrowRight size={18} />
      </span>
    </button>
  );
}

function ActivityRow({ icon, title, time, bg, color, darkMode, last = false }: { icon: React.ReactNode; title: string; time: string; bg: string; color: string; darkMode: boolean; last?: boolean }) {
  return (
    <div className={`flex min-h-[72px] items-center gap-3 ${!last ? darkMode ? "border-b border-[#2b3850]" : "border-b border-[#edf0f6]" : ""}`}>
      <div className={`flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full ${bg} ${color}`}>{icon}</div>
      <p className={`min-w-0 flex-1 truncate text-[15px] font-semibold ${darkMode ? "text-[#d9e1ef]" : "text-[#355078]"}`}>{title}</p>
      <span className={`shrink-0 text-[13px] font-medium ${darkMode ? "text-[#8999b4]" : "text-[#8394b0]"}`}>{time}</span>
    </div>
  );
}

function StatRow({ icon, label, value, bg, color, darkMode }: { icon: React.ReactNode; label: string; value: string; bg: string; color: string; darkMode: boolean }) {
  return (
    <div className={`flex h-[67px] items-center gap-3 rounded-[15px] px-3 ${darkMode ? "bg-[#222e44]" : bg}`}>
      <div className={`flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-full ${darkMode ? "bg-[#2c3a53]" : "bg-white/60"} ${color}`}>{icon}</div>
      <span className={`flex-1 text-[15px] font-semibold ${darkMode ? "text-[#c2cee0]" : "text-[#496284]"}`}>{label}</span>
      <span className={`text-[17px] font-bold ${darkMode ? "text-white" : "text-[#1b3765]"}`}>{value}</span>
    </div>
  );
}
