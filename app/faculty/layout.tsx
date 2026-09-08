"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role || role !== "Faculty") {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
