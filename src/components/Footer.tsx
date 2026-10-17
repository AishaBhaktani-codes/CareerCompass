import React from "react";
import Link from "next/link";
import { Compass, Sparkles, Activity, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 w-full py-10 border-t border-slate-800/80 flex flex-col items-center gap-6 px-6 mt-20 mb-20 md:mb-0">
      <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
        <Link href="/upload" className="hover:text-cyan-400 transition-colors">
          Diagnostic Profiler
        </Link>
        <span>·</span>
        <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
          Career Probability Engine
        </Link>
        <span>·</span>
        <Link href="/assessments" className="hover:text-cyan-400 transition-colors">
          4-Level Assessment Lab
        </Link>
        <span>·</span>
        <Link href="/roadmap" className="hover:text-cyan-400 transition-colors">
          Adaptive Remediation
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-500/10 text-cyan-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-extrabold">CareerCompass</span>
          <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono">
            Powered by GapGraph Architecture
          </span>
        </div>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="text-slate-400">
          Adaptive Student Strength Analysis and Career Pathway Intelligence Platform
        </span>
      </div>
    </footer>
  );
}
