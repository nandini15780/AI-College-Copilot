"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  ChartNoAxesCombined,
  Bot,
  LogOut,
  X,
  ArrowRight,
} from "lucide-react";

interface StudentHeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userName: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export default function StudentHeader({
  darkMode,
  setDarkMode,
  userName,
  searchPlaceholder = "Search anything...",
  searchValue,
  onSearchChange,
}: StudentHeaderProps) {
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notices, setNotices] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedImg = localStorage.getItem("userProfileImage_Student");
    if (savedImg) setProfileImage(savedImg);
  }, []);

  useEffect(() => {
    fetch("/api/student/notices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.notices) {
          setNotices(data.notices);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <header
      className={`flex h-[75px] shrink-0 items-center justify-between border-b px-5 sm:px-8 ${
        darkMode ? "border-slate-700 bg-[#19253f]" : "border-[#e7eef9] bg-[#fbfdff]"
      }`}
    >
      {/* SEARCH BAR */}
      <div
        className={`flex h-[40px] w-full max-w-[480px] items-center gap-3 rounded-[16px] border px-4 ${
          darkMode ? "border-slate-600 bg-slate-800" : "border-[#dbe5f3] bg-white"
        }`}
      >
        <Search size={20} className={darkMode ? "text-slate-300" : "text-[#51698f]"} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue !== undefined ? searchValue : ""}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className={`w-full bg-transparent text-[14px] outline-none placeholder:text-[#6e82a5] ${
            darkMode ? "text-white" : "text-[#1a2a4f]"
          }`}
        />
      </div>

      {/* RIGHT ACTIONS */}
      <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-4">
        {/* DARK MODE TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
          className={`flex h-10 w-10 items-center justify-center rounded-[14px] border transition ${
            darkMode
              ? "border-slate-700 bg-[#131c31] text-amber-400 hover:bg-slate-800"
              : "border-[#e5edf9] bg-[#f8fbff] text-[#7a889b] hover:bg-gray-100"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* NOTIFICATION BELL */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileMenuOpen(false);
            }}
            title="Notifications"
            className={`relative flex h-10 w-10 items-center justify-center rounded-[14px] border transition ${
              darkMode
                ? "border-slate-700 bg-[#131c31] text-white hover:bg-slate-800"
                : "border-[#e5edf9] bg-[#f8fbff] text-[#25375d] hover:bg-gray-100"
            }`}
          >
            <Bell size={20} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f04452] text-[10px] font-bold text-white shadow-sm">
              {notices.length || 3}
            </span>
          </button>

          {/* NOTIFICATION POPOVER */}
          {notificationsOpen && (
            <div
              className={`absolute right-0 top-14 z-50 w-80 sm:w-96 rounded-2xl border p-4 shadow-2xl transition-all ${
                darkMode
                  ? "border-slate-700 bg-[#18243e] text-white"
                  : "border-[#e2ebf8] bg-white text-gray-800"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-[#4334d8]" />
                  <h4 className="font-bold text-[15px]">Notifications</h4>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    {notices.length || 3} unread
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="my-2 max-h-72 overflow-y-auto space-y-2 pr-1">
                {(notices.length > 0
                  ? notices.slice(0, 4)
                  : [
                      {
                        title: "Exam timetable released",
                        category: "Urgent",
                        date: "Today",
                        department: "Examination Cell",
                      },
                      {
                        title: "College event registration open",
                        category: "Event",
                        date: "Yesterday",
                        department: "Student Council",
                      },
                      {
                        title: "Assignment submission deadline notice",
                        category: "Academic",
                        date: "2 days ago",
                        department: "CSE Department",
                      },
                    ]
                ).map((n: any, idx: number) => (
                  <Link
                    key={idx}
                    href="/student/notices"
                    onClick={() => setNotificationsOpen(false)}
                    className={`block rounded-xl p-3 border transition ${
                      darkMode
                        ? "border-slate-700/60 bg-[#1f2d4b] hover:bg-slate-700/60"
                        : "border-gray-100 bg-gray-50 hover:bg-indigo-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          n.category === "Urgent"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                            : n.category === "Event"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                        }`}
                      >
                        {n.category || "Notice"}
                      </span>
                      <span className="text-[11px] text-gray-400">{n.date || "Today"}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] font-semibold line-clamp-1">{n.title}</p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">
                      {n.department || "Admin"}
                    </p>
                  </Link>
                ))}
              </div>

              <Link
                href="/student/notices"
                onClick={() => setNotificationsOpen(false)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 dark:border-indigo-900/50 dark:bg-indigo-950/40 py-2.5 text-center text-[13px] font-bold text-[#4334d8] dark:text-indigo-300 hover:bg-indigo-100 transition"
              >
                View All Notices <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* USER PROFILE SYMBOL */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl p-1 outline-none hover:opacity-90 transition"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f0d4c8] shadow-sm border border-orange-200 dark:border-slate-600">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="mt-2 h-8 w-7 rounded-t-full bg-[#171a32]" />
              )}
            </div>

            <div className="hidden text-left sm:block">
              <p className={`text-[14px] font-bold leading-tight ${darkMode ? "text-white" : "text-[#182348]"}`}>
                {userName || "Student"}
              </p>
              <p className="text-[12px] text-[#617596]">Student</p>
            </div>

            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""} ${
                darkMode ? "text-white" : "text-[#17234b]"
              }`}
            />
          </button>

          {/* PROFILE DROPDOWN MENU */}
          {profileMenuOpen && (
            <div
              className={`absolute right-0 top-14 z-50 w-60 rounded-2xl border p-2 shadow-2xl transition-all ${
                darkMode
                  ? "border-slate-700 bg-[#18243e] text-white"
                  : "border-[#e2ebf8] bg-white text-gray-800"
              }`}
            >
              <div className="px-3 py-2.5 border-b border-gray-100 dark:border-slate-700/60">
                <p className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                  {userName || "Student"}
                </p>
                <p className="text-[12px] font-medium text-indigo-600 dark:text-indigo-400">
                  Student Account
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/student/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                    darkMode ? "hover:bg-slate-700/60 text-slate-200" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Settings size={16} className="text-indigo-500" /> Profile & Settings
                </Link>

                <Link
                  href="/student/progress"
                  onClick={() => setProfileMenuOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                    darkMode ? "hover:bg-slate-700/60 text-slate-200" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <ChartNoAxesCombined size={16} className="text-emerald-500" /> Academic Progress
                </Link>

                <Link
                  href="/student/ai-tutor"
                  onClick={() => setProfileMenuOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                    darkMode ? "hover:bg-slate-700/60 text-slate-200" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Bot size={16} className="text-purple-500" /> AI Tutor
                </Link>
              </div>

              <div className="pt-1 border-t border-gray-100 dark:border-slate-700/60">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
