"use client";

import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Moon,
  MessageCircle,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  FileCheck2,
  CircleUserRound,
  Lightbulb,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import StudentHeader from "@/components/StudentHeader";

export default function Dashboard() {
  const { darkMode, setDarkMode } = useTheme();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Student");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    fetch("/api/student/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.name) {
          setUserName(data.user.name);
          localStorage.setItem("userName", data.user.name);
        }
        setDashboardData(data);
      })
      .catch((err) => console.error("Failed to fetch dashboard:", err));
  }, []);

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

  return (
    <main
      className={`h-dvh overflow-hidden p-2 sm:p-3 ${
        darkMode ? "bg-[#11182b]" : "bg-[#edf3ff]"
      }`}
    >
      <div
        className={`mx-auto flex h-full max-w-[1550px] overflow-hidden rounded-[20px] border ${
          darkMode
            ? "border-slate-700 bg-[#18223a]"
            : "border-[#dce7f8] bg-white"
        } shadow-[0_10px_40px_rgba(40,75,130,0.08)]`}
      >
        {/* ================= SIDEBAR ================= */}
        <aside
          className={`hidden w-[325px] shrink-0 flex-col border-r lg:flex ${
            darkMode
              ? "border-slate-700 bg-[#17223a]"
              : "border-[#e5edf9] bg-[#fbfdff]"
          }`}
        >
          {/* LOGO */}
          <div className="flex h-[90px] shrink-0 items-center gap-3 px-7">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center">
                <div className="absolute h-8 w-10 -rotate-[25deg] bg-[#3934d8] [clip-path:polygon(50%_0,100%_28%,50%_55%,0_28%)]" />
                <div className="absolute left-[12px] top-[17px] h-6 w-3 bg-[#2225ad] [clip-path:polygon(0_0,100%_25%,100%_100%,0_75%)]" />
                <div className="absolute left-[28px] top-[17px] h-6 w-3 bg-[#2225ad] [clip-path:polygon(0_25%,100%_0,100%_75%,0_100%)]" />
              </div>
            </div>

            <h1
              className={`text-[22px] font-bold tracking-tight ${
                darkMode ? "text-white" : "text-[#101c43]"
              }`}
            >
              AI College Copilot
            </h1>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

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
                  <span
                    className={`text-[14px] ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* BOTTOM THEME PILL */}
          <div className="flex shrink-0 items-center justify-between px-7 pb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-3 rounded-full px-4 py-2 transition ${
                darkMode ? "bg-slate-700" : "bg-[#edf3ff]"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                <Moon size={18} className="text-[#20285a]" />
              </div>

              <span
                className={`text-[15px] font-medium ${
                  darkMode ? "text-white" : "text-[#152043]"
                }`}
              >
                {darkMode ? "Dark" : "Light"}
              </span>

              <ChevronDown
                size={16}
                className={darkMode ? "text-white" : "text-[#17234b]"}
              />
            </button>

            <Link
              href="/student/settings#help-support"
              title="Help & Support"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  : "border-slate-200 bg-[#edf3ff] text-[#17234b] hover:bg-indigo-100"
              }`}
            >
              <HelpCircle size={22} />
            </Link>
          </div>
        </aside>

        {/* ================= MAIN SECTION ================= */}
        <section className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
          {/* TOP HEADER */}
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={userName}
            searchPlaceholder="Search classes, actions, notices..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* MAIN CONTENT AREA */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4 pt-4 sm:px-8">
            {/* DECORATION VECTORS */}
            <div className="pointer-events-none absolute right-0 top-0 h-[180px] w-[400px] opacity-70">
              <div className="absolute right-[-100px] top-[20px] h-[100px] w-[360px] rotate-[-5deg] rounded-[50%] bg-gradient-to-r from-[#dff5ff] to-[#e8e1ff]" />
              <div className="absolute right-[-100px] top-[65px] h-[90px] w-[330px] rotate-[10deg] rounded-[50%] bg-gradient-to-r from-[#d9f5ff] to-[#eee4ff]" />
            </div>

            {/* GREETING */}
            <div className="relative mb-4 shrink-0">
              <h2
                className={`text-[24px] font-bold tracking-tight sm:text-[29px] ${
                  darkMode ? "text-white" : "text-[#101d46]"
                }`}
              >
                Good Morning, {userName}!{" "}
                <span className="inline-block animate-pulse">☀️</span>
              </h2>

              <p
                className={`mt-1 text-[14px] sm:text-[16px] ${
                  darkMode ? "text-slate-300" : "text-[#52698f]"
                }`}
              >
                Your college journey, one step closer.
              </p>
            </div>

            {/* STATS ROW */}
            <div className="relative grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Upcoming Classes"
                value={`${dashboardData?.stats?.upcomingClassesCount ?? 3} Today`}
                icon={<CalendarCheck size={25} />}
                iconBg="bg-[#eee9ff]"
                iconColor="text-[#4936db]"
                darkMode={darkMode}
              />

              <StatCard
                title="Pending Assignments"
                value={`${dashboardData?.stats?.pendingAssignmentsCount ?? 2}`}
                icon={<FileCheck2 size={25} />}
                iconBg="bg-[#fff0da]"
                iconColor="text-[#efa328]"
                darkMode={darkMode}
              />

              <StatCard
                title="Unread Notices"
                value={`${dashboardData?.stats?.unreadNoticesCount ?? 5}`}
                icon={<Bell size={25} />}
                iconBg="bg-[#ffe8ee]"
                iconColor="text-[#ef3155]"
                darkMode={darkMode}
              />

              {/* PROGRESS CARD */}
              <div
                className={`rounded-[16px] border p-4 shadow-[0_5px_20px_rgba(36,74,130,0.06)] ${
                  darkMode
                    ? "border-slate-700 bg-[#202d49]"
                    : "border-[#dce6f4] bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#e3f8ec] text-[#11a65b]">
                    <TrendingUp size={27} />
                  </div>

                  <div>
                    <p className="text-[13px] font-medium text-[#6b7e9e]">
                      Your Progress
                    </p>

                    <p
                      className={`text-[22px] font-bold ${
                        darkMode ? "text-white" : "text-[#101d46]"
                      }`}
                    >
                      {dashboardData?.stats?.progressPercentage ?? 78}%
                    </p>
                  </div>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#dcecf1]">
                  <div
                    className="h-full rounded-full bg-[#13b7ad] transition-all duration-500"
                    style={{
                      width: `${dashboardData?.stats?.progressPercentage ?? 78}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* LOWER GRID LAYOUT */}
            <div className="relative mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden xl:grid-cols-[1.05fr_1fr_300px]">
              {/* UPCOMING TODAY */}
              <div
                className={`flex h-full min-h-0 flex-col rounded-[17px] border p-4 ${
                  darkMode
                    ? "border-slate-700 bg-[#202d49]"
                    : "border-[#dce6f4] bg-white"
                } shadow-[0_5px_20px_rgba(36,74,130,0.06)]`}
              >
                <h3
                  className={`shrink-0 text-[19px] font-bold ${
                    darkMode ? "text-white" : "text-[#14224a]"
                  }`}
                >
                  Upcoming Today
                </h3>

                <div className="mt-1 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {(
                    dashboardData?.upcomingClasses || [
                      {
                        color:
                          "bg-gradient-to-b from-[#8b48f5] to-[#66b3ef]",
                        subject: "DBMS",
                        time: "10:00 AM – 11:00 AM",
                      },
                      {
                        color:
                          "bg-gradient-to-b from-[#0cb2b7] to-[#71d1e5]",
                        subject: "AI",
                        time: "11:30 AM – 12:30 PM",
                      },
                      {
                        color:
                          "bg-gradient-to-b from-[#ff303d] to-[#ff9ca4]",
                        subject: "ML",
                        time: "02:00 PM – 03:00 PM",
                      },
                    ]
                  )
                    .filter((cls: any) =>
                      !searchQuery.trim()
                        ? true
                        : cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cls.time.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((cls: any, idx: number) => (
                      <ClassRow
                        key={idx}
                        color={
                          cls.color ||
                          (idx === 0
                            ? "bg-gradient-to-b from-[#8b48f5] to-[#66b3ef]"
                            : idx === 1
                            ? "bg-gradient-to-b from-[#0cb2b7] to-[#71d1e5]"
                            : "bg-gradient-to-b from-[#ff303d] to-[#ff9ca4]")
                        }
                        subject={cls.subject}
                        time={cls.time}
                        darkMode={darkMode}
                      />
                    ))}
                </div>

                <Link
                  href="/student/timetable"
                  className="mt-1 flex shrink-0 items-center gap-2 px-2 text-[14px] font-semibold text-[#5035d9] hover:underline"
                >
                  View Full Schedule
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* QUICK ACTIONS */}
              <div
                className={`flex h-full min-h-0 flex-col rounded-[17px] border p-4 ${
                  darkMode
                    ? "border-slate-700 bg-[#202d49]"
                    : "border-[#dce6f4] bg-white"
                } shadow-[0_5px_20px_rgba(36,74,130,0.06)]`}
              >
                <h3
                  className={`shrink-0 text-[19px] font-bold ${
                    darkMode ? "text-white" : "text-[#14224a]"
                  }`}
                >
                  Quick Actions
                </h3>

                <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-3">
                  <ActionCard
                    title="Ask AI Tutor"
                    icon={<MessageCircle size={27} />}
                    bg="bg-[#f2ebff]"
                    color="text-[#4e35d9]"
                    href="/student/ai-tutor"
                    darkMode={darkMode}
                  />

                  <ActionCard
                    title="View Notices"
                    icon={<Bell size={27} />}
                    bg="bg-[#fff2df]"
                    color="text-[#f3a52a]"
                    href="/student/notices"
                    darkMode={darkMode}
                  />

                  <ActionCard
                    title="Browse Materials"
                    icon={<BookOpen size={27} />}
                    bg="bg-[#e6f8e9]"
                    color="text-[#0da459]"
                    href="/student/materials"
                    darkMode={darkMode}
                  />

                  <ActionCard
                    title="View Timetable"
                    icon={<CalendarDays size={27} />}
                    bg="bg-[#e9f3ff]"
                    color="text-[#3039d8]"
                    href="/student/timetable"
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* NEED HELP? CARD */}
              <div className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-[17px] border border-[#cddff3] bg-gradient-to-b from-[#eefaff] via-[#f5f9ff] to-[#e7efff] p-5">
                <div>
                  <div className="relative mx-auto mb-1 flex h-[120px] w-[160px] shrink-0 items-end justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#dceeff]" />
                    <div className="absolute bottom-2 h-[85px] w-[75px] rounded-t-[50px] bg-[#f3d0bd]" />
                    <div className="absolute bottom-[58px] h-[42px] w-[55px] rounded-[50%] bg-[#1a2039]" />
                    <div className="absolute bottom-0 h-[55px] w-[100px] rounded-t-[60px] bg-[#6e95ed]" />
                    <div className="absolute bottom-[15px] left-[25px] h-[25px] w-[20px] rotate-[30deg] rounded-full bg-[#f3d0bd]" />
                    <div className="absolute bottom-[30px] right-[20px] h-[20px] w-[38px] rotate-[-25deg] rounded-full bg-[#f3d0bd]" />

                    <Lightbulb
                      className="absolute left-1 top-4 text-[#83aee5]"
                      size={20}
                    />
                    <Lightbulb
                      className="absolute right-2 top-8 text-[#83aee5]"
                      size={17}
                    />
                  </div>

                  <h3 className="shrink-0 text-[24px] font-bold text-[#101d46]">
                    Need Help?
                  </h3>

                  <p className="mt-1 text-[13px] leading-5 text-[#5b7195]">
                    Have questions about your courses or timetable? Ask our AI
                    Tutor for instant answers.
                  </p>
                </div>

                <Link
                  href="/student/ai-tutor"
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#4334d8] px-4 py-2.5 text-[14px] font-bold text-white shadow-md transition hover:bg-[#3427be]"
                >
                  <Bot size={18} /> Ask AI Tutor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, iconBg, iconColor, darkMode }: any) {
  return (
    <div
      className={`card-highlight interactive-card flex items-center gap-3.5 rounded-[16px] border p-4 shadow-[0_5px_20px_rgba(36,74,130,0.06)] ${
        darkMode ? "border-slate-700 bg-[#202d49]" : "border-[#dce6f4] bg-white"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-[13px] font-medium text-[#6b7e9e]">{title}</p>
        <p
          className={`text-[22px] font-bold ${
            darkMode ? "text-white" : "text-[#101d46]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ClassRow({ color, subject, time, darkMode }: any) {
  return (
    <div
      className={`card-highlight interactive-card flex items-center gap-3 rounded-[15px] border p-3 ${
        darkMode ? "border-slate-700 bg-[#19253f]" : "border-[#e6eef9] bg-[#fbfdff]"
      }`}
    >
      <div className={`h-11 w-2 shrink-0 rounded-full ${color}`} />

      <div>
        <h4
          className={`text-[16px] font-bold ${
            darkMode ? "text-white" : "text-[#152044]"
          }`}
        >
          {subject}
        </h4>

        <p className="text-[13px] text-[#6b7e9e]">{time}</p>
      </div>
    </div>
  );
}

function ActionCard({ title, icon, bg, color, href, darkMode }: any) {
  return (
    <Link
      href={href}
      className={`card-highlight interactive-card flex flex-col justify-between rounded-[16px] border p-4 transition ${
        darkMode
          ? "border-slate-700 bg-[#19253f] hover:bg-slate-700/50"
          : "border-[#e7eff9] bg-[#fbfdff] hover:bg-white hover:shadow-md"
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${bg} ${color}`}
      >
        {icon}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-[14px] font-bold ${
            darkMode ? "text-white" : "text-[#152043]"
          }`}
        >
          {title}
        </span>

        <ArrowRight size={16} className="text-[#65799b]" />
      </div>
    </Link>
  );
}