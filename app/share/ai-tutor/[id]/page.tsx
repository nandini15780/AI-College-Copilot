"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Copy,
  Check,
  FileText,
  Share2,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  keyPoints?: string[];
  sources?: string[];
  timestamp: string;
}

interface SharedChatData {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  sharedBy: string;
}

export default function SharedAIChatPage() {
  const params = useParams();
  const id = params?.id as string;

  const [chatData, setChatData] = useState<SharedChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/share/ai-tutor/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.sharedChat) {
          setChatData(data.sharedChat);
        } else {
          setError(data.error || "Shared chat not found or link has expired.");
        }
      })
      .catch((err) => {
        console.error("Failed to load shared chat:", err);
        setError("Unable to load shared chat. Please check your internet connection.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTranscript = () => {
    if (!chatData || !chatData.messages) return;
    const formatted = chatData.messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === "user" ? chatData.sharedBy || "Student" : "AI Tutor"}:\n${m.content}${
            m.keyPoints?.length ? "\nKey Points:\n- " + m.keyPoints.join("\n- ") : ""
          }`
      )
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(formatted);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#edf3ff] p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-[24px] border border-[#dce6f4] bg-white shadow-[0_15px_50px_rgba(40,75,130,0.08)]">
        
        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6edf8] bg-[#f8faff] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#5b39ef] to-[#4a31d7] shadow-md">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold tracking-tight text-[#14264d]">
                AI College Copilot
              </h1>
              <p className="text-[13px] font-medium text-[#657a9e]">
                Shared AI Tutor Conversation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-[12px] border border-[#d4deee] bg-white px-4 py-2 text-[14px] font-semibold text-[#293d63] shadow-sm transition hover:bg-[#f0f5ff] active:scale-95"
            >
              {copiedLink ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              {copiedLink ? "Link Copied!" : "Copy Link"}
            </button>

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-[12px] bg-gradient-to-r from-[#6547ec] to-[#754be9] px-5 py-2 text-[14px] font-bold text-white shadow-md transition hover:brightness-105 active:scale-95"
            >
              Join AI Copilot
              <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-6 sm:p-8 lg:p-10">
          {loading ? (
            <div className="my-16 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#5b39ef]" />
              <p className="text-[16px] font-medium text-[#5e7399]">
                Loading shared AI Tutor chat...
              </p>
            </div>
          ) : error ? (
            <div className="my-12 flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffebee] text-[#e53935]">
                <AlertCircle size={36} />
              </div>
              <h2 className="text-[22px] font-bold text-[#14264d]">{error}</h2>
              <p className="mt-2 max-w-[450px] text-[15px] text-[#6b7e9e]">
                The link might be incorrect or the chat session is no longer available.
              </p>
              <Link
                href="/login"
                className="mt-6 flex items-center gap-2 rounded-[14px] bg-[#6547ec] px-6 py-3 text-[15px] font-bold text-white shadow-md transition hover:bg-[#5438d6]"
              >
                Go to AI College Copilot
              </Link>
            </div>
          ) : chatData ? (
            <div>
              {/* CHAT SESSION METADATA CARD */}
              <div className="mb-8 rounded-[20px] border border-[#e1eaf7] bg-gradient-to-br from-[#f6f9ff] to-[#eef4ff] p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3eafd] px-3.5 py-1 text-[13px] font-bold text-[#4536cb]">
                      <Sparkles size={14} /> Shared Study Session
                    </span>
                    <h2 className="mt-3 text-[24px] font-bold text-[#14264d] tracking-tight">
                      {chatData.title}
                    </h2>
                  </div>

                  <button
                    onClick={handleCopyTranscript}
                    className="flex items-center gap-2 rounded-[12px] border border-[#d2def0] bg-white px-4 py-2 text-[13px] font-semibold text-[#37527e] shadow-sm hover:bg-[#f8faff]"
                  >
                    {copiedTranscript ? <Check size={16} className="text-green-500" /> : <FileText size={16} />}
                    {copiedTranscript ? "Copied!" : "Copy Full Transcript"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-6 text-[14px] font-medium text-[#62779c]">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#4b3acb]" />
                    <span>Shared by: <strong className="text-[#1c2d54]">{chatData.sharedBy || "Student"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#4b3acb]" />
                    <span>Created: {new Date(chatData.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#4b3acb]" />
                    <span>{chatData.messages.length} Messages</span>
                  </div>
                </div>
              </div>

              {/* MESSAGES LIST */}
              <div className="space-y-6">
                {chatData.messages.map((msg) => {
                  if (msg.role === "user") {
                    return (
                      <div key={msg.id} className="flex justify-end pt-2">
                        <div className="max-w-[620px]">
                          <div className="rounded-[18px] rounded-br-[4px] bg-gradient-to-r from-[#5b39e9] to-[#6139e7] px-6 py-4 text-white shadow-[0_5px_15px_rgba(76,50,220,0.15)]">
                            <p className="text-[16px] leading-7 whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className="mt-1 text-right text-[12px] font-medium text-[#7489ab]">
                            {chatData.sharedBy || "Student"} • {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Assistant Message
                  return (
                    <div key={msg.id} className="flex gap-4 pt-2">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#5b39ef] to-[#4a31d7] shadow-sm">
                        <GraduationCap size={28} className="text-white" />
                      </div>

                      <div className="min-w-0 flex-1 rounded-[20px] border border-[#dce6f4] bg-white p-6 shadow-[0_4px_16px_rgba(36,74,130,0.03)]">
                        <div className="flex items-center justify-between border-b border-[#f0f4fc] pb-3 mb-4">
                          <span className="text-[15px] font-bold text-[#14264d]">
                            AI College Tutor
                          </span>
                          <span className="text-[12px] font-medium text-[#7b8ea9]">
                            {msg.timestamp}
                          </span>
                        </div>

                        <div className="text-[16px] leading-[1.65] text-[#14264d] whitespace-pre-wrap">
                          {msg.content}
                        </div>

                        {/* KEY POINTS */}
                        {msg.keyPoints && msg.keyPoints.length > 0 && (
                          <div className="mt-5 rounded-[14px] bg-[#f7f9fe] p-4 border border-[#e5edf9]">
                            <p className="text-[15px] font-bold text-[#4536cb]">
                              Key Summary Points:
                            </p>
                            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] text-[#243763]">
                              {msg.keyPoints.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* SOURCES */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#667c9f]">Reference Materials:</span>
                            {msg.sources.map((src, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9e3f2] bg-[#f8faff] px-3 py-1 text-[13px] font-medium text-[#365784]">
                                <FileText size={14} className="text-[#2860bd]" />
                                {src}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER CALL TO ACTION */}
              <div className="mt-12 rounded-[20px] bg-gradient-to-r from-[#5a38ef] via-[#6747ec] to-[#754be9] p-8 text-center text-white shadow-xl">
                <h3 className="text-[24px] font-bold tracking-tight">
                  Want your own AI College Tutor?
                </h3>
                <p className="mt-2 text-[15px] text-[#dcd6ff]">
                  Get instant answers, personalized study notes, exam preparation, and class schedule management.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="flex items-center gap-2 rounded-[14px] bg-white px-7 py-3.5 text-[16px] font-bold text-[#5a38ef] shadow-lg transition hover:bg-[#f0f3ff] active:scale-95"
                  >
                    Get Started Free
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-[14px] border border-white/40 bg-white/10 px-6 py-3.5 text-[16px] font-bold text-white transition hover:bg-white/20"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
