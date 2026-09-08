"use client";

import { useEffect, useState, useRef } from "react";
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
  Save,
  Settings,
  User,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FacultySettingsPage() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();
  const [name, setName] = useState("Faculty");
  const [email, setEmail] = useState("faculty@college.edu");
  const [profileImage, setProfileImage] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#help-support") {
      setTimeout(() => {
        document.getElementById("help-support")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "Faculty" && role !== "Admin") router.replace("/login");

    const savedName = localStorage.getItem("userName");
    const savedImg = localStorage.getItem("userProfileImage_Faculty");
    if (savedName) setName(savedName);
    if (savedImg) setProfileImage(savedImg);

    fetch("/api/faculty/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setName(data.user?.name || savedName || "Faculty");
        setEmail(data.user?.email || "faculty@college.edu");
        if (data.user?.profileImage) {
          setProfileImage(data.user.profileImage);
          localStorage.setItem("userProfileImage_Faculty", data.user.profileImage);
        }
      })
      .catch(() => {});
  }, [router]);

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

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    localStorage.setItem("userName", name);
    if (profileImage) {
      localStorage.setItem("userProfileImage_Faculty", profileImage);
    } else {
      localStorage.removeItem("userProfileImage_Faculty");
    }

    await fetch("/api/faculty/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateProfile",
        name,
        email,
        profileImage,
      }),
    }).catch(() => {});

    setSaving(false);
    setSuccessMsg("Faculty profile & picture saved successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfileImage");
    router.push("/login");
  };

  return (
    <main className={`min-h-screen p-3 ${darkMode ? "bg-[#111827]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[24px] border ${darkMode ? "border-[#263248] bg-[#172033]" : "border-white bg-[#f8fbff]"}`}>
        <aside className={`hidden w-[280px] border-r p-5 lg:flex ${darkMode ? "border-[#263248] bg-[#172033]" : "border-[#e1e8f5] bg-[#f8fbff]"}`}>
          <div className="w-full">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6651ee] to-[#3023a5] flex items-center justify-center text-white font-bold">
                AC
              </div>
              <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>AI College Copilot</div>
            </div>
            <nav className="space-y-2">
              <SidebarLink href="/faculty-dashboard" label="Dashboard" icon={<Home size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/ai-tutor" label="AI Tutor" icon={<Bot size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/materials" label="Materials" icon={<FileText size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/assignments" label="Assignments" icon={<ClipboardList size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/timetable" label="Timetable" icon={<CalendarDays size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/settings" label="Settings" icon={<Settings size={18} />} active darkMode={darkMode} />
            </nav>
          </div>
        </aside>

        <section className="flex-1">
          <header className={`flex items-center justify-between border-b px-6 py-4 ${darkMode ? "border-[#263248] bg-[#1a2438]" : "border-[#edf0f6] bg-white"}`}>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Faculty Settings</h1>
              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>Manage account details & profile picture</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white" : "border-[#e3e8f2] bg-white text-[#263b64]"}`}><Moon size={18} /></button>
              <a href="#help-support" title="Help & Support" className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white hover:bg-slate-700" : "border-[#e3e8f2] bg-white text-[#263b64] hover:bg-indigo-50"}`}><CircleHelp size={18} /></a>
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500"><LogOut size={16} /> Logout</button>
            </div>
          </header>

          <div className="p-6 max-w-4xl space-y-6">
            {successMsg && (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                <CheckCircle2 size={20} />
                {successMsg}
              </div>
            )}

            {/* Profile Picture Card */}
            <div className={`rounded-[20px] border p-6 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eee8ff] text-[#4334d8]">
                  <Camera size={22} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Profile Picture</h2>
                  <p className={darkMode ? "text-slate-300" : "text-slate-500"}>Upload or update your profile picture</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#6651ee]/30 bg-slate-200 dark:bg-slate-700 shadow-md flex items-center justify-center">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6651ee] to-[#3023a5] text-white font-bold text-3xl">
                        {name ? name.charAt(0).toUpperCase() : "F"}
                      </div>
                    )}
                  </div>
                </div>

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
                      className="flex items-center gap-2 rounded-xl bg-[#6651ee] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#523ed6] transition"
                    >
                      <Upload size={16} /> Upload Photo
                    </button>

                    {profileImage && (
                      <button
                        type="button"
                        onClick={() => setProfileImage("")}
                        className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition"
                      >
                        <Trash2 size={16} /> Remove Photo
                      </button>
                    )}
                  </div>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Supports JPG, PNG, GIF or WEBP. Maximum file size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Info Card */}
            <div className={`rounded-[20px] border p-6 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eee8ff] text-[#4334d8]">
                  <User size={22} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Profile Information</h2>
                  <p className={darkMode ? "text-slate-300" : "text-slate-500"}>Faculty details</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={`w-full rounded-xl border px-3 py-2.5 text-sm ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Email Address</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={`w-full rounded-xl border px-3 py-2.5 text-sm ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#6651ee] px-5 py-2.5 font-semibold text-white hover:bg-[#523ed6] transition disabled:opacity-60">
                  <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>

            {/* HELP & FACULTY SUPPORT SECTION */}
            <div id="help-support" className={`rounded-[20px] border p-6 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Faculty Help & Support Guide</h2>
                  <p className={darkMode ? "text-slate-300" : "text-slate-500"}>Interactive portal guides and quick actions</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Card 1: AI Copilot */}
                <Link
                  href="/faculty/ai-tutor"
                  className="group block rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 transition transform hover:-translate-y-0.5 hover:border-[#4334d8] hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#4334d8] dark:text-indigo-300 flex items-center gap-2 mb-1">
                        <span>🤖</span> How do I generate lesson plans & official notices with AI Copilot?
                      </h4>
                      <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        Use AI Copilot to generate syllabus notes, draft exam notices, or create practice problem sets instantly!
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-[#4334d8] px-3.5 py-2 text-xs font-bold text-white shadow group-hover:bg-[#3426be] transition">
                      Open AI Copilot <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>

                {/* Card 2: Materials */}
                <Link
                  href="/faculty/materials"
                  className="group block rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 transition transform hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-1">
                        <span>📚</span> How do I upload and share course materials?
                      </h4>
                      <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        Upload course slides, syllabus PDFs, or lecture notes directly to student portals.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow group-hover:bg-emerald-700 transition">
                      Course Materials <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>

                {/* Card 3: Assignments */}
                <Link
                  href="/faculty/assignments"
                  className="group block rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 transition transform hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-purple-600 dark:text-purple-300 flex items-center gap-2 mb-1">
                        <span>📝</span> How do I create assignments and track student submissions?
                      </h4>
                      <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        Set evaluation tasks, assign due dates, and monitor student completion in real time.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow group-hover:bg-purple-700 transition">
                      Assignments Portal <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>

                {/* Card 4: Timetable */}
                <Link
                  href="/faculty/timetable"
                  className="group block rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 transition transform hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-blue-600 dark:text-blue-300 flex items-center gap-2 mb-1">
                        <span>🗓️</span> How do I view my teaching timetable & lecture schedule?
                      </h4>
                      <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        Access your weekly timetable, classroom numbers, and subject schedules.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow group-hover:bg-blue-700 transition">
                      View Timetable <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarLink({ href, label, icon, active, darkMode }: { href: string; label: string; icon: React.ReactNode; active?: boolean; darkMode: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? (darkMode ? "bg-[#283556] text-[#6b63ff]" : "bg-[#e9e8ff] text-[#4c56dc]") : (darkMode ? "text-slate-300 hover:bg-[#202c42]" : "text-[#29446f] hover:bg-[#f0f3ff]")}`}>
      {icon}
      {label}
    </Link>
  );
}
