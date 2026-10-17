"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { modules as staticModules } from "@/lib/data";
import { useApp } from "@/lib/context";
import { useToast } from "@/components/Toast";
import TierSelector from "@/components/TierSelector";
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Clock,
  PlayCircle,
  ExternalLink,
  Zap,
  Award,
} from "lucide-react";

const priorityColors: Record<string, { bg: string; text: string; label: string; border: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-400", label: "Critical", border: "border-red-400" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Medium", border: "border-amber-400" },
  low: { bg: "bg-emerald-400/10", text: "text-emerald-400", label: "Optional", border: "border-emerald-400" },
};

export default function RoadmapPage() {
  const router = useRouter();
  const {
    completedModules,
    overallProgress,
    toggleModule,
    analysisResult,
    remediationPlan,
    selectedCareerMatch,
  } = useApp();
  const { showToast } = useToast();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Active Remediation plan from AI Engine
  const hasRemediation = !!remediationPlan;

  const rawModules = hasRemediation
    ? remediationPlan.phases.flatMap((p) => p.modules)
    : staticModules;

  const targetTitle = remediationPlan?.careerTitle || selectedCareerMatch?.title || "Full-Stack Software Engineer";
  const totalHours = remediationPlan?.overallTargetHours || 45;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-32"
    >
      {/* Tier Selector */}
      <TierSelector />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Adaptive AI Remediation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Targeting: <strong className="text-cyan-300">{targetTitle}</strong> · Precision calibrated
            to eliminate knowledge gaps.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 transition-all text-xs border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <button
            onClick={() => showToast("Regenerating adaptive pathway...")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-calibrate
          </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Roadmap Progress
            </span>
            <span className="text-2xl font-black text-cyan-400 font-mono">{overallProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {completedModules.size} of {rawModules.length} micro-modules mastered
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Study Hours
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalHours}</span>
            <span className="text-xs text-slate-400">hours estimated completion</span>
          </div>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> High-yield concept sequencing
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Artifact & Capstone Target
          </span>
          <span className="text-sm font-bold text-white line-clamp-1">
            Production-grade Capstone Submission
          </span>
          <p className="text-xs text-slate-400">
            Assessed with Level 4 Authentic Artifact Rubric
          </p>
        </div>
      </div>

      {/* Embedded YouTube Player */}
      <AnimatePresence mode="wait">
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl relative pt-[56.25%] border border-slate-700">
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/70 hover:bg-black rounded-full text-white text-xs backdrop-blur-md transition-colors border border-white/20"
              >
                Close Video ✕
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="Learning Resource"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap Phase Timeline */}
      <div className="space-y-12">
        {(remediationPlan?.phases || [
          { phaseNumber: 1, title: "Phase 1: Foundations", description: "Core prerequisite building blocks", modules: rawModules.slice(0, 2) },
          { phaseNumber: 2, title: "Phase 2: Core Engineering", description: "Intermediate architectures & workflows", modules: rawModules.slice(2, 4) },
          { phaseNumber: 3, title: "Phase 3: Applied Capstone", description: "Portfolio & system synthesis", modules: rawModules.slice(4) },
        ]).map((phase) => (
          <section key={phase.phaseNumber}>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-sm flex items-center justify-center border border-cyan-500/40">
                0{phase.phaseNumber}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{phase.title}</h2>
                <p className="text-xs text-slate-400">{phase.description}</p>
              </div>
              <div className="h-[1px] flex-1 bg-slate-800 ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phase.modules.map((mod: any) => {
                const isDone = completedModules.has(mod.id);
                const p = priorityColors[mod.priority] || priorityColors.medium;

                return (
                  <div
                    key={mod.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      isDone
                        ? "bg-slate-950/40 border-emerald-500/30 opacity-75"
                        : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${p.bg} ${p.text} ${p.border}`}
                        >
                          {mod.priority || "Medium"}
                        </span>

                        <button
                          onClick={() => toggleModule(mod.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isDone
                              ? "bg-emerald-500 text-slate-950 font-bold"
                              : "border border-slate-700 bg-slate-950 text-slate-500 hover:border-cyan-400"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4
                        className={`font-bold text-sm mb-1 ${
                          isDone ? "text-slate-400 line-through" : "text-white"
                        }`}
                      >
                        {mod.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{mod.hours} hrs</span>
                        <span>·</span>
                        <span className="capitalize">{mod.difficulty || "core"}</span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {mod.description}
                      </p>
                    </div>

                    {/* Resources */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                      {mod.resources &&
                        mod.resources.slice(0, 2).map((res: any, rIdx: number) => {
                          const vId =
                            res.videoId ||
                            (res.url && res.url.includes("youtube.com")
                              ? new URL(res.url).searchParams.get("v")
                              : null);
                          return (
                            <button
                              key={rIdx}
                              onClick={() => {
                                if (vId) {
                                  setActiveVideoId(vId);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                } else {
                                  window.open(res.url, "_blank");
                                }
                              }}
                              className="w-full py-1.5 px-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center justify-between transition-colors border border-slate-800"
                            >
                              <span className="truncate pr-2">{res.title}</span>
                              <PlayCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            </button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
}
