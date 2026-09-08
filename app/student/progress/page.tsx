"use client";

import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
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
  BookOpen,
  CheckCircle2,
  Clock3,
  Star,
  Brain,
  Database,
  Network,
  Globe,
  Laptop,
  Award,
  TrendingUp,
  GraduationCap,
  Calendar,
  AlertCircle,
  Plus,
  Check,
  Layers,
  BarChart3,
  Moon,
  ChevronDown,
  CircleHelp
} from "lucide-react";

import { useState, useEffect } from "react";

export default function Progress() {
  const { darkMode, setDarkMode } = useTheme();
  const [userName, setUserName] = useState("Student");
  const [searchQuery, setSearchQuery] = useState("");
  const [progressData, setProgressData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Overview" | "Courses" | "Assignments" | "Performance">("Overview");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProgress = () => {
    fetch("/api/student/progress")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProgressData(data);
        }
      })
      .catch((err) => console.error("Failed to fetch progress:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Student");
    fetchProgress();
  }, []);

  const handleUpdateAssignment = async (assignmentId: string, status: string) => {
    setUpdatingId(assignmentId);
    try {
      const res = await fetch("/api/student/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateAssignmentStatus",
          assignmentId,
          status,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProgress();
      }
    } catch (err) {
      console.error("Failed to update assignment status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCompleteTopic = async (subjectId: string, currentCompleted: number, totalTopics: number) => {
    if (currentCompleted >= totalTopics) return;
    const newCompleted = currentCompleted + 1;
    const newPercentage = Math.round((newCompleted / totalTopics) * 100);

    try {
      const res = await fetch("/api/student/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSubjectProgress",
          subjectId,
          percentage: newPercentage,
          completedTopics: newCompleted,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProgress();
      }
    } catch (err) {
      console.error("Failed to update topic progress:", err);
    }
  };

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/student/dashboard" },
    { label: "AI Tutor", icon: Bot, href: "/student/ai-tutor" },
    { label: "Notices", icon: Bell, href: "/student/notices" },
    { label: "Materials", icon: FileText, href: "/student/materials" },
    { label: "Timetable", icon: CalendarDays, href: "/student/timetable" },
    { label: "Assignments", icon: ClipboardList, href: "/student/assignments" },
    { label: "Progress", icon: ChartNoAxesCombined, href: "/student/progress", active: true },
    { label: "Settings", icon: Settings, href: "/student/settings" },
  ];

  // Raw API Data
  const summary = progressData?.summary || {
    progressPercentage: 78,
    overallGPA: 3.82,
    attendanceRate: 94,
    completedCredits: 112,
    totalCredits: 140,
  };

  const subjectProgress = progressData?.subjectProgress || [
    { id: "s1", subject: "Database Management Systems", code: "CS701", percentage: 88, grade: "A", totalTopics: 12, completedTopics: 10, instructor: "Dr. Sharma" },
    { id: "s2", subject: "Artificial Intelligence & ML", code: "CS702", percentage: 82, grade: "A-", totalTopics: 15, completedTopics: 12, instructor: "Prof. Alan" },
    { id: "s3", subject: "Machine Learning & Neural Nets", code: "CS703", percentage: 75, grade: "B+", totalTopics: 14, completedTopics: 10, instructor: "Dr. Mehta" },
    { id: "s4", subject: "Operating Systems", code: "CS704", percentage: 91, grade: "A+", totalTopics: 10, completedTopics: 9, instructor: "Prof. Vikram" },
    { id: "s5", subject: "Computer Networks & Protocols", code: "CS705", percentage: 79, grade: "B+", totalTopics: 12, completedTopics: 9, instructor: "Dr. Rao" },
    { id: "s6", subject: "Full Stack Web Development", code: "CS706", percentage: 95, grade: "A+", totalTopics: 10, completedTopics: 9, instructor: "Prof. Ananya" }
  ];

  const assignmentsList = progressData?.assignments || [
    { id: "1", title: "DBMS Mini Project", due: "15 Sep 2025", status: "In Progress", category: "Upcoming" },
    { id: "2", title: "AI Research Paper", due: "20 Sep 2025", status: "Not Started", category: "Upcoming" },
    { id: "3", title: "NLP Assignment", due: "25 Sep 2025", status: "Overdue", category: "Overdue" },
    { id: "4", title: "Web Development Project", due: "30 Sep 2025", status: "Submitted", category: "Submitted" }
  ];

  const recentTestScores = progressData?.recentTestScores || [
    { id: "t1", test: "DBMS Mid-Term Exam", subject: "DBMS", score: 92, maxScore: 100, date: "2025-08-20", grade: "A" },
    { id: "t2", test: "AI Lab Evaluation 1", subject: "Artificial Intelligence", score: 45, maxScore: 50, date: "2025-08-25", grade: "A" },
    { id: "t3", test: "OS Quiz 2 - Memory & Deadlocks", subject: "Operating Systems", score: 18, maxScore: 20, date: "2025-09-01", grade: "A+" },
    { id: "t4", test: "ML Coding Assignment Test", subject: "Machine Learning", score: 88, maxScore: 100, date: "2025-09-04", grade: "B+" },
    { id: "t5", test: "Computer Networks Quiz 1", subject: "Computer Networks", score: 40, maxScore: 50, date: "2025-09-06", grade: "B" }
  ];

  const completedAssignmentsCount = progressData?.completedAssignments ?? assignmentsList.filter((a: any) => ["Completed", "Submitted"].includes(a.status)).length;
  const inProgressAssignmentsCount = progressData?.inProgressAssignments ?? assignmentsList.filter((a: any) => a.status === "In Progress").length;
  const pendingAssignmentsCount = progressData?.pendingAssignments ?? (assignmentsList.length - completedAssignmentsCount);

  return (
    <main className={`h-screen overflow-hidden p-2 sm:p-3 ${darkMode ? "bg-[#11182b]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex h-full max-w-[1600px] overflow-hidden rounded-[20px] border ${darkMode ? "border-slate-700 bg-[#18223a]" : "border-[#dce7f8] bg-white"} shadow-sm`}>

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

        {/* MAIN SECTION */}
        <section className="min-w-0 flex-1 flex flex-col overflow-hidden">
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={userName}
            searchPlaceholder="Search progress, courses, grades..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            
            {/* TITLE & TABS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-[#101d46]"}`}>
                  Academic Progress & Analytics
                </h2>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-[#52698f]"}`}>
                  Track course completion, assignment goals, GPA, and test performances
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(["Overview", "Courses", "Assignments", "Performance"] as const).map((tab) => {
                  const active = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-xl px-5 py-2 text-xs font-semibold transition ${
                        active
                          ? "bg-[#4334d8] text-white shadow-md"
                          : darkMode
                          ? "border border-slate-700 bg-[#202d49] text-slate-300 hover:bg-slate-700/50"
                          : "border border-[#e0e8f5] bg-[#f7faff] text-[#54709c] hover:bg-indigo-50/50"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TOP STAT CARDS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Enrolled Courses"
                value={String(subjectProgress.length)}
                subtitle="Active Semester"
                icon={<BookOpen size={22} />}
                iconBg="bg-indigo-500/10"
                iconColor="text-indigo-600 dark:text-indigo-400"
                darkMode={darkMode}
              />
              <StatCard
                title="Completed Assignments"
                value={`${completedAssignmentsCount} / ${assignmentsList.length}`}
                subtitle={`${Math.round((completedAssignmentsCount / Math.max(assignmentsList.length, 1)) * 100)}% Finished`}
                icon={<CheckCircle2 size={22} />}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-600 dark:text-emerald-400"
                darkMode={darkMode}
              />
              <StatCard
                title="Pending Assignments"
                value={String(pendingAssignmentsCount)}
                subtitle="Requires Action"
                icon={<Clock3 size={22} />}
                iconBg="bg-amber-500/10"
                iconColor="text-amber-600 dark:text-amber-400"
                darkMode={darkMode}
              />
              <StatCard
                title="Overall Completion Rate"
                value={`${summary.progressPercentage}%`}
                subtitle={`GPA: ${summary.overallGPA} · ${summary.attendanceRate}% Attendance`}
                icon={<Star size={22} />}
                iconBg="bg-purple-500/10"
                iconColor="text-purple-600 dark:text-purple-400"
                darkMode={darkMode}
              />
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Course Progress Table (2 Columns) */}
                <div className={`lg:col-span-2 rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/30">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={18} className="text-[#4334d8]" />
                      <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                        Subject Completion Progress
                      </h3>
                    </div>
                    <button onClick={() => setActiveTab("Courses")} className="text-xs font-semibold text-[#4334d8] hover:underline">
                      View All ({subjectProgress.length}) →
                    </button>
                  </div>

                  <div className="space-y-4">
                    {subjectProgress
                      .filter((subject: any) =>
                        !searchQuery.trim()
                          ? true
                          : subject.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (subject.code && subject.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (subject.grade && subject.grade.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .map((subject: any) => (
                        <div key={subject.id || subject.subject} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className={darkMode ? "text-slate-200" : "text-slate-800"}>
                              {subject.subject} <span className="text-slate-400 font-normal">({subject.code})</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                Grade {subject.grade}
                              </span>
                              <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
                                {subject.percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#4334d8] transition-all duration-500"
                              style={{ width: `${subject.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Overall Breakdown Donut / Stats */}
                <div className={`rounded-2xl border p-6 flex flex-col justify-between ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                  <div>
                    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-700/30">
                      <TrendingUp size={18} className="text-[#4334d8]" />
                      <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                        Assignment Status
                      </h3>
                    </div>

                    <div className="flex flex-col items-center justify-center my-4">
                      <div
                        className="relative flex h-36 w-36 items-center justify-center rounded-full shadow-inner"
                        style={{
                          background: `conic-gradient(#10b981 0deg ${
                            (completedAssignmentsCount / Math.max(assignmentsList.length, 1)) * 360
                          }deg, #f59e0b ${
                            (completedAssignmentsCount / Math.max(assignmentsList.length, 1)) * 360
                          }deg ${
                            ((completedAssignmentsCount + inProgressAssignmentsCount) / Math.max(assignmentsList.length, 1)) * 360
                          }deg, #e2e8f0 0deg 360deg)`,
                        }}
                      >
                        <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full ${darkMode ? "bg-[#1f2c4d]" : "bg-white"}`}>
                          <span className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                            {summary.progressPercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Overall</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 text-xs font-semibold">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Completed / Submitted
                        </span>
                        <span>{completedAssignmentsCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> In Progress
                        </span>
                        <span>{inProgressAssignmentsCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Pending / Not Started
                        </span>
                        <span>{pendingAssignmentsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: COURSES */}
            {activeTab === "Courses" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjectProgress.map((course: any) => (
                  <div
                    key={course.id || course.subject}
                    className={`rounded-2xl border p-6 flex flex-col justify-between ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm hover:shadow-md transition`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {course.code}
                          </span>
                          <h3 className={`mt-2 text-base font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                            {course.subject}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">Instructor: {course.instructor}</p>
                        </div>
                        <span className="text-lg font-extrabold text-[#4334d8] dark:text-indigo-300">
                          {course.grade}
                        </span>
                      </div>

                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-400">Topics Completed</span>
                          <span className={darkMode ? "text-white" : "text-slate-900"}>
                            {course.completedTopics} / {course.totalTopics}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#4334d8] transition-all duration-300"
                            style={{ width: `${course.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-500">
                        {course.percentage}% Complete
                      </span>
                      <button
                        onClick={() => handleCompleteTopic(course.id, course.completedTopics, course.totalTopics)}
                        disabled={course.completedTopics >= course.totalTopics}
                        className="flex items-center gap-1.5 rounded-xl bg-[#4334d8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3527bd] disabled:opacity-50 transition"
                      >
                        <Plus size={14} /> Complete Topic
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: ASSIGNMENTS */}
            {activeTab === "Assignments" && (
              <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-[#4334d8]" />
                    <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                      Assignments & Task Tracker
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    Total: {assignmentsList.length} Tasks
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b text-slate-400 font-semibold uppercase tracking-wider ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                        <th className="pb-3 px-2">Assignment Title</th>
                        <th className="pb-3 px-2">Due Date</th>
                        <th className="pb-3 px-2">Category</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {assignmentsList.map((assignment: any) => (
                        <tr key={assignment.id} className="hover:bg-slate-500/5 transition">
                          <td className={`py-4 px-2 font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                            {assignment.title}
                          </td>
                          <td className="py-4 px-2 text-slate-400">
                            {assignment.due}
                          </td>
                          <td className="py-4 px-2">
                            <span className="rounded-md bg-slate-500/10 px-2 py-1 text-[11px] font-semibold text-slate-400">
                              {assignment.category || "Academic"}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                ["Completed", "Submitted"].includes(assignment.status)
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : assignment.status === "In Progress"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : assignment.status === "Overdue"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-slate-500/10 text-slate-400"
                              }`}
                            >
                              {assignment.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            {!["Completed", "Submitted"].includes(assignment.status) ? (
                              <button
                                onClick={() => handleUpdateAssignment(assignment.id, "Submitted")}
                                disabled={updatingId === assignment.id}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-700 transition"
                              >
                                <Check size={13} /> {updatingId === assignment.id ? "Saving..." : "Mark Submitted"}
                              </button>
                            ) : (
                              <span className="text-emerald-500 font-bold inline-flex items-center gap-1">
                                <CheckCircle2 size={14} /> Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PERFORMANCE */}
            {activeTab === "Performance" && (
              <div className="space-y-6">
                {/* GPA & Attendance Summary */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase">Cumulative GPA</h4>
                        <p className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {summary.overallGPA} <span className="text-xs font-normal text-slate-400">/ 4.00</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-500 font-semibold">Top 5% of Department Batch</p>
                  </div>

                  <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase">Class Attendance</h4>
                        <p className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {summary.attendanceRate}% <span className="text-xs font-normal text-slate-400">(132/140)</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-500 font-semibold">Exceeds minimum 75% requirement</p>
                  </div>

                  <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                        <Award size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase">Completed Credits</h4>
                        <p className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {summary.completedCredits} <span className="text-xs font-normal text-slate-400">/ {summary.totalCredits}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-indigo-500 font-semibold">28 credits remaining for graduation</p>
                  </div>
                </div>

                {/* Recent Test Scores Table */}
                <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/30">
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-[#4334d8]" />
                      <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                        Recent Test & Exam Evaluations
                      </h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b text-slate-400 font-semibold uppercase tracking-wider ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                          <th className="pb-3 px-2">Test Name</th>
                          <th className="pb-3 px-2">Subject</th>
                          <th className="pb-3 px-2">Date</th>
                          <th className="pb-3 px-2">Score</th>
                          <th className="pb-3 px-2 text-right">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {recentTestScores.map((test: any) => (
                          <tr key={test.id || test.test} className="hover:bg-slate-500/5 transition">
                            <td className={`py-3.5 px-2 font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                              {test.test}
                            </td>
                            <td className="py-3.5 px-2 text-slate-400 font-medium">
                              {test.subject}
                            </td>
                            <td className="py-3.5 px-2 text-slate-400">
                              {test.date}
                            </td>
                            <td className="py-3.5 px-2 font-bold text-indigo-500">
                              {test.score} / {test.maxScore}
                            </td>
                            <td className="py-3.5 px-2 text-right">
                              <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                                {test.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  darkMode,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  darkMode: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <h4 className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>{value}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}