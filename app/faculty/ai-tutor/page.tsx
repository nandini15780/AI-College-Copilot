"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/app/theme-provider";
import Link from "next/link";
import { downloadNoticePdf } from "@/lib/pdfGenerator";
import {
  Bell,
  Bot,
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Moon,
  Send,
  Settings,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Share2,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  BookOpen,
  GraduationCap,
  Download,
  Megaphone,
  CheckCircle2,
  FileSpreadsheet,
  CircleHelp
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  keyPoints?: string[];
  sources?: string[];
  timestamp: string;
}

export default function FacultyAITutorPage() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState("Faculty");
  const [userProfileImage, setUserProfileImage] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Notice publishing state
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishedNoticeIds, setPublishedNoticeIds] = useState<string[]>([]);

  // Share state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [networkLink, setNetworkLink] = useState("");
  const [localLink, setLocalLink] = useState("");
  const [activeLinkType, setActiveLinkType] = useState<"network" | "local">("network");
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);

  const [suggestedPrompts] = useState<string[]>([
    "Draft an official notice circular regarding Mid-Term Exam Schedule & Rules",
    "Draft a 50-min lesson plan for DBMS Normalization",
    "Generate official circular for Assignment Submission Deadline",
    "Explain Operating System Deadlocks with a real-world analogy",
    "Create a grading rubric for a Java OOP mini-project",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "Faculty" && role !== "Admin") {
      router.replace("/login");
      return;
    }
    setUserName(localStorage.getItem("userName") || "Faculty");
    const savedImg = localStorage.getItem("userProfileImage_Faculty");
    if (savedImg) setUserProfileImage(savedImg);

    // Fetch history
    fetch("/api/student/ai-tutor?role=Faculty")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.history)) {
          setMessages(data.history);
        }
      })
      .catch((err) => {
        console.error("Failed to load AI Tutor history:", err);
      });
  }, [router]);

  const sendPrompt = async (inputQuery?: string) => {
    const textToSubmit = (inputQuery || prompt).trim();
    if (!textToSubmit || loading) return;

    setErrorMsg(null);
    setPrompt("");
    setLoading(true);

    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/student/ai-tutor?role=Faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSubmit, role: "Faculty" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request.");
      }
      if (data.success && data.aiResponse) {
        setMessages((current) => data.history || [...current, data.aiResponse]);
      } else {
        setErrorMsg(data.error || "Failed to process request.");
      }
    } catch (err: any) {
      console.error("Error submitting question:", err);
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = async () => {
    try {
      const res = await fetch("/api/student/ai-tutor?role=Faculty", { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages([]);
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Failed to clear session:", err);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cleanMessageContent = (content: string) => {
    if (typeof content !== "string") return "";
    let trimmed = content.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed.content === "string") {
          return parsed.content;
        }
      } catch (e) {}
    }
    return content;
  };

  // Strip AI disclaimer sentences that should never appear in a generated PDF
  const stripAiDisclaimers = (text: string): string => {
    const disclaimerPatterns = [
      /I cannot directly (generate|create|produce|make) a (downloadable |printable )?PDF( file)?[^.]*\./gi,
      /I (am not able|cannot|can't|don't have the ability) to (directly |automatically )?(generate|create|produce|download|save)[^.]*PDF[^.]*\./gi,
      /but I have formatted your[^.]*\./gi,
      /you can (easily )?copy and paste it into[^.]*\./gi,
      /into a document editor[^.]*\./gi,
      /\(like Word or Google Docs\)[^.]*\./gi,
      /save it as a PDF[^.]*\./gi,
      /Here(?: is| are) the formatted[^.]*\./gi,
      /Below is the formatted[^.]*\./gi,
      /Here's the formatted[^.]*\./gi,
      /I've formatted[^.]*\./gi,
      /\*+\s*$/gm,  // trailing asterisks on their own line
    ];

    let cleaned = text;
    for (const pattern of disclaimerPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }
    // Collapse multiple blank lines left behind
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
    return cleaned;
  };

  const handleDownloadNoticePDF = (messageText: string) => {
    const rawContent = cleanMessageContent(messageText);
    const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    const refNo = `DMCE/CIRCULAR/2026/${Math.floor(100 + Math.random() * 900)}`;

    // Extract department from the AI response (e.g. "Department: Civil Engineering")
    let department = "Department of Computer Engineering";
    const deptMatch = rawContent.match(/(?:Department|Dept|DEPARTMENT|DEPT)\s*(?:of)?\s*[:|-]?\s*([A-Za-z &]+Engineering[A-Za-z &]*|[A-Za-z &]+Technology[A-Za-z &]*|[A-Za-z &]+Science[A-Za-z &]*)(?=\n|,|\.|$)/i);
    if (deptMatch && deptMatch[1] && deptMatch[1].trim().length > 3) {
      department = `Department of ${deptMatch[1].trim()}`;
    }

    // Extract Notice Heading / Subject dynamically
    let purpose = extractNoticeTitle(rawContent);
    const subjectMatch = rawContent.match(/(?:SUBJECT|Subject|PURPOSE|Purpose|REGARDING|Regarding)\s*[:|-]\s*(.+?)(?=\n|$)/i);
    if (subjectMatch && subjectMatch[1] && subjectMatch[1].trim().length > 3) {
      purpose = subjectMatch[1].replace(/[*#]/g, '').trim();
    }

    // Clean body text: strip markdown syntax AND AI disclaimer phrases
    const cleanBody = stripAiDisclaimers(
      rawContent
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/================================================================================/g, '')
        .replace(/--------------------------------------------------------------------------------/g, '')
        .trim()
    );

    // Direct jsPDF Download
    downloadNoticePdf({
      title: purpose,
      department,
      date: dateStr,
      category: "Academic Notice",
      content: cleanBody,
    });

    const printWindow = window.open("", "_blank", "width=850,height=1100");
    if (!printWindow) {
      return;
    }

    const htmlDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${purpose} - AI College of Engineering & Technology</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 30px;
      font-size: 13.5px;
      line-height: 1.6;
    }
    .college-header {
      text-align: center;
      margin-bottom: 5px;
    }
    .college-name {
      font-size: 19px;
      font-weight: bold;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    .college-sub {
      font-size: 12px;
      color: #222;
      margin-bottom: 15px;
    }
    .ref-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 15px;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
    }
    .notice-heading {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin: 15px 0 5px 0;
      letter-spacing: 2px;
    }
    .notice-subject {
      text-align: center;
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #1e1b4b;
      text-decoration: underline;
    }
    .meta-table {
      width: 100%;
      margin-bottom: 20px;
      border-collapse: collapse;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
    }
    .meta-table td {
      padding: 6px 12px;
      vertical-align: top;
    }
    .meta-label {
      width: 160px;
      font-weight: bold;
      color: #334155;
    }
    .meta-colon {
      width: 15px;
    }
    .meta-val {
      font-weight: bold;
      color: #0f172a;
    }
    .notice-body {
      white-space: pre-wrap;
      text-align: justify;
      margin: 20px 0;
      font-size: 14px;
      line-height: 1.7;
    }
    .footer-signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 60px;
    }
    .sig-box {
      text-align: center;
      min-width: 220px;
    }
    .sig-title {
      font-weight: bold;
      border-top: 1px solid #000;
      padding-top: 5px;
      margin-top: 50px;
    }
    .no-print-bar {
      background: #f0f4f8;
      border: 1px solid #cbd5e1;
      padding: 12px 20px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
    }
    .btn-pdf {
      background: #4f46e5;
      color: #fff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .no-print-bar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div>
      <strong>Official College Circular / Notice Document</strong>
      <div style="font-size: 11px; color: #64748b;">PDF downloaded automatically. Click button to print or save another copy.</div>
    </div>
    <button class="btn-pdf" onclick="window.print()">📥 Download / Save as PDF</button>
  </div>

  <div class="college-header">
    <div class="college-name">DATTA MEGHE COLLEGE OF ENGINEERING</div>
    <div class="college-sub">DEPARTMENT OF COMPUTER ENGINEERING<br/>Airoli, Navi Mumbai | Website: www.dmce.ac.in</div>
  </div>

  <div class="ref-row">
    <div>Ref No: ${refNo}</div>
    <div>Date: ${dateStr}</div>
  </div>

  <div class="notice-heading">
    OFFICIAL CIRCULAR / NOTICE
  </div>

  <div class="notice-subject">
    ${purpose.toUpperCase()}
  </div>

  <table class="meta-table">
    <tr>
      <td class="meta-label">1. Notice Heading</td>
      <td class="meta-colon">:</td>
      <td class="meta-val">${purpose}</td>
    </tr>
    <tr>
      <td class="meta-label">2. Issued By</td>
      <td class="meta-colon">:</td>
      <td class="meta-val">${department}</td>
    </tr>
    <tr>
      <td class="meta-label">3. Target Audience</td>
      <td class="meta-colon">:</td>
      <td class="meta-val">All Enrolled Students & Faculty Members</td>
    </tr>
  </table>

  <div class="notice-body">
${cleanBody}
  </div>

  <div class="footer-signatures">
    <div class="sig-box">
      <div class="sig-title">Faculty Coordinator</div>
    </div>
    <div class="sig-box">
      <div class="sig-title">Head of Department / Dean of Academic Affairs</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
    `;

    printWindow.document.write(htmlDoc);
    printWindow.document.close();
  };

  const extractNoticeTitle = (messageText: string): string => {
    if (!messageText) return "Official Academic Notice";

    let text = messageText.trim();
    if (text.startsWith("{") && text.endsWith("}")) {
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed.content === "string") {
          text = parsed.content;
        }
      } catch (e) {}
    }

    text = text
      .replace(/^\[OFFICIAL\]\s*/i, '')
      .replace(/^\{?\s*"content"\s*:\s*"?/i, '')
      .replace(/["{}]/g, '')
      .trim();

    const subjectMatch = text.match(/(?:SUBJECT|Subject|PURPOSE|Purpose|REGARDING|Regarding)\s*[:|-]\s*(.+?)(?=\n|$)/i);
    if (subjectMatch && subjectMatch[1] && subjectMatch[1].trim().length > 3) {
      return subjectMatch[1].replace(/[*#]/g, '').trim().slice(0, 80);
    }

    const announcementMatch = text.match(/(?:Official Announcement|Notice|Circular)\s*[:|–|-]\s*(.+?)(?=\n|$)/i);
    if (announcementMatch && announcementMatch[1] && announcementMatch[1].trim().length > 3) {
      const cleanAnn = announcementMatch[1].replace(/[*#]/g, '').trim();
      if (!cleanAnn.toLowerCase().includes("college of engineering")) {
        return cleanAnn.slice(0, 80);
      }
    }

    const lines = text.split("\n")
      .map(l => l.replace(/[*#]/g, '').trim())
      .filter(l => l.length > 5);

    for (const line of lines) {
      const l = line.toLowerCase();
      if (
        l.includes("hello professor") ||
        l.includes("dear students") ||
        l.includes("this is to inform") ||
        l.includes("ai college of engineering") ||
        l.includes("office of student affairs") ||
        l.includes("circular ref no") ||
        l.startsWith("content:")
      ) {
        continue;
      }
      return line.slice(0, 80);
    }

    return "Official Academic Notice & Circular";
  };

  const handlePublishNotice = async (msgId: string, messageText: string) => {
    setPublishingId(msgId);
    try {
      const title = extractNoticeTitle(messageText);

      const res = await fetch("/api/faculty/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "notice",
          data: {
            title: title,
            department: "Faculty / Academic Cell",
            category: "Academic",
            date: "Today",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPublishedNoticeIds((prev) => [...prev, msgId]);
      } else {
        alert(data.error || "Failed to publish notice.");
      }
    } catch (err) {
      console.error("Failed to publish notice:", err);
    } finally {
      setPublishingId(null);
    }
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      sendPrompt(lastUserMsg.content);
    }
  };

  const handleShareChat = async () => {
    if (messages.length === 0) return;
    setSharing(true);
    setCopyLinkSuccess(false);

    try {
      const firstUserMsg = messages.find((m) => m.role === "user");
      const title = firstUserMsg
        ? `Faculty AI Tutor: ${firstUserMsg.content.slice(0, 40)}`
        : "Faculty AI Tutor Session";

      const res = await fetch("/api/student/ai-tutor/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          messages,
          sharedBy: userName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.shareId) {
        const sharePath = `/share/ai-tutor/${data.shareId}`;
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : "";
        const hostName = window.location.hostname;

        const currentLocal = `${protocol}//${hostName}${port}${sharePath}`;
        setLocalLink(currentLocal);

        if (data.networkIp) {
          setNetworkLink(`${protocol}//${data.networkIp}${port}${sharePath}`);
        } else {
          setNetworkLink(currentLocal);
        }

        setShareModalOpen(true);
      } else {
        alert(data.error || "Failed to generate share link.");
      }
    } catch (err) {
      console.error("Failed to share chat:", err);
      alert("Error generating share link.");
    } finally {
      setSharing(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfileImage_Faculty");
    router.push("/login");
  };

  const activeLink = activeLinkType === "network" ? (networkLink || localLink) : localLink;

  return (
    <main className={`min-h-screen p-3 ${darkMode ? "bg-[#111827]" : "bg-[#edf3ff]"}`}>
      <div className={`mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[24px] border ${darkMode ? "border-[#263248] bg-[#172033]" : "border-white bg-[#f8fbff]"}`}>
        {/* Sidebar */}
        <aside className={`hidden w-[280px] flex-col justify-between border-r p-5 lg:flex ${darkMode ? "border-[#263248] bg-[#172033]" : "border-[#e1e8f5] bg-[#f8fbff]"}`}>
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6651ee] to-[#3023a5] flex items-center justify-center text-white font-bold text-lg">
                AC
              </div>
              <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>AI College Copilot</div>
            </div>
            <nav className="space-y-2">
              <SidebarLink href="/faculty-dashboard" label="Dashboard" icon={<Home size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/ai-tutor" label="AI Tutor" icon={<Bot size={18} />} active darkMode={darkMode} />
              <SidebarLink href="/faculty/materials" label="Materials" icon={<FileText size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/assignments" label="Assignments" icon={<ClipboardList size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/timetable" label="Timetable" icon={<CalendarDays size={18} />} darkMode={darkMode} />
              <SidebarLink href="/faculty/settings" label="Settings" icon={<Settings size={18} />} darkMode={darkMode} />
            </nav>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-700/30">
            {messages.length > 0 && (
              <button
                onClick={handleClearSession}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                <Trash2 size={14} /> Clear Conversation
              </button>
            )}

            <div className="flex items-center justify-between pt-2">
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

        {/* Main Content */}
        <section className="flex flex-1 flex-col overflow-hidden">
          <header className={`flex items-center justify-between border-b px-6 py-4 ${darkMode ? "border-[#263248] bg-[#1a2438]" : "border-[#edf0f6] bg-white"}`}>
            <div className="flex items-center gap-3">
              {/* Faculty Avatar */}
              <div className="h-10 w-10 overflow-hidden rounded-full border border-indigo-400/40 bg-[#6651ee]/20 flex items-center justify-center text-[#6651ee] font-bold">
                {userProfileImage ? (
                  <img src={userProfileImage} alt="Faculty Profile" className="h-full w-full object-cover" />
                ) : (
                  <Bot size={22} />
                )}
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#152653]"}`}>Faculty AI Assistant & Notice Generator</h1>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Draft official notices, circulars, lesson plans & assignments</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button
                  onClick={handleShareChat}
                  disabled={sharing}
                  className="flex items-center gap-2 rounded-xl bg-[#6651ee] px-3.5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#523ed6]"
                >
                  <Share2 size={14} /> {sharing ? "Sharing..." : "Share Session"}
                </button>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`rounded-xl border p-2 ${darkMode ? "border-[#35435e] bg-[#202c42] text-white" : "border-[#e3e8f2] bg-white text-[#263b64]"}`}
              >
                <Moon size={18} />
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden p-6">
            {/* Quick Notice Draft Header Button */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#6651ee]/15 to-indigo-500/15 border border-[#6651ee]/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6651ee] text-white shadow-md">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                    Official Notice Generator
                  </h4>
                  <p className="text-xs text-slate-400">
                    Draft official college circulars & download them as printable files or post to students
                  </p>
                </div>
              </div>

              <button
                onClick={() => sendPrompt("Draft an official academic notice circular regarding Mid-Term Exam Schedule and Guidelines")}
                className="flex items-center gap-2 rounded-xl bg-[#6651ee] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#523ed6] transition"
              >
                <Sparkles size={14} /> Draft Official Notice
              </button>
            </div>

            {/* Suggested Prompts Header if empty */}
            {messages.length === 0 && (
              <div className={`mb-6 rounded-2xl border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#6651ee] mb-3">
                  <Sparkles size={16} /> Suggested Teaching & Notice Prompts
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendPrompt(s)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        darkMode
                          ? "border-[#324364] bg-[#202d47] text-slate-300 hover:border-[#6651ee] hover:text-white"
                          : "border-[#e2e8f5] bg-[#f8fbff] text-slate-700 hover:border-[#6651ee] hover:text-[#6651ee]"
                      }`}
                    >
                      "{s}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-400">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Chat Box */}
            <div className={`flex-1 space-y-4 overflow-y-auto rounded-2xl border p-5 ${darkMode ? "border-[#2a3850] bg-[#1c273b]" : "border-[#e5eaf4] bg-white"}`}>
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-8">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6651ee]/10 text-[#6651ee]">
                    <GraduationCap size={32} />
                  </div>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                    Welcome Professor! How can I assist your teaching today?
                  </h3>
                  <p className={`mt-1 max-w-md text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Draft official notices, circulars, lesson plans, quiz questions, concept explanations, or assignment rubrics.
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isNotice = message.role === "assistant" && (
                    message.content.toLowerCase().includes("notice") ||
                    message.content.toLowerCase().includes("circular") ||
                    message.content.toLowerCase().includes("official")
                  );

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                          message.role === "user"
                            ? "bg-[#6651ee] text-white shadow-md"
                            : darkMode
                            ? "border border-[#2e3e5c] bg-[#152033] text-slate-100 shadow-sm"
                            : "border border-[#e2e8f5] bg-[#f5f8ff] text-slate-800 shadow-sm"
                        }`}
                      >
                        {/* Official Notice Special Header Card */}
                        {isNotice && (
                          <div className="mb-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                            <div className="flex items-center justify-between font-bold text-amber-500 border-b border-amber-500/20 pb-1.5">
                              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                                <Megaphone size={14} /> Official College Notice Circular
                              </span>
                              <span className="text-[10px] font-mono opacity-80">ACET / 2026</span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-300">
                              Format verified for official publication & student notification.
                            </p>
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{cleanMessageContent(message.content)}</div>

                        {/* Key Points */}
                        {message.keyPoints && message.keyPoints.length > 0 && (
                          <div className="mt-3 border-t border-slate-700/30 pt-3">
                            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#6651ee]">Key Takeaways:</span>
                            <ul className="mt-1 space-y-1 text-xs">
                              {message.keyPoints.map((kp, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-[#6651ee]">•</span>
                                  <span>{kp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-700/30 pt-2 text-[11px]">
                            <BookOpen size={12} className="text-slate-400" />
                            <span className="text-slate-400 font-medium">References:</span>
                            {message.sources.map((src, i) => (
                              <span key={i} className="rounded-md bg-slate-500/20 px-2 py-0.5 text-xs text-slate-300 font-mono">
                                {src}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Assistant Actions (Copy, Download Notice, Publish Notice) */}
                        {message.role === "assistant" && (
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/20 pt-3 text-xs">
                            <span className="text-[10px] text-slate-400">{message.timestamp}</span>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Download Notice PDF Button */}
                              <button
                                onClick={() => handleDownloadNoticePDF(message.content)}
                                className="flex items-center gap-1.5 rounded-lg bg-[#6651ee] px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-[#523ed6] transition"
                              >
                                <Download size={13} /> Download Notice (PDF)
                              </button>

                              {/* Publish Notice Button */}
                              {publishedNoticeIds.includes(message.id) ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                                  <CheckCircle2 size={13} /> Published to Students
                                </span>
                              ) : (
                                <button
                                  onClick={() => handlePublishNotice(message.id, message.content)}
                                  disabled={publishingId === message.id}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white transition disabled:opacity-50"
                                >
                                  <Megaphone size={13} /> {publishingId === message.id ? "Publishing..." : "Publish to Students"}
                                </button>
                              )}

                              {/* Copy Button */}
                              <button
                                onClick={() => handleCopy(message.id, message.content)}
                                className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1"
                              >
                                {copiedId === message.id ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                                <span>{copiedId === message.id ? "Copied" : "Copy"}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#6651ee] p-3">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Faculty AI is reasoning...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Actions & Input */}
            <div className="mt-4 space-y-2">
              {messages.length > 0 && (
                <div className="flex items-center justify-between px-1">
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#6651ee]"
                  >
                    <RefreshCw size={13} /> Regenerate last response
                  </button>
                  <button
                    onClick={handleClearSession}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={13} /> Clear chat
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendPrompt();
                    }
                  }}
                  placeholder="Draft an official notice, lesson plan, quiz questions, rubric..."
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#6651ee] ${
                    darkMode ? "border-[#374766] bg-[#1f2d47] text-white placeholder-slate-400" : "border-[#dfe7f6] bg-white text-[#1b2e4d] placeholder-slate-400"
                  }`}
                />
                <button
                  onClick={() => sendPrompt()}
                  disabled={loading || !prompt.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6651ee] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#523ed6] disabled:opacity-50"
                >
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${darkMode ? "border-[#2a3850] bg-[#172033] text-white" : "border-slate-200 bg-white text-slate-900"}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
              <div className="flex items-center gap-2 font-bold text-base">
                <Share2 size={18} className="text-[#6651ee]" /> Share Faculty AI Tutor Session
              </div>
              <button onClick={() => setShareModalOpen(false)} className="rounded-lg p-1 hover:bg-slate-700/20">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-slate-400">
                Anyone with this link can view this read-only Faculty AI conversation transcript.
              </p>

              {networkLink && networkLink !== localLink && (
                <div className="flex rounded-xl bg-slate-800/40 p-1 border border-slate-700/50">
                  <button
                    onClick={() => setActiveLinkType("network")}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${activeLinkType === "network" ? "bg-[#6651ee] text-white" : "text-slate-400"}`}
                  >
                    Network IP (Other Devices)
                  </button>
                  <button
                    onClick={() => setActiveLinkType("local")}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${activeLinkType === "local" ? "bg-[#6651ee] text-white" : "text-slate-400"}`}
                  >
                    Localhost
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={activeLink}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-mono ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-300 bg-slate-100 text-slate-800"}`}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeLink);
                    setCopyLinkSuccess(true);
                    setTimeout(() => setCopyLinkSuccess(false), 2000);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#6651ee] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#523ed6]"
                >
                  {copyLinkSuccess ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copyLinkSuccess ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
