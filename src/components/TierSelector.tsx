"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { EducationTier } from "@/lib/types";
import { DEMO_PRESETS } from "@/lib/careerEngine";
import { Compass, GraduationCap, Briefcase, Sparkles, UserCheck } from "lucide-react";

export default function TierSelector() {
  const { currentTier, setCurrentTier, loadPreset, activePresetName } = useApp();

  const tiers: Array<{
    id: EducationTier;
    title: string;
    stage: string;
    focus: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: "tier1",
      stage: "Tier 1",
      title: "Class 10 Stream Selection",
      focus: "Subject marks & Interest survey → PCM / PCB / Commerce / Arts",
      icon: <Compass className="w-5 h-5" />,
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
    },
    {
      id: "tier2",
      stage: "Tier 2",
      title: "Class 12 Entrance & Degree Routing",
      focus: "Academic marks & Competitive Ranks (JEE / NEET / CUET / CLAT)",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400",
    },
    {
      id: "tier3",
      stage: "Tier 3",
      title: "Graduation & Higher Ed Job Readiness",
      focus: "Domain specializations & Live GitHub Artifact / Repo Scoring",
      icon: <Briefcase className="w-5 h-5" />,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
  ];

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Educational Lifecycle Tier Navigator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select student lifecycle stage or load instant pre-computed demo personas
          </p>
        </div>

        {/* Preset Quick-Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Demo Personas:
          </span>
          <button
            onClick={() => loadPreset("tier1_stem")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activePresetName?.includes("Class 10")
                ? "bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
            }`}
          >
            Aarav (Class 10)
          </button>
          <button
            onClick={() => loadPreset("tier2_jee")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activePresetName?.includes("Class 12")
                ? "bg-violet-500 text-white font-bold shadow-lg shadow-violet-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
            }`}
          >
            Diya (Class 12 JEE)
          </button>
          <button
            onClick={() => loadPreset("tier3_dev")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activePresetName?.includes("B.Tech")
                ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
            }`}
          >
            Vikram (College Dev)
          </button>
        </div>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tiers.map((t) => {
          const isActive = currentTier === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setCurrentTier(t.id)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                isActive
                  ? `bg-gradient-to-br ${t.color} border-current shadow-lg ring-1 ring-current/40`
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isActive ? "bg-white/10 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {t.stage}
                </span>
                <div className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}>
                  {t.icon}
                </div>
              </div>

              <div>
                <h4 className={`text-sm font-bold tracking-tight mb-1 ${isActive ? "text-white" : "text-slate-200"}`}>
                  {t.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {t.focus}
                </p>
              </div>

              {isActive && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/90 font-medium">
                  <span>Active Workflow</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
