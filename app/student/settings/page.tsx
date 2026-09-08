"use client";

import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import StudentHeader from "@/components/StudentHeader";
import {
  Home,
  Bot,
  Bell,
  FileText,
  CalendarDays,
  ClipboardList,
  ChartNoAxesCombined,
  Settings as SettingsIcon,
  Moon,
  ChevronDown,
  CircleHelp,
  User,
  Mail,
  IdCard,
  Shield,
  Save,
  CheckCircle2,
  LogOut,
  Camera,
  Upload,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();

  const [name, setName] = useState("Student");
  const [email, setEmail] = useState("student@college.edu");
  const [collegeId, setCollegeId] = useState("123");
  const [role, setRole] = useState("Student");
  const [profileImage, setProfileImage] = useState<string>("");

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [examUpdates, setExamUpdates] = useState(true);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedImg = localStorage.getItem("userProfileImage_Student");
    if (savedName) setName(savedName);
    if (savedImg) setProfileImage(savedImg);

    fetch("/api/student/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setName(data.settings.name || savedName || "Student");
          setEmail(data.settings.email || "student@college.edu");
          setCollegeId(data.settings.collegeId || "123");
          setRole(data.settings.role || "Student");
          if (data.settings.profileImage) {
            setProfileImage(data.settings.profileImage);
            localStorage.setItem("userProfileImage_Student", data.settings.profileImage);
          }
          if (data.settings.notifications) {
            setEmailAlerts(data.settings.notifications.emailAlerts ?? true);
            setAssignmentReminders(data.settings.notifications.assignmentReminders ?? true);
            setExamUpdates(data.settings.notifications.examUpdates ?? true);
          }
        }
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      localStorage.setItem("userName", name);
      if (profileImage) {
        localStorage.setItem("userProfileImage_Student", profileImage);
      } else {
        localStorage.removeItem("userProfileImage_Student");
      }

      const res = await fetch("/api/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          collegeId,
          profileImage,
          notifications: { emailAlerts, assignmentReminders, examUpdates },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Profile picture and settings saved successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("userName");
      localStorage.removeItem("userProfileImage");
      router.push("/login");
    }
  };

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/student/dashboard" },
    { label: "AI Tutor", icon: Bot, href: "/student/ai-tutor" },
    { label: "Notices", icon: Bell, href: "/student/notices" },
    { label: "Materials", icon: FileText, href: "/student/materials" },
    { label: "Timetable", icon: CalendarDays, href: "/student/timetable" },
    { label: "Assignments", icon: ClipboardList, href: "/student/assignments" },
    { label: "Progress", icon: ChartNoAxesCombined, href: "/student/progress" },
    { label: "Settings", icon: SettingsIcon, href: "/student/settings", active: true },
  ];

  return (
    <main className={`h-screen overflow-hidden p-2 sm:p-3 ${darkMode ? "bg-[#11182b]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex h-full max-w-[1550px] overflow-hidden rounded-[20px] border ${darkMode ? "border-slate-700 bg-[#18223a]" : "border-[#dce7f8] bg-white"} shadow-sm`}>
        
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

            <a href="#help-support" title="Help & Support">
              <CircleHelp
                size={24}
                className={darkMode ? "text-white hover:text-indigo-400" : "text-[#17234b] hover:text-[#3934d8]"}
              />
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1 flex flex-col">
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={name || "Student"}
            searchPlaceholder="Search profile, FAQs, settings..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-1 overflow-y-auto p-8 max-w-4xl">
            {successMsg && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-emerald-600 dark:text-emerald-400 text-[14px] font-semibold">
                <CheckCircle2 size={20} />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">

              {/* PROFILE PICTURE SECTION */}
              <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-600/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee8ff] text-[#4334d8]">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                      Profile Picture
                    </h3>
                    <p className={`text-[12px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      Upload a custom photo or choose a profile avatar
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Picture Preview */}
                  <div className="relative group">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#4334d8]/30 bg-slate-200 dark:bg-slate-700 shadow-md flex items-center justify-center">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#4334d8] to-[#6859f7] text-white font-bold text-3xl">
                          {name ? name.charAt(0).toUpperCase() : "S"}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 rounded-full bg-[#4334d8] p-2 text-white shadow-lg hover:bg-[#3426be] transition"
                    >
                      <Camera size={16} />
                    </button>
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-3 text-center sm:text-left">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl bg-[#eee8ff] dark:bg-indigo-950/60 px-4 py-2.5 text-[13px] font-bold text-[#4334d8] dark:text-indigo-300 hover:bg-[#e2d9ff] transition"
                      >
                        <Upload size={16} /> Upload Photo
                      </button>

                      {profileImage && (
                        <button
                          type="button"
                          onClick={() => setProfileImage("")}
                          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-500/20 transition"
                        >
                          <Trash2 size={16} /> Remove Photo
                        </button>
                      )}
                    </div>

                    <p className={`text-[12px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      Supports JPG, PNG, GIF or WEBP. Maximum file size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* PERSONAL INFO CARD */}
              <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-600/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee8ff] text-[#4334d8]">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                      Personal Details
                    </h3>
                    <p className={`text-[12px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      Your official college identity details
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={`block text-[13px] font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User size={18} className="absolute left-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-[14px] outline-none ${
                          darkMode ? "border-slate-600 bg-[#17223a] text-white" : "border-gray-200 bg-gray-50 text-gray-900"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[13px] font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={18} className="absolute left-3.5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-[14px] outline-none ${
                          darkMode ? "border-slate-600 bg-[#17223a] text-white" : "border-gray-200 bg-gray-50 text-gray-900"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[13px] font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                      College Roll / ID
                    </label>
                    <div className="relative flex items-center">
                      <IdCard size={18} className="absolute left-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={collegeId}
                        onChange={(e) => setCollegeId(e.target.value)}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-[14px] outline-none ${
                          darkMode ? "border-slate-600 bg-[#17223a] text-white" : "border-gray-200 bg-gray-50 text-gray-900"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[13px] font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                      Account Role
                    </label>
                    <div className="relative flex items-center">
                      <Shield size={18} className="absolute left-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={role}
                        disabled
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-[14px] opacity-70 ${
                          darkMode ? "border-slate-600 bg-[#17223a] text-white" : "border-gray-200 bg-gray-100 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* NOTIFICATION PREFERENCES */}
              <div className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-600/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0da] text-[#efa328]">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                      Notifications & Alerts
                    </h3>
                    <p className={`text-[12px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      Choose what updates you want to receive
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className={`text-[14px] font-medium ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                      Email Notifications
                    </span>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-[#4334d8] focus:ring-[#4334d8]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className={`text-[14px] font-medium ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                      Assignment Deadline Reminders
                    </span>
                    <input
                      type="checkbox"
                      checked={assignmentReminders}
                      onChange={(e) => setAssignmentReminders(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-[#4334d8] focus:ring-[#4334d8]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className={`text-[14px] font-medium ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                      Exam Timetable & Announcement Alerts
                    </span>
                    <input
                      type="checkbox"
                      checked={examUpdates}
                      onChange={(e) => setExamUpdates(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-[#4334d8] focus:ring-[#4334d8]"
                    />
                  </label>
                </div>
              </div>

              {/* HELP & STUDENT SUPPORT / FAQS */}
              <div id="help-support" className={`rounded-2xl border p-6 ${darkMode ? "border-slate-700 bg-[#1f2c4d]" : "border-[#e5edf9] bg-white"} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-600/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#101c43]"}`}>
                      Help & Student Support (Interactive Guide)
                    </h3>
                    <p className={`text-[12px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      Click any card below to perform the action directly
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Card 1: AI Tutor */}
                  <Link
                    href="/student/ai-tutor"
                    className="group block rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 transition transform hover:-translate-y-0.5 hover:border-[#4334d8] hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-[#4334d8] dark:text-indigo-300 flex items-center gap-2 mb-1">
                          <span>🤖</span> How do I use the AI Tutor & Practice Quizzes?
                        </h4>
                        <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                          Ask any computer science topic, request practice quizzes, or type <em>"Quiz me on DBMS"</em>!
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-[#4334d8] px-3.5 py-2 text-xs font-bold text-white shadow group-hover:bg-[#3426be] transition">
                        Open AI Tutor <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>

                  {/* Card 2: Upload Photo */}
                  <button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setTimeout(() => fileInputRef.current?.click(), 300);
                    }}
                    className="group block w-full text-left rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 transition transform hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-1">
                          <span>🖼️</span> How do I update my profile picture?
                        </h4>
                        <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                          Click here to select your JPG or PNG image. Your avatar immediately updates across all pages.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow group-hover:bg-emerald-700 transition">
                        <Camera size={14} /> Upload Photo Now
                      </span>
                    </div>
                  </button>

                  {/* Card 3: Notices */}
                  <Link
                    href="/student/notices"
                    className="group block rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 transition transform hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-purple-600 dark:text-purple-300 flex items-center gap-2 mb-1">
                          <span>📜</span> How do I view and download official PDF notices?
                        </h4>
                        <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                          Read official university announcements and download verified PDF circulars with signatures.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow group-hover:bg-purple-700 transition">
                        View Notices <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#4334d8] px-6 py-3 text-[14px] font-bold text-white shadow-lg hover:bg-[#3426be] transition disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving Changes..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
