"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Bot,
  FileText,
  ClipboardCheck,
  Bell,
  Settings,
  Users,
  GraduationCap,
  UserRound,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Menu,
  X,
  Moon,
  Search,
  Plus,
  Trash2,
  Database,
  RefreshCw,
  Check,
  LogOut,
  Shield,
  Eye,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Faculty" | "Admin";
  collegeId?: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "database" | "settings">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Overview Data
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    faculty: 0,
    admins: 0,
    totalMaterials: 0,
    totalNotices: 0,
    sharedChatsCount: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // User Management State
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Add User Modal State
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserCollegeId, setNewUserCollegeId] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Student" | "Faculty" | "Admin">("Student");
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);

  // Delete User Confirmation Modal
  const [deleteUserTarget, setDeleteUserTarget] = useState<UserItem | null>(null);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);

  // Database Inspector State
  const [dbTable, setDbTable] = useState("users");
  const [dbData, setDbData] = useState<any>(null);
  const [dbTablesList, setDbTablesList] = useState<any[]>([]);
  const [dbRecordCount, setDbRecordCount] = useState(0);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbViewMode, setDbViewMode] = useState<"table" | "json">("table");

  // Notification / Feedback banner
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserName(localStorage.getItem("userName") || "Admin");
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    setOverviewLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (data.activities) setActivities(data.activities);
      }
    } catch (err) {
      console.error("Failed to load admin overview:", err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadUsers = async (roleFilter = userRoleFilter, search = userSearchQuery) => {
    setUsersLoading(true);
    try {
      const url = new URL("/api/admin/users", window.location.origin);
      if (roleFilter && roleFilter !== "All") url.searchParams.append("role", roleFilter);
      if (search) url.searchParams.append("query", search);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadDatabaseTable = async (tableName = dbTable) => {
    setDbLoading(true);
    try {
      const res = await fetch(`/api/admin/database?table=${tableName}`);
      const data = await res.json();
      if (data.success) {
        setDbData(data.data);
        if (data.availableTables) setDbTablesList(data.availableTables);
        setDbRecordCount(data.recordCount || 0);
      }
    } catch (err) {
      console.error("Failed to load database table:", err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "database") {
      loadDatabaseTable();
    }
  }, [activeTab]);

  const handleRoleChange = async (userId: string, newRole: "Student" | "Faculty" | "Admin") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`User role updated to ${newRole}`);
        loadUsers();
        loadOverviewData();
      } else {
        showNotification(data.error || "Failed to update role");
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);
    setAddUserLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          collegeId: newUserCollegeId,
          password: newUserPassword,
          role: newUserRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddUserError(data.error || "Failed to create user");
        setAddUserLoading(false);
        return;
      }

      showNotification(`User ${newUserName} created successfully!`);
      setAddUserModalOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserCollegeId("");
      setNewUserPassword("");
      loadUsers();
      loadOverviewData();
    } catch (err) {
      setAddUserError("Unexpected error occurred.");
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserTarget) return;
    setDeleteUserLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${deleteUserTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`User ${deleteUserTarget.name} deleted.`);
        setDeleteUserTarget(null);
        loadUsers();
        loadOverviewData();
      } else {
        showNotification(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setDeleteUserLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <main className={`min-h-screen p-2 sm:p-3 lg:p-4 ${darkMode ? "bg-[#111827]" : "bg-[#edf3ff]"}`}>
      <div className={`relative mx-auto flex h-[calc(100vh-16px)] max-w-[1600px] overflow-hidden rounded-[24px] border shadow-[0_10px_40px_rgba(70,90,150,0.12)] ${
        darkMode ? "border-[#263248] bg-[#172033]" : "border-white bg-[#f8fbff]"
      }`}>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl lg:hidden ${
            darkMode ? "bg-[#263248] text-white" : "bg-white text-[#18315e]"
          }`}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* SIDEBAR */}
        <aside
          className={`absolute inset-y-0 left-0 z-40 w-[300px] shrink-0 border-r transition-transform duration-300 lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${darkMode ? "border-[#263248] bg-[#172033]" : "border-[#e1e8f5] bg-[#f8fbff]"}`}
        >
          {/* LOGO */}
          <div className="flex items-center gap-3 px-7 pb-6 pt-7">
            <div className="relative h-[48px] w-[54px] shrink-0">
              <div
                className="absolute left-[1px] top-[2px] h-[30px] w-[50px] bg-gradient-to-br from-[#6651ee] to-[#3023a5]"
                style={{ clipPath: "polygon(50% 0%, 100% 45%, 50% 90%, 0% 45%)" }}
              />
              <div className="absolute left-[10px] top-[23px] h-[18px] w-[36px] rounded-b-[17px] bg-[#30239c]" />
              <div className="absolute left-[47px] top-[20px] h-[28px] w-[3px] bg-[#5041c7]" />
              <div className="absolute left-[44px] top-[45px] h-[6px] w-[6px] rounded-full bg-[#5041c7]" />
            </div>

            <div>
              <h1 className={`whitespace-nowrap text-[20px] font-bold tracking-[-0.5px] ${darkMode ? "text-white" : "text-[#152653]"}`}>
                AI College Copilot
              </h1>
              <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#6547ec]">
                <Shield size={13} /> Admin Console
              </span>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="mt-4 space-y-2 px-4">
            <NavItem
              icon={<BarChart3 size={22} />}
              label="System Overview"
              active={activeTab === "overview"}
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              darkMode={darkMode}
            />

            <NavItem
              icon={<Users size={22} />}
              label="User Management"
              active={activeTab === "users"}
              onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
              badge={`${stats.totalUsers}`}
              darkMode={darkMode}
            />

            <NavItem
              icon={<Database size={22} />}
              label="Database Inspector"
              active={activeTab === "database"}
              onClick={() => { setActiveTab("database"); setSidebarOpen(false); }}
              darkMode={darkMode}
            />

            <NavItem
              icon={<Settings size={22} />}
              label="System Settings"
              active={activeTab === "settings"}
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              darkMode={darkMode}
            />
          </nav>

          {/* BOTTOM ACTIONS */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold ${
                darkMode ? "border-[#35435e] bg-[#202c42] text-white" : "border-[#e3e8f2] bg-white text-[#263b64]"
              }`}
            >
              <Moon size={18} />
              <span>{darkMode ? "Dark" : "Light"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-[14px] font-semibold text-red-500 hover:bg-red-500/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <section className="min-w-0 flex-1 flex flex-col overflow-hidden">
          {/* HEADER */}
          <header className={`flex h-[95px] shrink-0 items-center justify-between border-b px-7 sm:px-9 ${
            darkMode ? "border-[#263248]" : "border-[#e6ebf4]"
          }`}>
            <div className="ml-10 lg:ml-0">
              <h2 className={`text-[28px] font-bold tracking-tight ${darkMode ? "text-white" : "text-[#12295b]"}`}>
                {activeTab === "overview" && "System Overview"}
                {activeTab === "users" && "User Account Management"}
                {activeTab === "database" && "Live Database Inspector"}
                {activeTab === "settings" && "System Settings"}
              </h2>
              <p className={`text-[14px] ${darkMode ? "text-slate-400" : "text-[#7085a8]"}`}>
                Full administrative access & real-time system monitoring
              </p>
            </div>

            {/* PROFILE & REFRESH */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (activeTab === "overview") loadOverviewData();
                  if (activeTab === "users") loadUsers();
                  if (activeTab === "database") loadDatabaseTable();
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  darkMode ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-[#dce6f4] bg-white text-[#384e75] hover:bg-[#edf3ff]"
                }`}
                title="Refresh current view"
              >
                <RefreshCw size={18} className={overviewLoading || usersLoading || dbLoading ? "animate-spin" : ""} />
              </button>

              {/* INTERACTIVE PROFILE SYMBOL & DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-1.5 transition ${
                    darkMode
                      ? "border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white"
                      : "border-[#dce6f4] bg-white hover:bg-[#edf3ff] text-[#172b55]"
                  } shadow-sm cursor-pointer`}
                  title="Open Admin Profile & Options"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6547ec] to-[#754be9] text-[15px] font-bold text-white shadow-md">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className={`text-[14px] font-bold leading-tight ${darkMode ? "text-white" : "text-[#172b55]"}`}>{userName}</p>
                    <p className="text-[12px] font-semibold text-[#6547ec]">Administrator</p>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* DROPDOWN MENU */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div
                      className={`absolute right-0 mt-2 z-50 w-64 rounded-2xl border p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 ${
                        darkMode ? "border-slate-700 bg-[#1a2438] text-white" : "border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <div className="px-3 py-2.5 border-b border-slate-700/30 mb-1">
                        <p className="font-bold text-sm truncate">{userName}</p>
                        <p className="text-xs text-[#6547ec] font-semibold">System Administrator</p>
                      </div>

                      <div className="space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveTab("settings");
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            darkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-indigo-50 text-slate-700"
                          }`}
                        >
                          <Settings size={15} className="text-indigo-500" />
                          <span>System Settings</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("users");
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            darkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-indigo-50 text-slate-700"
                          }`}
                        >
                          <Users size={15} className="text-emerald-500" />
                          <span>Manage Users</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("database");
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            darkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-indigo-50 text-slate-700"
                          }`}
                        >
                          <Database size={15} className="text-amber-500" />
                          <span>Live Database Inspector</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("overview");
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            darkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-indigo-50 text-slate-700"
                          }`}
                        >
                          <BarChart3 size={15} className="text-blue-500" />
                          <span>System Overview</span>
                        </button>

                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            darkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-indigo-50 text-slate-700"
                          }`}
                        >
                          <Moon size={15} className="text-purple-500" />
                          <span>Theme: {darkMode ? "Dark Mode" : "Light Mode"}</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-700/30 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition"
                        >
                          <LogOut size={15} />
                          <span>Logout Account</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* NOTIFICATION FEEDBACK TOAST */}
          {notification && (
            <div className="mx-7 mt-4 flex items-center gap-3 rounded-[14px] border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300 animate-in fade-in">
              <Check size={18} className="shrink-0 text-green-600" />
              <p className="text-[14px] font-bold">{notification}</p>
            </div>
          )}

          {/* CONTENT PANELS */}
          <div className="flex-1 overflow-y-auto px-7 py-6 sm:px-9">
            
            {/* ================= TAB 1: SYSTEM OVERVIEW ================= */}
            {activeTab === "overview" && (
              <div>
                {/* STAT CARDS */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    icon={<Users size={26} />}
                    title="Total Registered Users"
                    value={stats.totalUsers}
                    subtitle={`${stats.students} Students • ${stats.faculty} Faculty`}
                    bg="bg-[#e2faef]"
                    iconBg="bg-[#19b978]"
                    darkMode={darkMode}
                  />

                  <StatCard
                    icon={<GraduationCap size={26} />}
                    title="Active Students"
                    value={stats.students}
                    subtitle="Enrolled student profiles"
                    bg="bg-[#e5f2ff]"
                    iconBg="bg-[#1682df]"
                    darkMode={darkMode}
                  />

                  <StatCard
                    icon={<UserRound size={26} />}
                    title="Faculty Members"
                    value={stats.faculty}
                    subtitle="Professors & Instructors"
                    bg="bg-[#f1eaff]"
                    iconBg="bg-[#8141dc]"
                    darkMode={darkMode}
                  />

                  <StatCard
                    icon={<Shield size={26} />}
                    title="Administrators"
                    value={stats.admins}
                    subtitle="System Managers"
                    bg="bg-[#fff6df]"
                    iconBg="bg-[#dfa20e]"
                    darkMode={darkMode}
                  />
                </div>

                {/* LOWER DASHBOARD GRID */}
                <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.1fr]">
                  {/* QUICK ACTIONS */}
                  <div className={`rounded-[20px] border p-6 shadow-sm ${
                    darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"
                  }`}>
                    <h3 className={`text-[20px] font-bold mb-4 ${darkMode ? "text-white" : "text-[#122b5d]"}`}>
                      Administrative Actions
                    </h3>

                    <div className="space-y-3">
                      <ActionItem
                        icon={<Users size={22} />}
                        title="Manage User Accounts & Roles"
                        description="View, promote, or remove student and faculty accounts"
                        onClick={() => setActiveTab("users")}
                        darkMode={darkMode}
                      />

                      <ActionItem
                        icon={<Plus size={22} />}
                        title="Create New User Account"
                        description="Directly register a new Student, Faculty, or Admin"
                        onClick={() => {
                          setActiveTab("users");
                          setAddUserModalOpen(true);
                        }}
                        darkMode={darkMode}
                      />

                      <ActionItem
                        icon={<Database size={22} />}
                        title="Inspect Live Database Tables"
                        description="View JSON data files for users, chats, materials and notices"
                        onClick={() => setActiveTab("database")}
                        darkMode={darkMode}
                      />

                      <ActionItem
                        icon={<Settings size={22} />}
                        title="System & Platform Settings"
                        description="Configure maintenance mode and application defaults"
                        onClick={() => setActiveTab("settings")}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>

                  {/* RECENT ACTIVITY & METRICS */}
                  <div className={`rounded-[20px] border p-6 shadow-sm ${
                    darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"
                  }`}>
                    <h3 className={`text-[20px] font-bold mb-4 ${darkMode ? "text-white" : "text-[#122b5d]"}`}>
                      System Activity & Summary
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-[14px] bg-[#f5f8ff] dark:bg-slate-800/60 p-4 border border-[#e3ebf8] dark:border-slate-700">
                        <div>
                          <p className="text-[14px] font-bold text-[#1a2b53] dark:text-slate-200">Shared AI Tutor Sessions</p>
                          <p className="text-[13px] text-[#60749a] dark:text-slate-400">Publicly shared chat links</p>
                        </div>
                        <span className="rounded-full bg-[#6547ec] px-4 py-1.5 text-[15px] font-bold text-white">
                          {stats.sharedChatsCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-[14px] bg-[#f5f8ff] dark:bg-slate-800/60 p-4 border border-[#e3ebf8] dark:border-slate-700">
                        <div>
                          <p className="text-[14px] font-bold text-[#1a2b53] dark:text-slate-200">Study Materials Uploaded</p>
                          <p className="text-[13px] text-[#60749a] dark:text-slate-400">Total course PDFs & lectures</p>
                        </div>
                        <span className="rounded-full bg-[#1682df] px-4 py-1.5 text-[15px] font-bold text-white">
                          {stats.totalMaterials}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-[14px] bg-[#f5f8ff] dark:bg-slate-800/60 p-4 border border-[#e3ebf8] dark:border-slate-700">
                        <div>
                          <p className="text-[14px] font-bold text-[#1a2b53] dark:text-slate-200">Published Notices</p>
                          <p className="text-[13px] text-[#60749a] dark:text-slate-400">System notice posts</p>
                        </div>
                        <span className="rounded-full bg-[#19b978] px-4 py-1.5 text-[15px] font-bold text-white">
                          {stats.totalNotices}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: USER MANAGEMENT ================= */}
            {activeTab === "users" && (
              <div>
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  {/* ROLE FILTER TABS */}
                  <div className="flex rounded-[14px] bg-[#edf2fa] dark:bg-slate-800 p-1.5">
                    {["All", "Student", "Faculty", "Admin"].map((roleOption) => (
                      <button
                        key={roleOption}
                        onClick={() => {
                          setUserRoleFilter(roleOption);
                          loadUsers(roleOption, userSearchQuery);
                        }}
                        className={`rounded-[10px] px-4 py-2 text-[14px] font-bold transition ${
                          userRoleFilter === roleOption
                            ? "bg-white text-[#5237e5] shadow-sm dark:bg-[#263550] dark:text-purple-300"
                            : "text-[#586d93] hover:text-[#182952] dark:text-slate-400"
                        }`}
                      >
                        {roleOption}
                      </button>
                    ))}
                  </div>

                  {/* SEARCH & ADD USER BUTTON */}
                  <div className="flex items-center gap-3">
                    <div className={`flex h-[46px] items-center rounded-[14px] border px-4 ${
                      darkMode ? "border-slate-700 bg-slate-800 text-white" : "border-[#dce4f2] bg-white text-[#1c2d54]"
                    }`}>
                      <Search size={18} className="mr-2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={userSearchQuery}
                        onChange={(e) => {
                          setUserSearchQuery(e.target.value);
                          loadUsers(userRoleFilter, e.target.value);
                        }}
                        className="bg-transparent text-[14px] outline-none placeholder:text-slate-400 w-48 sm:w-64"
                      />
                    </div>

                    <button
                      onClick={() => setAddUserModalOpen(true)}
                      className="flex h-[46px] items-center gap-2 rounded-[14px] bg-gradient-to-r from-[#6547ec] to-[#754be9] px-5 text-[14px] font-bold text-white shadow-md transition hover:brightness-105 active:scale-95 shrink-0"
                    >
                      <Plus size={18} />
                      Add New User
                    </button>
                  </div>
                </div>

                {/* USERS TABLE */}
                <div className={`overflow-hidden rounded-[20px] border shadow-sm ${
                  darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"
                }`}>
                  {usersLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-[#6547ec]" />
                      <p className="text-[14px] text-slate-500">Loading user accounts...</p>
                    </div>
                  ) : usersList.length === 0 ? (
                    <div className="py-16 text-center">
                      <Users size={40} className="mx-auto text-slate-400 mb-3" />
                      <p className={`text-[18px] font-bold ${darkMode ? "text-white" : "text-[#182a52]"}`}>No users found</p>
                      <p className="text-[14px] text-slate-400 mt-1">Try adjusting your search query or filter.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-[13px] font-bold uppercase tracking-wider ${
                            darkMode ? "border-[#2d3a52] bg-[#172236] text-slate-400" : "border-[#e9effa] bg-[#f6f9fe] text-[#5d7398]"
                          }`}>
                            <th className="py-4 px-6">User</th>
                            <th className="py-4 px-6">Role</th>
                            <th className="py-4 px-6">ID / Roll No</th>
                            <th className="py-4 px-6">Registered Date</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50 text-[14px]">
                          {usersList.map((user) => (
                            <tr key={user.id} className={`transition ${
                              darkMode ? "hover:bg-slate-800/40" : "hover:bg-[#f8fafe]"
                            }`}>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eeeaff] dark:bg-slate-700 text-[#5438e3] font-bold">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                  </div>
                                  <div>
                                    <p className={`font-bold ${darkMode ? "text-white" : "text-[#152754]"}`}>{user.name}</p>
                                    <p className={`text-[13px] ${darkMode ? "text-slate-400" : "text-[#6c80a2]"}`}>{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                  className={`rounded-lg border px-3 py-1.5 text-[13px] font-bold outline-none cursor-pointer ${
                                    user.role === "Admin"
                                      ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
                                      : user.role === "Faculty"
                                      ? "border-purple-300 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300"
                                      : "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                                  }`}
                                >
                                  <option value="Student">Student</option>
                                  <option value="Faculty">Faculty</option>
                                  <option value="Admin">Admin</option>
                                </select>
                              </td>
                              <td className={`py-4 px-6 font-mono text-[13px] ${darkMode ? "text-slate-300" : "text-[#344b72]"}`}>
                                {user.collegeId || "N/A"}
                              </td>
                              <td className={`py-4 px-6 text-[13px] ${darkMode ? "text-slate-400" : "text-[#6e82a4]"}`}>
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "System"}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setDeleteUserTarget(user)}
                                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                                  title="Delete User"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 3: DATABASE INSPECTOR ================= */}
            {activeTab === "database" && (
              <div>
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  {/* TABLE SELECTOR DROPDOWN */}
                  <div className="flex items-center gap-3">
                    <label className={`text-[14px] font-bold ${darkMode ? "text-slate-300" : "text-[#253961]"}`}>
                      Select Table:
                    </label>
                    <select
                      value={dbTable}
                      onChange={(e) => {
                        setDbTable(e.target.value);
                        loadDatabaseTable(e.target.value);
                      }}
                      className={`h-[46px] rounded-[14px] border px-4 text-[14px] font-bold outline-none cursor-pointer ${
                        darkMode ? "border-slate-700 bg-slate-800 text-white" : "border-[#dce4f2] bg-white text-[#17274e]"
                      }`}
                    >
                      {dbTablesList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* VIEW MODE & REFRESH */}
                  <div className="flex items-center gap-3">
                    <div className="flex rounded-[12px] bg-[#edf2fa] dark:bg-slate-800 p-1">
                      <button
                        onClick={() => setDbViewMode("table")}
                        className={`rounded-[9px] px-3.5 py-1.5 text-[13px] font-bold transition ${
                          dbViewMode === "table" ? "bg-white text-[#5237e5] shadow-sm dark:bg-[#263550] dark:text-purple-300" : "text-slate-500"
                        }`}
                      >
                        Table View
                      </button>
                      <button
                        onClick={() => setDbViewMode("json")}
                        className={`rounded-[9px] px-3.5 py-1.5 text-[13px] font-bold transition ${
                          dbViewMode === "json" ? "bg-white text-[#5237e5] shadow-sm dark:bg-[#263550] dark:text-purple-300" : "text-slate-500"
                        }`}
                      >
                        Raw JSON
                      </button>
                    </div>

                    <button
                      onClick={() => loadDatabaseTable()}
                      className={`flex h-[44px] items-center gap-2 rounded-[14px] border px-4 text-[13px] font-bold transition ${
                        darkMode ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700" : "border-[#dce4f2] bg-white text-[#2a3f68] hover:bg-[#f5f8ff]"
                      }`}
                    >
                      <RefreshCw size={16} className={dbLoading ? "animate-spin" : ""} />
                      Reload
                    </button>
                  </div>
                </div>

                {/* TABLE DESCRIPTION BADGE */}
                <div className="mb-4 flex items-center justify-between rounded-[14px] bg-[#f0f5fe] dark:bg-slate-800/80 px-5 py-3 border border-[#dbe6f8] dark:border-slate-700">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#2f4675] dark:text-slate-200">
                    <Database size={18} className="text-[#6547ec]" />
                    <span>Table File: <strong className="font-mono text-[#583be3] dark:text-purple-300">{dbTable}.json</strong></span>
                  </div>
                  <span className="rounded-full bg-[#6547ec] px-3 py-1 text-[13px] font-bold text-white">
                    {dbRecordCount} Records
                  </span>
                </div>

                {/* DATABASE CONTENT CONTAINER */}
                <div className={`overflow-hidden rounded-[20px] border shadow-sm ${
                  darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"
                }`}>
                  {dbLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-[#6547ec]" />
                      <p className="text-[14px] text-slate-500">Inspecting database table...</p>
                    </div>
                  ) : dbViewMode === "json" ? (
                    <pre className="p-6 text-[13px] font-mono overflow-x-auto max-h-[600px] text-[#1c2e54] dark:text-purple-200 leading-relaxed">
                      {JSON.stringify(dbData, null, 2)}
                    </pre>
                  ) : Array.isArray(dbData) && dbData.length > 0 ? (
                    <div className="overflow-x-auto max-h-[600px]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-[13px] font-extrabold uppercase tracking-wider sticky top-0 z-10 ${
                            darkMode ? "border-slate-700 bg-[#1e2a44] text-indigo-300" : "border-[#dce6f4] bg-[#edf3ff] text-[#3934d8]"
                          }`}>
                            {Object.keys(dbData[0]).map((key) => (
                              <th key={key} className="py-3.5 px-5 whitespace-nowrap">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={`divide-y text-[13px] font-mono ${
                          darkMode ? "divide-slate-700/60 bg-[#182338] text-slate-100" : "divide-slate-200 bg-white text-[#0f172a]"
                        }`}>
                          {dbData.map((row: any, idx: number) => (
                            <tr
                              key={idx}
                              className={`transition ${
                                darkMode
                                  ? "hover:bg-slate-800/80 odd:bg-[#19243a] even:bg-[#161f33]"
                                  : "hover:bg-indigo-50/60 odd:bg-white even:bg-[#f8fafc]"
                              }`}
                            >
                              {Object.keys(dbData[0]).map((key) => {
                                const val = row[key];
                                const valStr = typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
                                const keyLower = key.toLowerCase();

                                return (
                                  <td key={key} className="py-3.5 px-5 whitespace-nowrap max-w-[320px] truncate">
                                    {keyLower.includes("password") || valStr === "[HASHED_PROTECTED]" ? (
                                      <span className="inline-flex items-center gap-1 rounded bg-slate-700/80 px-2 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
                                        [HASHED_PROTECTED]
                                      </span>
                                    ) : keyLower === "role" ? (
                                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                        valStr === "Admin"
                                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                          : valStr === "Faculty"
                                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                                      }`}>
                                        {valStr}
                                      </span>
                                    ) : keyLower.includes("id") || keyLower === "collegeid" ? (
                                      <span className="font-bold text-indigo-400 dark:text-indigo-300">{valStr}</span>
                                    ) : keyLower.includes("email") ? (
                                      <span className="font-semibold text-sky-600 dark:text-sky-300">{valStr}</span>
                                    ) : keyLower.includes("created") || keyLower.includes("date") ? (
                                      <span className="text-slate-500 dark:text-slate-300 text-xs">{valStr}</span>
                                    ) : (
                                      <span className="font-medium text-slate-900 dark:text-slate-100">{valStr}</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <pre className="p-6 text-[13px] font-mono overflow-x-auto max-h-[600px] text-[#1c2e54] dark:text-purple-200 leading-relaxed">
                      {JSON.stringify(dbData, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 4: SYSTEM SETTINGS ================= */}
            {activeTab === "settings" && (
              <div className="max-w-[750px] space-y-6">
                <div className={`rounded-[20px] border p-6 shadow-sm ${
                  darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"
                }`}>
                  <h3 className={`text-[20px] font-bold mb-4 ${darkMode ? "text-white" : "text-[#122b5d]"}`}>
                    Platform Configuration
                  </h3>

                  <div className="space-y-4 text-[15px]">
                    <div className="flex items-center justify-between border-b pb-4 dark:border-slate-700">
                      <div>
                        <p className={`font-bold ${darkMode ? "text-white" : "text-[#172850]"}`}>Maintenance Mode</p>
                        <p className="text-[13px] text-slate-400">Prevent non-admin user logins during updates</p>
                      </div>
                      <input type="checkbox" className="h-6 w-6 cursor-pointer accent-[#6547ec]" />
                    </div>

                    <div className="flex items-center justify-between border-b pb-4 dark:border-slate-700">
                      <div>
                        <p className={`font-bold ${darkMode ? "text-white" : "text-[#172850]"}`}>Public Registration</p>
                        <p className="text-[13px] text-slate-400">Allow new students and faculty to register online</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-6 w-6 cursor-pointer accent-[#6547ec]" />
                    </div>

                    <div className="flex items-center justify-between border-b pb-4 dark:border-slate-700">
                      <div>
                        <p className={`font-bold ${darkMode ? "text-white" : "text-[#172850]"}`}>AI Tutor Response Timeout</p>
                        <p className="text-[13px] text-slate-400">Max execution seconds for AI query generation</p>
                      </div>
                      <select className={`rounded-lg border px-3 py-1.5 font-bold outline-none ${
                        darkMode ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-white text-[#182952]"
                      }`}>
                        <option>30 seconds</option>
                        <option>60 seconds</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("System settings saved successfully!")}
                    className="mt-6 rounded-[14px] bg-gradient-to-r from-[#6547ec] to-[#754be9] px-6 py-3 text-[15px] font-bold text-white shadow-md transition hover:brightness-105"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ADD USER MODAL */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`relative w-full max-w-[500px] rounded-[24px] border p-6 shadow-2xl ${
            darkMode ? "border-slate-700 bg-[#1e2942] text-white" : "border-[#e2e8f5] bg-white text-[#172552]"
          }`}>
            <button
              onClick={() => setAddUserModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-[20px] font-bold">Create New User Account</h3>
            <p className="text-[14px] text-slate-400 mt-1 mb-5">Add a new user directly into the system database.</p>

            <form onSubmit={handleCreateUser} className="space-y-4 text-[14px]">
              <div>
                <label className="block font-semibold mb-1">Role</label>
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                  {(["Student", "Faculty", "Admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewUserRole(r)}
                      className={`py-2 rounded-lg font-bold transition ${
                        newUserRole === r ? "bg-[#6547ec] text-white shadow-sm" : "text-slate-500"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter full name"
                  className={`w-full h-[45px] rounded-xl border px-4 outline-none ${
                    darkMode ? "border-slate-600 bg-slate-800 text-white" : "border-slate-200 bg-white"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@college.edu"
                  className={`w-full h-[45px] rounded-xl border px-4 outline-none ${
                    darkMode ? "border-slate-600 bg-slate-800 text-white" : "border-slate-200 bg-white"
                  }`}
                />
              </div>

              {newUserRole !== "Admin" && (
                <div>
                  <label className="block font-semibold mb-1">
                    {newUserRole === "Faculty" ? "Faculty / Employee ID" : "College ID / Roll No"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserCollegeId}
                    onChange={(e) => setNewUserCollegeId(e.target.value)}
                    placeholder={newUserRole === "Faculty" ? "FAC101" : "22CS101"}
                    className={`w-full h-[45px] rounded-xl border px-4 outline-none ${
                      darkMode ? "border-slate-600 bg-slate-800 text-white" : "border-slate-200 bg-white"
                    }`}
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Set initial password"
                  className={`w-full h-[45px] rounded-xl border px-4 outline-none ${
                    darkMode ? "border-slate-600 bg-slate-800 text-white" : "border-slate-200 bg-white"
                  }`}
                />
              </div>

              {addUserError && <p className="text-sm font-semibold text-red-500">{addUserError}</p>}

              <button
                type="submit"
                disabled={addUserLoading}
                className="mt-3 w-full h-[48px] rounded-xl bg-gradient-to-r from-[#6547ec] to-[#754be9] font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
              >
                {addUserLoading ? "Creating User..." : "Create User"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {deleteUserTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-[420px] rounded-[24px] border p-6 shadow-2xl text-center ${
            darkMode ? "border-slate-700 bg-[#1e2942] text-white" : "border-[#e2e8f5] bg-white text-[#172552]"
          }`}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertCircle size={30} />
            </div>

            <h3 className="text-[20px] font-bold">Delete Account</h3>
            <p className="text-[14px] text-slate-400 mt-2">
              Are you sure you want to delete <strong className="text-red-500">{deleteUserTarget.name}</strong> ({deleteUserTarget.email})? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteUserTarget(null)}
                className="flex-1 h-[45px] rounded-xl border border-slate-300 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteUserLoading}
                className="flex-1 h-[45px] rounded-xl bg-red-600 font-bold text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleteUserLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
  darkMode,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string;
  darkMode: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[54px] w-full items-center justify-between rounded-[15px] px-5 font-semibold transition ${
        active
          ? darkMode
            ? "bg-[#283556] text-[#6b63ff]"
            : "bg-[#e9e8ff] text-[#4c56dc]"
          : darkMode
          ? "text-[#b9c5da] hover:bg-[#202c42]"
          : "text-[#29446f] hover:bg-[#f0f3ff]"
      }`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-[15px]">{label}</span>
      </div>
      {badge && (
        <span className="rounded-full bg-[#6547ec] px-2.5 py-0.5 text-[12px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  bg,
  iconBg,
  darkMode,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  bg: string;
  iconBg: string;
  darkMode: boolean;
}) {
  return (
    <div className={`rounded-[20px] border p-5 transition ${
      darkMode ? "border-[#2a3850] bg-[#1c273b]" : `border-[#e5eaf4] ${bg}`
    }`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className={`text-[14px] font-bold ${darkMode ? "text-slate-300" : "text-[#466184]"}`}>{title}</p>
          <p className={`mt-1 text-[28px] font-extrabold ${darkMode ? "text-white" : "text-[#102b5e]"}`}>{value}</p>
          <p className={`mt-0.5 text-[12px] font-medium ${darkMode ? "text-slate-400" : "text-[#58759d]"}`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function ActionItem({
  icon,
  title,
  description,
  onClick,
  darkMode,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  darkMode: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full rounded-[16px] border p-4 text-left transition hover:scale-[1.01] ${
        darkMode ? "border-[#30405a] bg-[#202c42] hover:bg-[#283754]" : "border-[#e4e9f3] bg-[#f8fbff] hover:bg-white hover:shadow-md"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eeeaff] dark:bg-slate-700 text-[#5438e3] dark:text-purple-300">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-[#1d355e]"}`}>{title}</p>
        <p className="text-[13px] text-slate-400 truncate">{description}</p>
      </div>
      <ChevronRight size={18} className="text-slate-400" />
    </button>
  );
}