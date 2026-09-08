"use client";
import { useTheme } from "@/app/theme-provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Search,
  ChevronDown,
  Moon,
  Send,
  Copy,
  RefreshCw,
  MoreHorizontal,
  CircleHelp,
  GraduationCap,
  Check,
  Loader2,
  Trash2,
  Sparkles,
  AlertCircle,
  Share2,
  X,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  keyPoints?: string[];
  sources?: string[];
  timestamp: string;
}

export default function AITutor() {
  const [userName, setUserName] = useState("Student");
  const { darkMode, setDarkMode } = useTheme();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What is deadlock?",
    "Explain paging",
    "Difference between process & thread",
    "What is normalization?",
    "Quiz me on Operating Systems",
    "What are ACID properties?"
  ]);
  const [loading, setLoading] = useState(false);
  const [searchChat, setSearchChat] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Share state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [sharedLink, setSharedLink] = useState("");
  const [networkLink, setNetworkLink] = useState("");
  const [localLink, setLocalLink] = useState("");
  const [activeLinkType, setActiveLinkType] = useState<"network" | "local">("network");
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [copyTranscriptSuccess, setCopyTranscriptSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Student");

    // Fetch initial chat history and suggested questions from API
    fetch("/api/student/ai-tutor")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.history)) {
          setMessages(data.history);
        }
        if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
          setSuggestedQuestions(data.suggestedQuestions);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch AI tutor data:", err);
        setErrorMsg("Unable to load the tutor session. Please refresh and try again.");
      });
  }, []);

  const handleSendQuestion = async (inputQuery?: string) => {
    const textToSubmit = (inputQuery || question).trim();
    if (!textToSubmit || loading) return;

    setErrorMsg(null);
    setQuestion("");
    setLoading(true);

    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/student/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSubmit }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request.");
      }
      if (data.success && data.aiResponse) {
        setMessages((current) => data.history || [...current, data.aiResponse]);
      } else {
        setErrorMsg(data.error || "Failed to process request. Please try again.");
      }
    } catch (err: any) {
      console.error("Error submitting question:", err);
      setErrorMsg(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = async () => {
    try {
      const res = await fetch("/api/student/ai-tutor", { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages([]);
        setErrorMsg(null);
      } else {
        setErrorMsg(data.error || "Failed to start a new chat.");
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

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      handleSendQuestion(lastUserMsg.content);
    }
  };

  const handleShareChat = async () => {
    if (messages.length === 0) return;
    setSharing(true);
    setCopyLinkSuccess(false);
    setCopyTranscriptSuccess(false);
    try {
      const firstUserMsg = messages.find((m) => m.role === "user");
      const title = firstUserMsg
        ? `AI Tutor: ${firstUserMsg.content.slice(0, 40)}${firstUserMsg.content.length > 40 ? "..." : ""}`
        : "AI Tutor Session";

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
        const local = `${window.location.origin}${sharePath}`;
        
        let network = local;
        if (data.networkIp && data.networkIp !== "localhost") {
          network = `${protocol}//${data.networkIp}${port}${sharePath}`;
        }

        setLocalLink(local);
        setNetworkLink(network);

        const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if (isLocalhost && network !== local) {
          setSharedLink(network);
          setActiveLinkType("network");
        } else {
          setSharedLink(local);
          setActiveLinkType("local");
        }

        setShareModalOpen(true);
      } else {
        setErrorMsg(data.error || "Failed to generate share link.");
      }
    } catch (err) {
      console.error("Error creating shared chat:", err);
      setErrorMsg("Failed to share chat. Please try again.");
    } finally {
      setSharing(false);
    }
  };

  const handleCopyShareLink = () => {
    if (!sharedLink) return;
    navigator.clipboard.writeText(sharedLink);
    setCopyLinkSuccess(true);
    setTimeout(() => setCopyLinkSuccess(false), 2000);
  };

  const handleCopyTranscript = () => {
    if (messages.length === 0) return;
    const formatted = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === "user" ? userName : "AI Tutor"}:\n${m.content}${
            m.keyPoints?.length ? "\nKey Points:\n- " + m.keyPoints.join("\n- ") : ""
          }`
      )
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(formatted);
    setCopyTranscriptSuccess(true);
    setTimeout(() => setCopyTranscriptSuccess(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share && sharedLink) {
      try {
        await navigator.share({
          title: "AI Tutor Chat Session",
          text: "Check out my AI Tutor session on AI College Copilot!",
          url: sharedLink,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else if (sharedLink) {
      window.open(`mailto:?subject=AI Tutor Chat Session&body=Check out my AI Tutor chat session: ${encodeURIComponent(sharedLink)}`, '_blank');
    }
  };

  const filteredMessages = messages.filter((m) =>
    searchChat
      ? m.content.toLowerCase().includes(searchChat.toLowerCase())
      : true
  );

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
          <nav className="flex-1 overflow-hidden px-4">
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
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.7 : 2.1}
                  />

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

          {/* BOTTOM */}
          <div className="flex shrink-0 items-center justify-between px-7 pb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-3 rounded-full px-4 py-2 ${
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
                className={
                  darkMode ? "text-white" : "text-[#17234b]"
                }
              />
            </button>

            <Link href="/student/settings#help-support" title="Help & Student Support">
              <CircleHelp
                size={25}
                className={
                  darkMode ? "text-white hover:text-purple-400" : "text-[#17234b] hover:text-[#4334d8]"
                }
              />
            </Link>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <section className="flex min-w-0 min-h-0 flex-1 flex-col">
          {/* HEADER */}
          <StudentHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={userName}
            searchPlaceholder="Search in chat..."
            searchValue={searchChat}
            onSearchChange={setSearchChat}
          />

          {/* ================= CHAT SECTION ================= */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* TUTOR HEADER */}
            <div className="flex shrink-0 items-center justify-between px-6 pb-2 pt-4 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#5b39ef] to-[#4a31d7] shadow-[0_6px_15px_rgba(74,49,215,0.2)]">
                  <GraduationCap
                    size={34}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <div>
                  <h2
                    className={`text-[24px] font-bold tracking-tight ${
                      darkMode ? "text-white" : "text-[#101d46]"
                    }`}
                  >
                    AI College Tutor
                  </h2>

                  <p
                    className={`text-[15px] ${
                      darkMode
                        ? "text-slate-300"
                        : "text-[#52698f]"
                    }`}
                  >
                    Your personal friendly study assistant.
                  </p>
                </div>
              </div>

              {messages.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareChat}
                    disabled={sharing}
                    className="flex items-center gap-2 rounded-[12px] bg-gradient-to-r from-[#6547ec] to-[#754be9] px-4 py-2 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(101,71,236,0.25)] transition hover:brightness-105 active:scale-95 disabled:opacity-50"
                    title="Share this chat session with someone"
                  >
                    {sharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                    Share Chat
                  </button>
                  <button
                    onClick={handleClearSession}
                    className={`flex items-center gap-2 rounded-[12px] border px-4 py-2 text-[14px] font-semibold transition ${
                      darkMode
                        ? "border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "border-[#dce6f4] bg-[#f8faff] text-[#556b8e] hover:bg-[#edf3ff]"
                    }`}
                    title="Start a new chat session"
                  >
                    <Trash2 size={16} />
                    New Chat
                  </button>
                </div>
              )}
            </div>

            {/* CHAT CONTENT MESSAGES */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 sm:px-8">
              <div className="mx-auto flex max-w-[920px] flex-col space-y-6">

                {errorMsg && (
                  <div className="flex items-center gap-3 rounded-[14px] border border-[#ffccd1] bg-[#fff0f2] p-4 text-[#e32b45]">
                    <AlertCircle size={22} className="shrink-0" />
                    <p className="flex-1 text-[14px] font-medium">{errorMsg}</p>
                    <button
                      onClick={() => setErrorMsg(null)}
                      className="text-[13px] font-bold underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {filteredMessages.length === 0 && !loading && (
                  <div className="my-8 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eee7ff] text-[#5234e4]">
                      <Sparkles size={36} />
                    </div>
                    <h3 className={`text-[20px] font-bold ${darkMode ? "text-white" : "text-[#14264d]"}`}>
                      How can I help you study today?
                    </h3>
                    <p className="mt-1 max-w-[500px] text-[15px] text-[#6b7e9e]">
                      Ask me to explain concepts, simplify difficult topics, quiz you, generate MCQs, or help you revise for your exam!
                    </p>
                  </div>
                )}

                {filteredMessages.map((msg) => {
                  if (msg.role === "user") {
                    return (
                      <div key={msg.id} className="flex justify-end pt-1">
                        <div className="max-w-[480px]">
                          <div className="rounded-[16px] rounded-br-[5px] bg-gradient-to-r from-[#5b39e9] to-[#6139e7] px-5 py-3.5 text-white shadow-[0_5px_15px_rgba(76,50,220,0.16)]">
                            <p className="text-[16px] leading-6 whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className="mt-1 text-right text-[12px] text-[#687d9e]">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Assistant Message
                  return (
                    <div key={msg.id} className="flex gap-4">
                      {/* AI ICON */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#5b39ef] to-[#4a31d7]">
                        <GraduationCap
                          size={34}
                          strokeWidth={2}
                          className="text-white"
                        />
                      </div>

                      {/* RESPONSE CARD */}
                      <div
                        className={`min-w-0 flex-1 rounded-[16px] border px-6 py-4 shadow-[0_4px_16px_rgba(36,74,130,0.035)] ${
                          darkMode
                            ? "border-slate-700 bg-[#202d49]"
                            : "border-[#dce6f4] bg-white"
                        }`}
                      >
                        <div
                          className={`text-[16px] leading-[1.58] whitespace-pre-wrap ${
                            darkMode
                              ? "text-slate-100"
                              : "text-[#14264d]"
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* KEY POINTS */}
                        {msg.keyPoints && msg.keyPoints.length > 0 && (
                          <>
                            <p className="mt-4 text-[17px] font-semibold text-[#5374a9]">
                              Key Points:
                            </p>
                            <ol
                              className={`mt-1 list-decimal space-y-1 pl-6 text-[16px] leading-6 ${
                                darkMode
                                  ? "text-slate-100"
                                  : "text-[#14264d]"
                              }`}
                            >
                              {msg.keyPoints.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ol>
                          </>
                        )}

                        {/* SOURCES */}
                        {msg.sources && msg.sources.length > 0 && (
                          <>
                            <p className="mt-4 text-[17px] font-semibold text-[#5374a9]">
                              Sources ({msg.sources.length})
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {msg.sources.map((src, i) => (
                                <SourceButton key={i} title={src} />
                              ))}
                            </div>
                          </>
                        )}

                        {/* ACTIONS */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <ResponseAction
                            icon={
                              copiedId === msg.id ? (
                                <Check size={17} className="text-green-500" />
                              ) : (
                                <Copy size={17} />
                              )
                            }
                            title={copiedId === msg.id ? "Copied!" : "Copy"}
                            onClick={() => handleCopy(msg.id, msg.content)}
                          />

                          <ResponseAction
                            icon={<RefreshCw size={17} />}
                            title="Regenerate"
                            onClick={handleRegenerate}
                          />

                          <ResponseAction
                            icon={<Share2 size={17} />}
                            title="Share"
                            onClick={handleShareChat}
                          />

                          <ResponseAction
                            icon={<MoreHorizontal size={18} />}
                            title="More"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* LOADING INDICATOR */}
                {loading && (
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#5b39ef] to-[#4a31d7] animate-pulse">
                      <GraduationCap size={34} strokeWidth={2} className="text-white" />
                    </div>

                    <div
                      className={`flex items-center gap-3 rounded-[16px] border px-6 py-4 ${
                        darkMode
                          ? "border-slate-700 bg-[#202d49]"
                          : "border-[#dce6f4] bg-white"
                      }`}
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-[#5b39ef]" />
                      <p className={`text-[15px] font-medium ${darkMode ? "text-slate-300" : "text-[#52698f]"}`}>
                        AI Tutor is typing...
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ================= BOTTOM INPUT ================= */}
            <div className="mx-auto w-full max-w-[920px] shrink-0 px-6 pb-4 pt-2 sm:px-8">
              {/* SUGGESTIONS */}
              <p className="mb-2 text-[15px] font-semibold text-[#58729d]">
                Suggested Topics & Prompts
              </p>

              <div className="mb-3 flex gap-3 overflow-x-auto pb-1">
                {suggestedQuestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSendQuestion(item)}
                    className={`whitespace-nowrap rounded-[12px] border px-5 py-2 text-[14px] font-medium transition hover:shadow-sm ${
                      darkMode
                        ? "border-slate-600 bg-[#202d49] text-[#b9c8ff] hover:bg-slate-700"
                        : "border-[#d9e2f3] bg-[#f8f9ff] text-[#4935c9] hover:bg-[#eef2ff]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <div
                className={`flex h-[58px] items-center rounded-[15px] border px-5 shadow-[0_4px_15px_rgba(36,74,130,0.04)] ${
                  darkMode
                    ? "border-slate-600 bg-[#202d49]"
                    : "border-[#d7e2f1] bg-white"
                }`}
              >
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendQuestion();
                    }
                  }}
                  type="text"
                  placeholder="Ask any question, ask for a quiz, or say 'explain simply'..."
                  disabled={loading}
                  className={`flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#6e82a5] ${
                    darkMode ? "text-white" : "text-[#1a2a4f]"
                  }`}
                />

                <button
                  onClick={() => handleSendQuestion()}
                  disabled={loading}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5234e4] to-[#6336e7] text-white shadow-[0_5px_15px_rgba(83,48,220,0.25)] transition hover:scale-105 disabled:opacity-50"
                >
                  <Send size={21} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SHARE CHAT MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-[540px] rounded-[24px] border p-6 shadow-2xl transition-all sm:p-8 ${
              darkMode ? "border-slate-700 bg-[#1e2942] text-white" : "border-[#e2e8f5] bg-white text-[#172552]"
            }`}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X size={20} />
            </button>

            {/* MODAL HEADER */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6547ec] to-[#754be9] text-white shadow-lg">
                <Share2 size={24} />
              </div>
              <div>
                <h3 className="text-[20px] font-bold tracking-tight">Share AI Tutor Session</h3>
                <p className={`text-[14px] ${darkMode ? "text-slate-400" : "text-[#7084a7]"}`}>
                  Anyone with this link can view this study conversation.
                </p>
              </div>
            </div>

            {/* LINK TYPE TABS (NETWORK vs LOCAL) */}
            <div className="mt-5 flex rounded-[12px] bg-[#f0f4fa] dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveLinkType("network");
                  setSharedLink(networkLink || localLink);
                }}
                className={`flex-1 rounded-[10px] py-2 text-[13px] font-bold transition ${
                  activeLinkType === "network"
                    ? "bg-white text-[#4f37d6] shadow-sm dark:bg-[#283654] dark:text-purple-300"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                🌐 Network Link (For others on Wi-Fi)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveLinkType("local");
                  setSharedLink(localLink);
                }}
                className={`flex-1 rounded-[10px] py-2 text-[13px] font-bold transition ${
                  activeLinkType === "local"
                    ? "bg-white text-[#4f37d6] shadow-sm dark:bg-[#283654] dark:text-purple-300"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                💻 Local Link (This PC)
              </button>
            </div>

            {/* SHARE LINK INPUT */}
            <div className="mt-4">
              <label className="block text-[13px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {activeLinkType === "network" ? "Shareable Network URL" : "Local Machine URL"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={sharedLink}
                  className={`h-[48px] flex-1 rounded-[14px] border px-4 text-[13px] font-mono outline-none ${
                    darkMode
                      ? "border-slate-600 bg-slate-800/60 text-slate-200"
                      : "border-[#dce4f2] bg-[#f8fafe] text-[#243763]"
                  }`}
                />
                <button
                  onClick={handleCopyShareLink}
                  className="flex h-[48px] items-center gap-2 rounded-[14px] bg-gradient-to-r from-[#6547ec] to-[#754be9] px-5 text-[14px] font-bold text-white shadow-md transition hover:brightness-105 active:scale-95 shrink-0"
                >
                  {copyLinkSuccess ? <Check size={18} /> : <Copy size={18} />}
                  {copyLinkSuccess ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* EXPLANATION TIP */}
            <div className="mt-4 rounded-[14px] border border-[#d9e6ff] bg-[#f0f6ff] dark:border-slate-700 dark:bg-slate-800/80 p-3.5 text-[13px] text-[#294273] dark:text-slate-300">
              <p className="font-semibold flex items-center gap-1.5 text-[#4433ca] dark:text-purple-300">
                <Sparkles size={16} /> How sharing works:
              </p>
              <ul className="mt-1 space-y-1 pl-4 list-disc text-[12px] leading-5">
                <li><strong>Same Wi-Fi network:</strong> Use <em>Network Link</em> so others on phones/tablets can view.</li>
                <li><strong>Deployed site:</strong> When hosted on Vercel/Netlify, your domain link works for everyone online.</li>
                <li><strong>Alternative:</strong> Use <em>Copy Full Transcript</em> to send raw text via chat or email.</li>
              </ul>
            </div>

            {/* ADDITIONAL ACTIONS */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleCopyTranscript}
                className={`flex items-center gap-2 rounded-[14px] border px-4 py-2.5 text-[14px] font-semibold transition ${
                  darkMode
                    ? "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "border-[#dce5f2] bg-[#f5f8ff] text-[#3b5280] hover:bg-[#ebf2ff]"
                }`}
              >
                {copyTranscriptSuccess ? <Check size={18} className="text-green-500" /> : <FileText size={18} />}
                {copyTranscriptSuccess ? "Transcript Copied!" : "Copy Full Transcript"}
              </button>

              <button
                onClick={handleNativeShare}
                className={`flex items-center gap-2 rounded-[14px] border px-4 py-2.5 text-[14px] font-semibold transition ${
                  darkMode
                    ? "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "border-[#dce5f2] bg-[#f5f8ff] text-[#3b5280] hover:bg-[#ebf2ff]"
                }`}
              >
                <Share2 size={18} />
                Send via App / Email
              </button>

              <Link
                href={sharedLink}
                target="_blank"
                className="flex items-center gap-2 rounded-[14px] bg-[#edf2ff] px-4 py-2.5 text-[14px] font-semibold text-[#4835d4] transition hover:bg-[#e1e9ff] dark:bg-slate-800 dark:text-purple-300 dark:hover:bg-slate-700"
              >
                Preview Link
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   SOURCE BUTTON
========================================================= */

function SourceButton({ title }: { title: string }) {
  return (
    <button className="flex items-center gap-2 rounded-[12px] border border-[#d9e3f2] bg-white px-4 py-2 text-[14px] font-medium text-[#365784] shadow-[0_2px_5px_rgba(40,70,120,0.03)] transition hover:bg-[#f8faff]">
      <FileText size={18} className="text-[#2860bd]" />
      {title}
    </button>
  );
}

/* =========================================================
   RESPONSE ACTION
========================================================= */

function ResponseAction({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-[12px] border border-[#dce5f2] bg-[#f8faff] px-4 py-2 text-[14px] font-medium text-[#3d5d89] transition hover:bg-[#f0f5ff] active:scale-95"
    >
      {icon}
      {title}
    </button>
  );
}