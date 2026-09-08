import { LucideGraduationCap, LucideBot, LucideSparkles, LucideArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans">
      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black shadow-md">
              A
            </div>
            <span>AI College Copilot</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-300">
            <Link href="/login?role=Student" className="hover:text-indigo-400 transition">
              Student Portal
            </Link>
            <Link href="/login?role=Faculty" className="hover:text-purple-400 transition">
              Faculty Portal
            </Link>
            <Link href="/login?role=Admin" className="hover:text-pink-400 transition">
              Admin Portal
            </Link>
            <Link href="/login?role=Student" className="hover:text-indigo-400 transition">
              AI Tutor
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-neutral-700 px-5 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 transition"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        {/* Hero Section */}
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-1.5 text-sm font-medium text-neutral-300 ring-1 ring-inset ring-neutral-800/20 backdrop-blur">
            <span className="flex items-center gap-2">
              <LucideSparkles className="h-4 w-4 text-indigo-400" />
              Introducing AI College Copilot v1.0
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Your Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Academic Assistant
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-neutral-400 max-w-xl">
            Streamline your college experience with AI. Manage schedules, summarize lectures, track assignments, and boost your GPA with intelligent, personalized insights.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:scale-105"
            >
              Get Started Now
            </Link>
            <Link
              href="/login?role=Student"
              className="group text-sm font-semibold leading-6 text-white flex items-center gap-2 hover:text-indigo-300 transition-colors border border-neutral-800 rounded-full px-6 py-3 bg-neutral-900/60"
            >
              Student Portal <LucideArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login?role=Faculty"
              className="group text-sm font-semibold leading-6 text-neutral-300 flex items-center gap-2 hover:text-purple-300 transition-colors border border-neutral-800 rounded-full px-6 py-3 bg-neutral-900/60"
            >
              Faculty Portal
            </Link>
            <Link
              href="/login?role=Admin"
              className="group text-sm font-semibold leading-6 text-neutral-300 flex items-center gap-2 hover:text-pink-300 transition-colors border border-neutral-800 rounded-full px-6 py-3 bg-neutral-900/60"
            >
              Admin Portal
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 hover:bg-neutral-900/80 transition-colors backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <LucideBot className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Tutor</h3>
              <p className="text-neutral-400">Get instant help with assignments, code debugging, and essay writing from your 24/7 personal AI tutor.</p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 hover:bg-neutral-900/80 transition-colors backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <LucideGraduationCap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Planning</h3>
              <p className="text-neutral-400">Automatically organize your syllabus, deadline tracking, and exam prep schedules seamlessly.</p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 hover:bg-neutral-900/80 transition-colors backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6">
                <LucideSparkles className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Career Prep</h3>
              <p className="text-neutral-400">AI-driven resume reviews and mock interviews to prepare you for the post-grad professional world.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
