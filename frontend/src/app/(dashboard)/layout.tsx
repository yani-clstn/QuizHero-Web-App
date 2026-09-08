"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IconCvSU, IconLogOut } from "@/components/icons";
import { UserRole } from "@/types/quiz";
import AIChatbot from "@/components/shared/AIChatbot";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return <div className="min-h-screen flex items-center justify-center text-cvsu-green font-medium">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#1C1C1C] flex flex-col items-center selection:bg-cvsu-vibrant selection:text-cvsu-dark relative view-transition">
      {/* Institutional Top Navbar in Fresh Academic Green */}
      <header className="w-full sticky top-0 z-40 bg-cvsu-dark text-white border-b border-white/10 shadow-md backdrop-blur-md">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
          <Link
            href={user.role === "teacher" ? "/teacher" : "/student"}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-cvsu-vibrant text-cvsu-dark flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <IconCvSU size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cvsu-vibrant transition-colors">
                  Quiz Hero
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cvsu-vibrant text-cvsu-dark shadow-xs">
                  CvSU Imus
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-medium">Cavite State University – Imus Campus</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{user.full_name}</p>
              <p className="text-[11px] text-white/60 font-mono mt-1 leading-none">{user.email}</p>
            </div>

            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono shadow-xs border ${
                user.role === "teacher"
                  ? "bg-cvsu-vibrant/20 text-cvsu-vibrant border-cvsu-vibrant/40"
                  : "bg-cvsu-vibrant text-cvsu-dark border-cvsu-vibrant"
              }`}
            >
              {user.role === "teacher" ? "Faculty Studio" : "Student"}
            </span>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              title="Sign Out"
              className="p-2 text-white/70 hover:text-cvsu-vibrant hover:bg-white/10 rounded-xl transition-all btn-tactile hover:scale-105 cursor-pointer"
            >
              <IconLogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl px-4 sm:px-8 py-8 sm:py-12 flex-1">

        <div className="bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] border border-stone-200/90 p-6 sm:p-10">
          {children}
        </div>
      </main>

      <footer className="w-full border-t border-stone-200 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500 font-medium">
          <p>Cavite State University – Imus Campus • Quiz Hero AI Assessment Suite</p>
          <p className="font-mono text-[11px] text-stone-400">Powered by Gemini 3.6 Flash</p>
        </div>
      </footer>

      <AIChatbot currentUser={user} />
    </div>
  );
}

