"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [role, setRole] = useState<"Student" | "Faculty" | "Admin">("Student");
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [collegeId, setCollegeId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, collegeId: role === "Admin" ? "" : collegeId, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                setLoading(false);
                return;
            }

            // Automatically login or route to login
            router.push("/login"); // After registering, they can login
        } catch (err) {
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen overflow-y-auto bg-[#edf3ff] p-2 sm:p-3 lg:p-4 flex items-center justify-center">
            <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[25px] border border-white bg-[#f9fbff] shadow-[0_15px_50px_rgba(70,90,150,0.12)]">

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
                            Join Your College Network
                        </p>
                    </div>
                </header>

                {/* MAIN */}
                <div className="relative z-10 grid min-h-[calc(100vh-130px)] lg:grid-cols-[46%_54%] py-4">

                    {/* ================= LEFT ================= */}
                    <section className="flex flex-col justify-center px-8 py-3 sm:px-12 lg:px-14 xl:px-16">

                        <div className="mx-auto w-full max-w-[520px]">

                            {/* HEADING */}
                            <h2 className="text-[34px] font-bold leading-[1.12] tracking-[-1px] text-[#152657] sm:text-[37px]">
                                Create an Account
                                <br />
                                Start Your Journey
                            </h2>

                            {/* DESCRIPTION */}
                            <p className="mt-3 text-[15px] font-semibold leading-6 text-[#7185a8] sm:text-[15px]">
                                Sign up today to get an AI-powered assistant for your college coursework, schedules, and career.
                            </p>

                            {/* FEATURES */}
                            <div className="mt-8 space-y-4">

                                <Feature
                                    icon="✦"
                                    text="Automated Study Schedules"
                                />

                                <Feature
                                    icon="▣"
                                    text="Connect with Faculty & Peers"
                                />

                                <Feature
                                    icon="♟"
                                    text="AI Progress Tracking"
                                />

                            </div>
                        </div>
                    </section>

                    {/* ================= RIGHT ================= */}
                    <section className="flex items-center justify-center px-5 pb-8 pt-5 sm:px-10 lg:px-8 xl:px-12">

                        <div className="w-full max-w-[655px] rounded-[25px] border border-[#eef0f7] bg-white px-7 py-6 shadow-[0_15px_45px_rgba(65,80,135,0.10)] sm:px-10 sm:py-6 xl:px-12">

                            {/* WELCOME */}
                            <h2 className="text-[28px] font-bold tracking-[-0.7px] text-[#172552]">
                                Register
                            </h2>

                            {/* ROLE TABS */}
                            <div className="mt-5 grid grid-cols-3 rounded-[14px] bg-[#f5f6fa] p-1">

                                {(["Student", "Faculty", "Admin"] as const).map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setRole(item)}
                                        className={`h-[50px] rounded-[12px] text-[15px] font-bold transition ${role === item
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
                                className="mt-5 space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleRegister();
                                }}
                            >

                                {/* NAME */}
                                <div>
                                    <label htmlFor="name" className="block text-[15px] font-bold text-[#293a5f]">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="mt-1 h-[50px] w-full rounded-[14px] border border-[#dce2ec] px-5 text-[15px] outline-none placeholder:text-[#a2b0c6] focus:border-[#7052e8] focus:ring-4 focus:ring-[#7052e8]/10"
                                    />
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <label htmlFor="email" className="block text-[15px] font-bold text-[#293a5f]">
                                        {role === "Student" ? "Student Email" : role === "Faculty" ? "Faculty Email" : "Admin Email"}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={role === "Student" ? "student@college.edu" : role === "Faculty" ? "faculty@college.edu" : "admin@college.edu"}
                                        className="mt-1 h-[50px] w-full rounded-[14px] border border-[#dce2ec] px-5 text-[15px] outline-none placeholder:text-[#a2b0c6] focus:border-[#7052e8] focus:ring-4 focus:ring-[#7052e8]/10"
                                    />
                                </div>

                                {/* ID FOR STUDENTS AND FACULTY (HIDDEN FOR ADMIN) */}
                                {role !== "Admin" && (
                                    <div>
                                        <label htmlFor="college-id" className="block text-[15px] font-bold text-[#293a5f]">
                                            {role === "Faculty" ? "Faculty / Employee ID" : "College ID / Roll No"}
                                        </label>
                                        <input
                                            id="college-id"
                                            type="text"
                                            value={collegeId}
                                            onChange={(e) => setCollegeId(e.target.value)}
                                            placeholder={role === "Faculty" ? "e.g. FAC102" : "e.g. 22CS101"}
                                            className="mt-1 h-[50px] w-full rounded-[14px] border border-[#dce2ec] px-5 text-[15px] outline-none placeholder:text-[#a2b0c6] focus:border-[#7052e8] focus:ring-4 focus:ring-[#7052e8]/10"
                                        />
                                    </div>
                                )}

                                {/* PASSWORD */}
                                <div>
                                    <label htmlFor="password" className="block text-[15px] font-bold text-[#293a5f]">
                                        Password
                                    </label>
                                    <div className="relative mt-1">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter a strong password"
                                            className="h-[50px] w-full rounded-[14px] border border-[#dce2ec] px-5 pr-14 text-[15px] outline-none placeholder:text-[#a2b0c6] focus:border-[#7052e8] focus:ring-4 focus:ring-[#7052e8]/10"
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
                                </div>

                                {/* ERROR MESSAGE */}
                                {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

                                {/* REGISTER */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 h-[55px] w-full rounded-[14px] bg-gradient-to-r from-[#6547ec] to-[#754be9] text-[18px] font-bold text-white shadow-[0_8px_18px_rgba(101,71,236,0.25)] transition hover:brightness-105 active:scale-[0.99] disabled:opacity-70"
                                >
                                    {loading
                                        ? "Registering..."
                                        : role === "Admin"
                                        ? "Register as Admin"
                                        : role === "Faculty"
                                        ? "Register as Faculty"
                                        : "Register as Student"}
                                </button>
                            </form>

                            {/* LOGIN LINK */}
                            <p className="mt-4 text-center text-[15px] font-semibold text-[#919fb7]">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push("/login")}
                                    className="font-bold text-[#654bd3] hover:underline"
                                >
                                    Login Here
                                </button>
                            </p>

                        </div>
                    </section>
                </div>
            </div>
        </main>
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
