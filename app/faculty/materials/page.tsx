"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { downloadMaterialPdf } from "@/lib/pdfGenerator";
import {
  Bell,
  BookOpen,
  FileText,
  Home,
  LogOut,
  Moon,
  CircleHelp,
  Plus,
  Settings,
  Upload,
  CalendarDays,
  ClipboardList,
  Bot,
  Eye,
  Download,
  Trash2,
  Printer,
  X,
  Building2,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

const defaultMaterials = [
  {
    id: "mat-1",
    title: "Database Management Systems Notes",
    type: "PDF",
    uploadedAt: "Today",
    size: "1.8 MB",
    author: "Dr. S. Sharma",
    subject: "Database Management Systems",
    downloadUrl: "#",
  },
  {
    id: "mat-2",
    title: "Artificial Intelligence Lecture Slides",
    type: "PDF",
    uploadedAt: "Yesterday",
    size: "2.4 MB",
    author: "Prof. Alan Turing",
    subject: "Artificial Intelligence",
    downloadUrl: "#",
  },
  {
    id: "mat-3",
    title: "Machine Learning Model Evaluation",
    type: "Slides",
    uploadedAt: "2 days ago",
    size: "4.2 MB",
    author: "Dr. K. Mehta",
    subject: "Machine Learning",
    downloadUrl: "#",
  },
  {
    id: "mat-4",
    title: "NLP Introduction & Text Processing",
    type: "PDF",
    uploadedAt: "3 days ago",
    size: "2.1 MB",
    author: "Prof. Alan Turing",
    subject: "NLP Introduction",
    downloadUrl: "#",
  },
];

export default function FacultyMaterialsPage() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();
  const [materials, setMaterials] = useState<any[]>(defaultMaterials);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState("Faculty");
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "Faculty") router.replace("/login");
    setUserName(localStorage.getItem("userName") || "Faculty");

    fetch("/api/faculty/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.materials && data.materials.length > 0) {
          setMaterials(data.materials);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleUpload = async () => {
    if (!title.trim()) return;
    setSaving(true);

    const localFileUrl = file ? URL.createObjectURL(file) : null;
    const localFileName = file ? file.name : `${title}.pdf`;
    const localFileSize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "2.1 MB";

    try {
      const formData = new FormData();
      formData.append("type", "material");
      formData.append("title", title);
      formData.append("materialType", type);
      if (file) formData.append("file", file);
      const res = await fetch("/api/faculty/dashboard", { method: "POST", body: formData });

      const data = await res.json();
      const serverUrl = data.item?.downloadUrl || localFileUrl;

      const newItem = {
        id: data.item?.id || Date.now().toString(),
        title: title.trim(),
        type: type,
        uploadedAt: "Just now",
        size: localFileSize,
        author: userName,
        fileName: localFileName,
        downloadUrl: serverUrl || "#",
      };

      setTitle("");
      setType("PDF");
      setFile(null);
      setMaterials([newItem, ...materials]);
    } catch (e) {
      const newItem = {
        id: Date.now().toString(),
        title: title.trim(),
        type: type,
        uploadedAt: "Just now",
        size: localFileSize,
        author: userName,
        fileName: localFileName,
        downloadUrl: localFileUrl || "#",
      };

      setTitle("");
      setType("PDF");
      setFile(null);
      setMaterials([newItem, ...materials]);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this course material?")) return;
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const getMaterialBody = (mat: any) => {
    return `OFFICIAL COURSE MATERIAL & STUDY RESOURCE
--------------------------------------------------
Title: ${mat.title}
Uploaded File: ${mat.fileName || mat.title + ".pdf"}
Academic Term: Semester VII | Department of Computer Engineering
Faculty In-Charge: ${mat.author || userName}
Document Format: ${mat.type || "PDF"} (${mat.size || "2.4 MB"})
Uploaded: ${mat.uploadedAt || "Recently"}

1. SPECIFIC COURSE CONTENT & LECTURE SUMMARY FOR "${mat.title.toUpperCase()}":
This document serves as the official study guide, reference notes, and lecture resources specifically uploaded for ${mat.title}.

2. KEY MODULES & SYLLABUS TOPICS:
• Core theoretical principles, definitions, and mathematical formulation for ${mat.title}
• Detailed system architecture, algorithmic execution, and operational diagrams
• Step-by-step practical lab walkthroughs and university exam reference problems
• Code repositories, theoretical proofs, and recommended textbook references

3. STUDENT DIRECTIVES:
• Students are advised to thoroughly review these materials before upcoming examinations.
• For questions or lab discussions, consult ${mat.author || userName} during faculty office hours.`;
  };

  return (
    <main className={`min-h-screen p-3 ${darkMode ? "bg-[#111827]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[24px] border ${darkMode ? "border-[#263248] bg-[#172033]" : "border-white bg-[#f8fbff]"}`}>
        
        {/* SIDEBAR */}
        <aside className={`hidden w-[280px] shrink-0 border-r p-5 lg:flex ${darkMode ? "border-[#263248] bg-[#172033]" : "border-[#e1e8f5] bg-[#f8fbff]"}`}>
          <div className="w-full flex flex-col justify-between">
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
                <SidebarLink href="/faculty/materials" label="Materials" icon={<FileText size={18} />} active darkMode={darkMode} />
                <SidebarLink href="/faculty/assignments" label="Assignments" icon={<ClipboardList size={18} />} darkMode={darkMode} />
                <SidebarLink href="/faculty/timetable" label="Timetable" icon={<CalendarDays size={18} />} darkMode={darkMode} />
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

        {/* MAIN SECTION */}
        <section className="flex-1 min-w-0 flex flex-col">
          <header className={`flex items-center justify-between border-b px-6 py-4 ${darkMode ? "border-[#263248] bg-[#1a2438]" : "border-[#edf0f6] bg-white"}`}>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Study Materials</h1>
              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>Upload and manage course resources</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white" : "border-[#e3e8f2] bg-white text-[#263b64]"}`}><Moon size={18} /></button>
              <Link href="/faculty/settings#help-support" title="Help & Support" className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white hover:bg-slate-700" : "border-[#e3e8f2] bg-white text-[#263b64] hover:bg-indigo-50"}`}><CircleHelp size={18} /></Link>
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/20"><LogOut size={16} /> Logout</button>
            </div>
          </header>

          <div className="space-y-6 p-6 overflow-y-auto">
            
            {/* UPLOAD FORM */}
            <div className={`card-highlight rounded-[20px] border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              <div className="mb-4 flex items-center gap-2">
                <Upload size={18} className="text-[#1dbf73]" />
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Upload new material</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Material title (e.g. aicw / DBMS Notes)" className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white focus:border-indigo-500" : "border-[#dfe7f6] bg-white text-[#1b2e4d] focus:border-indigo-500"}`} />
                <select value={type} onChange={(e) => setType(e.target.value)} className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none cursor-pointer ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`}>
                  <option>PDF</option>
                  <option>Slides</option>
                  <option>Notes</option>
                  <option>Video</option>
                </select>
                <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.mp4" onChange={(e) => setFile(e.target.files?.[0] || null)} className={`rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-[#374766] bg-[#1f2d47] text-white" : "border-[#dfe7f6] bg-white text-[#1b2e4d]"}`} />
                <div className="md:col-span-3 flex justify-end">
                  <button onClick={handleUpload} disabled={saving} className="rounded-xl bg-[#1dbf73] px-5 py-2.5 font-bold text-white shadow-sm hover:bg-emerald-600 transition disabled:opacity-60">{saving ? "Uploading..." : "Upload Material"}</button>
                </div>
              </div>
            </div>

            {/* UPLOADED MATERIALS LIST */}
            <div className={`card-highlight rounded-[20px] border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#4d62d8]" />
                  <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Uploaded materials</h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">Total: {materials.length}</span>
              </div>

              <div className="space-y-3">
                {materials.length === 0 ? (
                  <p className={darkMode ? "text-slate-400" : "text-slate-500"}>No materials uploaded yet.</p>
                ) : (
                  materials.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMaterial(item)}
                      className={`group flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${
                        darkMode ? "border-[#2c3b54] bg-[#1f2c47] hover:bg-[#253554]" : "border-[#e7ecf5] bg-[#f8fbff] hover:bg-indigo-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 font-bold text-xs">
                          {item.type || "PDF"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1c2d52] dark:text-white truncate group-hover:text-indigo-400 transition">{item.title}</p>
                          <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>{item.type} • {item.uploadedAt || "Just now"} • {item.size || "2.1 MB"}</p>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedMaterial(item)}
                          className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20 transition shadow-sm"
                          title="View Material Document"
                        >
                          <Eye size={14} /> View File
                        </button>

                        <button
                          onClick={() => {
                            if (item.downloadUrl && item.downloadUrl !== "#") {
                              window.open(item.downloadUrl, "_blank");
                            } else {
                              downloadMaterialPdf({
                                title: item.title,
                                type: item.type,
                                size: item.size,
                                author: userName,
                                uploadedAt: item.uploadedAt,
                              });
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-600/40 bg-slate-700/20 text-slate-300 hover:bg-slate-700/50 transition"
                          title="Download Document PDF"
                        >
                          <Download size={14} />
                        </button>

                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                          title="Delete Material"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* =========================================================
          FACULTY COURSE MATERIAL VIEWER MODAL
      ========================================================= */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 overflow-hidden">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/90 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xs">
                  {selectedMaterial.type || "PDF"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedMaterial.title}</h3>
                  <p className="text-xs text-slate-400">{selectedMaterial.fileName || selectedMaterial.title} • {selectedMaterial.uploadedAt || "Recently"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedMaterial.downloadUrl && selectedMaterial.downloadUrl !== "#" && (
                  <a
                    href={selectedMaterial.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20 transition"
                  >
                    <ExternalLink size={14} /> Open Original File
                  </a>
                )}

                <button
                  onClick={() => {
                    if (selectedMaterial.downloadUrl && selectedMaterial.downloadUrl !== "#") {
                      window.open(selectedMaterial.downloadUrl, "_blank");
                    } else {
                      downloadMaterialPdf({
                        title: selectedMaterial.title,
                        type: selectedMaterial.type,
                        size: selectedMaterial.size,
                        author: userName,
                        uploadedAt: selectedMaterial.uploadedAt,
                      });
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                  title="Download genuine PDF file"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-[#4334d8] px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition shadow-md"
                >
                  <Printer size={15} /> Print
                </button>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* DOCUMENT PREVIEW */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center items-start">
              {selectedMaterial.downloadUrl && selectedMaterial.downloadUrl !== "#" ? (
                <iframe
                  src={selectedMaterial.downloadUrl}
                  className="w-full h-[650px] rounded-lg border border-slate-700 bg-white"
                  title={selectedMaterial.title}
                />
              ) : (
                <div id="printable-material-document" className="w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded-2xl p-8 sm:p-12 border border-slate-200 font-serif leading-relaxed text-left relative my-4">
                  
                  <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 font-sans">
                    <div className="flex justify-center items-center gap-3 mb-2">
                      <Building2 className="h-9 w-9 text-slate-900" />
                      <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase">
                        AI COLLEGE OF ENGINEERING & TECHNOLOGY
                      </h1>
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      Department of Computer Engineering & Information Technology
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Faculty Uploaded Course Resource | Academic Session 2026
                    </p>
                  </div>

                  <div className="my-6 border-y border-slate-300 py-4 text-center font-sans">
                    <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider block mb-1">
                      COURSE STUDY MATERIAL ({selectedMaterial.type || "PDF"})
                    </span>
                    <h2 className="text-xl font-black text-slate-900 uppercase">
                      {selectedMaterial.title}
                    </h2>
                  </div>

                  <div className="bg-slate-50 border border-slate-300 rounded-md p-4 mb-6 text-xs font-sans space-y-1.5">
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">Uploaded File</span>
                      <span>:</span>
                      <span className="font-bold text-slate-900">{selectedMaterial.fileName || selectedMaterial.title}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">Uploaded By</span>
                      <span>:</span>
                      <span className="font-bold text-slate-900">{selectedMaterial.author || userName}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">Document Type</span>
                      <span>:</span>
                      <span className="text-slate-900">{selectedMaterial.type || "PDF"} File ({selectedMaterial.size || "2.1 MB"})</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span className="font-bold text-slate-700">Upload Date</span>
                      <span>:</span>
                      <span className="text-slate-900">{selectedMaterial.uploadedAt || "Today"}</span>
                    </div>
                  </div>

                  <div className="my-8 text-sm text-slate-800 space-y-4 font-mono whitespace-pre-line leading-relaxed border p-6 bg-slate-50/50 rounded-lg">
                    {getMaterialBody(selectedMaterial)}
                  </div>

                  <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans text-xs text-slate-600">
                    <div>
                      <p className="font-bold text-slate-800">Faculty Resource Center</p>
                      <p>Verified Academic Syllabus Content for {selectedMaterial.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 uppercase">{selectedMaterial.author || userName}</p>
                      <p>Department of Computer Engineering</p>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}
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
