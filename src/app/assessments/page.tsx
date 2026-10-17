"use client";

import React from "react";
import TierSelector from "@/components/TierSelector";
import AssessmentFramework from "@/components/AssessmentFramework";
import { Activity, ShieldCheck, Target, Award } from "lucide-react";

export default function AssessmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Evaluation & Cognitive Testing
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Multi-Level Assessment Laboratory
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate and interact with all 4 assessment levels: Adaptive CAT (Item Response Theory),
            Scaffolded Formative Drills, Timed Summative Mock, and Authentic Artifact Scoring.
          </p>
        </div>
      </div>

      {/* Tier Selector */}
      <TierSelector />

      {/* Assessment Framework Interactive Component */}
      <AssessmentFramework />

      {/* Contextual Architecture Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-xs text-slate-300">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1.5">
            <Target className="w-4 h-4" /> Item Response Theory (IRT)
          </span>
          Questions adapt in real-time. Answering correctly boosts the latent ability parameter θ and
          draws from higher discrimination item clusters.
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-xs text-slate-300">
          <span className="font-bold text-violet-300 flex items-center gap-1.5 mb-1.5">
            <ShieldCheck className="w-4 h-4" /> Cognitive Scaffolding
          </span>
          Formative mode provides progressive hints to reduce cognitive load and build conceptual
          mastery before summative evaluation.
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-xs text-slate-300">
          <span className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1.5">
            <Award className="w-4 h-4" /> Artifact AST Scorer
          </span>
          Evaluates actual code contributions, multi-stage Dockerfiles, test suite coverage, and
          architectural modularity.
        </div>
      </div>
    </div>
  );
}
