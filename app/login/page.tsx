"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");

  const [role, setRole] = useState<"Student" | "Faculty" | "Admin">("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (initialRoleParam === "Faculty") {
      setRole("Faculty");
    } else if (initialRoleParam === "Admin") {
      setRole("Admin");
    } else if (initialRoleParam === "Student") {
      setRole("Student");
    }
  }, [initialRoleParam]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Login successful, save role and user name for route-specific page behavior
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", role);

      if (role === "Student") {
        router.push("/student/dashboard");
      } else if (role === "Faculty") {
        router.push("/faculty-dashboard");
      } else if (role === "Admin") {
        router.push("/Admin-dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#edf3ff] p-2 sm:p-3 lg:p-4">
      <div className="relative mx-auto h-[calc(100vh-16px)] max-w-[1500px] overflow-hidden rounded-[25px] border border-white bg-[#f9fbff] shadow-[0_15px_50px_rgba(70,90,150,0.12)]">

        {/* TOP RIGHT DECORATION */}
        <div className="absolute -right-14 -top-20 h-48 w-80 rotate-[-12deg] rounded-[70px] bg-gradient-to-br from-[#ddd7ff] via-[#e8e4ff] to-[#cafff3]" />

        {/* BACKGROUND GLOW */}
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#dffaff] opacity-60 blur-3xl" />

        {/* HEADER */}
        <header className="relative z-10 flex items-center gap-4 px-8 pt-5 sm:px-10">

          {/* Graduation logo */}
          <div className="relative h-[55px] w-[62px]">
            <div
              className="absolute left-[2px] top-[4px] h-[32px] w-[53px] rotate-[30deg] bg-gradient-to-br from-[#6751ee] to-[#3023a5]"
              style={{
                clipPath:
                  "polygon(50% 0%, 100% 45%, 50% 90%, 0% 45%)",
              }}
            />

            <div className="absolute left-[12px] top-[25px] h-[19px] w-[39px] rounded-b-[18px] bg-[#30239c]" />

            <div className="absolute left-[50px] top-[22px] h-[29px] w-[3px] bg-[#5041c7]" />

            <div className="absolute left-[47px] top-[48px] h-[7px] w-[7px] rounded-full bg-[#5041c7]" />
          </div>

          <div>
            <h1 className="text-[27px] font-bold tracking-[-0.8px] text-[#172653] sm:text-[30px]">
              AI College Copilot
            </h1>

            <p className="mt-1 text-[15px] font-semibold text-[#8296b8] sm:text-[16px]">
              Your College Life, Smarter.
            </p>
          </div>
        </header>

        {/* MAIN */}
        <div className="relative z-10 grid h-[calc(100vh-90px)] lg:grid-cols-[46%_54%]">

          {/* ================= LEFT ================= */}
          <section className="flex flex-col justify-center px-8 py-3 sm:px-12 lg:px-14 xl:px-16">

            <div className="mx-auto w-full max-w-[520px]">

              {/* ILLUSTRATION */}
              <div className="relative mx-auto mb-3 h-[230px] w-full">

                {/* Glow */}
                <div className="absolute left-[15%] top-[20%] h-[190px] w-[300px] rounded-full bg-[#e1ffff] opacity-60 blur-2xl" />

                {/* BOOKS */}
                <div className="absolute bottom-[35px] left-[6%]">

                  {/* Bottom book */}
                  <div className="h-[40px] w-[185px] rounded-[4px] border-[5px] border-[#6553ce] bg-[#eeeaff]" />

                  {/* Top book */}
                  <div className="-mt-[5px] ml-[5px] h-[47px] w-[175px] rounded-[4px] border-[5px] border-[#70d9ce] bg-[#dffff8]" />
                </div>

                {/* GRADUATION CAP */}
                <div className="absolute left-[13%] top-[35px]">

                  <div
                    className="h-[75px] w-[140px] rotate-[3deg] bg-gradient-to-br from-[#6651ee] to-[#3023a4] shadow-lg"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 35%, 50% 70%, 0% 35%)",
                    }}
                  />

                  <div className="absolute left-[48px] top-[45px] h-[48px] w-[48px] rounded-b-[50%] bg-[#3023a4]" />

                  <div className="absolute left-[69px] top-[49px] h-[42px] w-[3px] bg-[#5141c7]" />

                  <div className="absolute left-[64px] top-[87px] h-[10px] w-[10px] rounded-full bg-[#5141c7]" />
                </div>

                {/* LAPTOP */}
                <div className="absolute right-[3%] top-[83px] rotate-[-7deg]">

                  <div className="relative h-[135px] w-[205px] rounded-[13px] border-[8px] border-[#dce5ff] bg-[#eaf0ff] shadow-[0_12px_25px_rgba(70,80,150,0.16)]">

                    <div className="absolute inset-[8px] flex items-center justify-center rounded-[5px] bg-gradient-to-br from-[#604bdf] to-[#3826b4]">

                      <span className="text-[60px] font-bold text-white">
                        A
                      </span>

                    </div>
                  </div>

                  {/* Laptop base */}
                  <div className="-ml-[17px] h-[19px] w-[239px] rounded-b-[18px] bg-gradient-to-b from-[#d9e1fa] to-[#c0caeb]" />
                </div>

                {/* STARS */}
                <span className="absolute left-[1%] top-[105px] text-[25px] text-[#4dd8e7]">
                  ✦
                </span>

                <span className="absolute left-[48%] top-[20px] text-[32px] text-[#4dd8e7]">
                  ✦
                </span>

                <span className="absolute right-[0] bottom-[45px] text-[27px] text-[#4dd8e7]">
                  ✦
                </span>

                <span className="absolute right-[24%] top-[62px] text-[18px] text-[#65dcd9]">
                  ✦
                </span>
              </div>

              {/* HEADING */}
              <h2 className="text-[34px] font-bold leading-[1.12] tracking-[-1px] text-[#152657] sm:text-[37px]">
                Smarter Learning
                <br />
                Brighter Future
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-3 text-[15px] font-semibold leading-6 text-[#7185a8] sm:text-[15px]">
                Get instant answers, access study materials,
                <br className="hidden sm:block" />
                track your progress and more — all in one place.
              </p>

              {/* FEATURES */}
              <div className="mt-3 space-y-2">

                <Feature
                  icon="✦"
                  text="AI Powered Assistant"
                />

                <Feature
                  icon="▣"
                  text="AI College Resources"
                />

                <Feature
                  icon="♟"
                  text="Personalized Learning"
                />

                </div>
            </div>
          </section>

          {/* ================= RIGHT ================= */}
          <section className="flex items-center justify-center px-5 pb-12 pt-5 sm:px-10 lg:px-8 xl:px-12">

            <div className="w-full max-w-[655px] rounded-[25px] border border-[#eef0f7] bg-white px-7 py-6 shadow-[0_15px_45px_rgba(65,80,135,0.10)] sm:px-10 sm:py-6 xl:px-12">

              {/* WELCOME */}
              <h2 className="text-[31px] font-bold tracking-[-0.7px] text-[#172552]">
                Welcome Back!
              </h2>

              <p className="mt-2 text-[16px] font-semibold text-[#8498ba]">
                Login to continue to your account
              </p>

              {/* ROLE TABS */}
              <div className="mt-5 grid grid-cols-3 rounded-[14px] bg-[#f5f6fa] p-1">

                {(["Student", "Faculty", "Admin"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`h-[58px] rounded-[12px] text-[16px] font-bold transition ${role === item
                      ? "bg-gradient-to-r from-[#6547ec] to-[#754be9] text-white shadow-[0_5px_14px_rgba(101,72,237,0.25)]"
                      : "text-[#5d6a82] hover:bg-white"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >

                {/* ACCOUNT IDENTIFIER */}
                <label
                  htmlFor="college-id"
                  className="block text-[17px] font-bold text-[#293a5f]"
                >
                  {role === "Admin" ? "Admin Email" : role === "Faculty" ? "Faculty ID or Email" : "Student College ID or Email"}
                </label>

                <input
                  id="college-id"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === "Admin"
                      ? "admin@college.edu"
                      : role === "Faculty"
                      ? "e.g. FAC102 or faculty@college.edu"
                      : "e.g. 22CS101 or student@college.edu"
                  }
                  className="mt-2 h-[55px] w-full rounded-[14px] border border-[#dce2ec] px-5 text-[16px] outline-none placeholder:text-[#a2b0c6] focus:border-[#7052e8] focus:ring-4 focus:ring-[#7052e8]/10"
                />

                {/* PASSWORD */}
                <label
                  htmlFor="password"
                  className="mt-4 block text-[17px] font-bold text-[#293a5f]"
                >
                  Password
                </label>

                <div className="relative mt-2">

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-[55px] w-full rounded-[14px] border border-[#dce2ec] px-5 pr-14 text-[16px] outline-none placeholder:text-[#a2b0c6] focus:border-[#7052e8] focus:ring-4 focus:ring-[#7052e8]/10"
                  />

                  {/* EYE */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8d9db6] hover:text-[#6049d7]"
                    aria-label="Toggle password"
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="mt-2 flex justify-end">

                  <button
                    type="button"
                    className="text-[15px] font-bold text-[#674ed5] hover:underline"
                  >
                    Forgot password?
                  </button>

                </div>

                {/* ERROR MESSAGE */}
                {error && <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>}

                {/* LOGIN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 h-[55px] w-full rounded-[14px] bg-gradient-to-r from-[#6547ec] to-[#754be9] text-[18px] font-bold text-white shadow-[0_8px_18px_rgba(101,71,236,0.25)] transition hover:brightness-105 active:scale-[0.99] disabled:opacity-70"
                >
                  {loading
                    ? "Logging in..."
                    : role === "Admin"
                    ? "Login as Admin"
                    : role === "Faculty"
                    ? "Login as Faculty"
                    : "Login as Student"}
                </button>

              </form>

              {/* CONTACT ADMIN */}
              <p className="mt-4 text-center text-[15px] font-semibold text-[#919fb7]">

                Don&apos;t have an account?{" "}

                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-bold text-[#654bd3] hover:underline"
                >
                  Register Here
                </button>

              </p>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-screen items-center justify-center bg-[#edf3ff]">
          <div className="text-xl font-bold text-[#172653]">Loading login page...</div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

/* FEATURE */

function Feature({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef0ff] text-lg font-bold text-[#5542d2]">
        {icon}
      </div>

      <span className="text-[15px] font-bold text-[#344568]">
        {text}
      </span>

    </div>
  );
}