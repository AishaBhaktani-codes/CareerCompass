"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/context";
import {
  Compass,
  BarChart3,
  Route,
  Activity,
  User,
  Sparkles,
  Layers,
} from "lucide-react";

const navItems = [
  { label: "Intake & Profiler", href: "/upload", icon: Compass },
  { label: "Career Probability & Gaps", href: "/dashboard", icon: BarChart3 },
  { label: "Adaptive Roadmap", href: "/roadmap", icon: Route },
  { label: "Assessment Lab", href: "/assessments", icon: Activity },
];

export default function Navbar() {
  const pathname = usePathname();
  const { overallProgress, isLoggedIn, currentTier, userProfile } = useApp();

  const tierBadge =
    currentTier === "tier1"
      ? { text: "Tier 1: Class 10", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" }
      : currentTier === "tier2"
      ? { text: "Tier 2: Class 12", color: "bg-violet-500/20 text-violet-300 border-violet-500/30" }
      : { text: "Tier 3: Higher Ed", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-slate-950/85 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex justify-between items-center w-full px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                CareerCompass
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                GapGraph AI
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 ml-4 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/upload" && pathname === "/") ||
                (item.href === "/roadmap" && pathname.startsWith("/module"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-800 text-cyan-300 shadow-sm border border-slate-700 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side status badge and profile */}
        <div className="flex items-center gap-3">
          {/* Tier indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${tierBadge.color}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {tierBadge.text}
          </div>

          {/* Overall Readiness Score pill */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              Progress: <strong className="text-white">{overallProgress}%</strong>
            </span>
          </div>

          {/* User Profile */}
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30 hover:scale-105 transition-transform"
            title={userProfile?.name || "Student Profile"}
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/upload" && pathname === "/") ||
            (item.href === "/roadmap" && pathname.startsWith("/module"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? "text-cyan-300 bg-cyan-500/10 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
