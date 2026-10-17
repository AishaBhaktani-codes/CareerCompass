"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import TierSelector from "@/components/TierSelector";
import Tier1Onboarding from "@/components/Tier1Onboarding";
import Tier2Onboarding from "@/components/Tier2Onboarding";
import Tier3Onboarding from "@/components/Tier3Onboarding";
import {
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck,
  Compass,
  CheckCircle2,
} from "lucide-react";

export default function IntakePage() {
  const router = useRouter();
  const { currentTier, recalculatePathway } = useApp();
  const [uploadedResume, setUploadedResume] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLaunchAnalysis = () => {
    setIsProcessing(true);
    recalculatePathway();
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedResume(file.name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-32">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
            <Compass className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Diagnostic Intake & Student Profiling
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Adaptive Career Compass Profiler
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Ingest multi-tier academic signals, aptitude surveys, mock competitive ranks, or repository
          artifacts to calibrate personalized career probabilities.
        </p>
      </div>

      {/* Tier Navigator */}
      <TierSelector />

      {/* Dynamic Intake Form based on active tier */}
      {currentTier === "tier1" && <Tier1Onboarding />}
      {currentTier === "tier2" && <Tier2Onboarding />}
      {currentTier === "tier3" && <Tier3Onboarding />}

      {/* Optional Academic Transcript / Resume Ingestion Box */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-slate-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Optional: Ingest Supplementary Transcript / Resume Document (PDF / DOCX)
            </h4>
          </div>
          {uploadedResume && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <FileCheck className="w-3.5 h-3.5" /> {uploadedResume}
            </span>
          )}
        </div>

        <label className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-950/40 transition-all text-center">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <UploadCloud className="w-6 h-6 text-slate-500 mb-1" />
          <span className="text-xs text-slate-300 font-medium">
            Drag & drop or browse file to enrich skill graph
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Supported: Academic Marksheets, Competitive Scorecards, Technical Resumes
          </span>
        </label>
      </div>

      {/* Final Compute & Launch Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Ready to Compute Calibrated Career Pathways
            </h3>
            <p className="text-xs text-slate-400">
              Probabilistic softmax match engine P(Career_i) and prerequisite gap mapping.
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunchAnalysis}
          disabled={isProcessing}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:opacity-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
        >
          {isProcessing ? (
            "Computing Probabilities..."
          ) : (
            <>
              Compute Strength Analysis & Pathways
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
