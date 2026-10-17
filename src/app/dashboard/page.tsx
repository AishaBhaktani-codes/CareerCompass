"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/context";
import { CareerMatch, SkillGapItem } from "@/lib/types";
import TierSelector from "@/components/TierSelector";
import CareerProbabilityChart from "@/components/CareerProbabilityChart";
import RemediationModal from "@/components/RemediationModal";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Compass,
  Award,
  ChevronRight,
  FileText,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const {
    currentTier,
    careerMatches,
    selectedCareerMatch,
    setSelectedCareerMatch,
    remediationPlan,
    generateRemediationForCareer,
    completedModules,
    toggleModule,
    overallProgress,
    userProfile,
    tier1Data,
    tier2Data,
    tier3Data,
    assessmentProgress,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Active chosen career for inspection (default to top career match)
  const activeCareer: CareerMatch | undefined =
    selectedCareerMatch || careerMatches[0];

  const topMatch = careerMatches[0];
  const targetReadiness = activeCareer?.rawFitScore || 78;

  // Animate readiness gauge
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame += 2;
      if (frame >= targetReadiness) {
        setAnimatedScore(targetReadiness);
        clearInterval(interval);
      } else {
        setAnimatedScore(frame);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [targetReadiness]);

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (animatedScore / 100) * circumference;

  const handleOpenRemediation = (career?: CareerMatch) => {
    const target = career || activeCareer;
    if (target) {
      generateRemediationForCareer(target);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-32">
      {/* Tier Selector & Preset Bar */}
      <TierSelector />

      {/* Top Intelligence Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Profile & Target Overview */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Pathway Intelligence Engine
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {currentTier === "tier1"
                  ? "Class 10 Stream Selection"
                  : currentTier === "tier2"
                  ? "Class 12 Degree Routing"
                  : "Graduation Job Readiness"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {userProfile?.name || "Student Intelligence Portfolio"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {userProfile?.role ||
                "Analyzing academic transcripts, competitive percentiles, interest vectors & code artifacts."}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Top Career Match</span>
              <span className="text-xs font-bold text-cyan-300 line-clamp-1">
                {topMatch?.title || "Computing & Engineering"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Probability P(C₁)</span>
              <span className="text-sm font-extrabold text-emerald-400">
                {topMatch?.probability ? `${topMatch.probability}%` : "38.5%"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Cutoff Viability</span>
              <span className="text-xs font-bold text-amber-300">
                {topMatch?.cutoffStatus || "Safe Range"}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Composite Readiness Meter */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Calibrated Readiness Fit
          </span>

          <div className="relative w-28 h-28 flex items-center justify-center mb-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1E293B"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#readinessGrad)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{animatedScore}%</span>
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Match Score</span>
            </div>
          </div>

          <span className="text-xs text-slate-300 font-medium mt-1">
            {animatedScore >= 80 ? "Exceptional Alignment" : animatedScore >= 60 ? "Strong Competitive Fit" : "Bridging Required"}
          </span>
        </div>

        {/* Remediation Action Card */}
        <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-1">
              <Zap className="w-4 h-4 text-amber-400" /> Adaptive Learning Path
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Bridge {activeCareer?.skillGaps.length || 3} Core Knowledge Gaps
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Targeted micro-course outline synthesized from prerequisite concept graphs.
            </p>
          </div>

          <button
            onClick={() => handleOpenRemediation()}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4" /> Generate Adaptive AI Path
          </button>
        </div>
      </div>

      {/* Main Grid: Recharts Probability Engine & Knowledge Gap Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: Recharts Horizontal Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CareerProbabilityChart
            careerMatches={careerMatches}
            selectedId={activeCareer?.id}
            onSelectCareer={(career) => setSelectedCareerMatch(career)}
          />

          {/* Detailed Selected Career Spotlight Card */}
          {activeCareer && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Inspected Pathway Blueprint
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    {activeCareer.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    P = {activeCareer.probability}%
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-800 text-slate-300">
                    {activeCareer.salaryRange}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeCareer.rationale}
              </p>

              {/* Degree / Career Routes */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Degree & University Specialization Routes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCareer.degreeOrRoleRoutes.map((route, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium"
                    >
                      {route}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Strengths */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Primary Profile Strength Drivers:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeCareer.keyStrengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Knowledge Gaps & Remediation Trigger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    Knowledge Gap Analysis
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Prerequisites for {activeCareer?.title.split("(")[0]}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                {activeCareer?.skillGaps.length || 0} Gaps Flagged
              </span>
            </div>

            {/* Missing Prerequisite Skills List */}
            <div className="space-y-3 mb-5">
              {activeCareer?.skillGaps.map((gap: SkillGapItem, idx: number) => {
                const priorityBadge =
                  gap.priority === "critical"
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    : gap.priority === "medium"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-200">{gap.name}</span>
                      <span
                        className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${priorityBadge}`}
                      >
                        {gap.priority}
                      </span>
                    </div>

                    {/* Progress Bar: Current vs Required Level */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${gap.currentLevel}%` }}
                        />
                        <div
                          className="absolute top-0 bottom-0 border-r-2 border-dashed border-rose-400"
                          style={{ left: `${gap.requiredLevel}%` }}
                          title={`Required: ${gap.requiredLevel}%`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Current: {gap.currentLevel}%</span>
                        <span className="text-slate-300 font-semibold">
                          Target: {gap.requiredLevel}%
                        </span>
                        <span>~{gap.estimatedHours} hrs</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Remediation Path Trigger Button */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => handleOpenRemediation()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                Generate Adaptive AI Remediation Path
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                Creates a personalized 3-phase micro-course with verified video labs & checkpoint challenges
              </p>
            </div>
          </div>

          {/* Assessment Progress Snapshot */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Assessment Status
              </span>
              <button
                onClick={() => router.push("/assessments")}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5"
              >
                Launch Lab →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">L1: CAT Latent θ</span>
                <span className="font-extrabold text-cyan-400 text-sm">
                  +{assessmentProgress.catAbilityTheta}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">L2: Formative Drills</span>
                <span className="font-extrabold text-violet-400 text-sm">
                  {assessmentProgress.formativeCompleted} Passed
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">L3: Mock Score</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {assessmentProgress.mockExamScore} / 200
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">L4: Artifact AST</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  {assessmentProgress.artifactScore} / 100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive AI Remediation Modal */}
      <RemediationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        remediationPlan={remediationPlan}
        completedModules={completedModules}
        onToggleModule={toggleModule}
      />
    </div>
  );
}
