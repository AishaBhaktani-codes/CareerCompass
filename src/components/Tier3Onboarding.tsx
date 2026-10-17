"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { DomainCategory } from "@/lib/types";
import { evaluateGitHubArtifact } from "@/lib/careerEngine";
import {
  Briefcase,
  GitBranch,
  Search,
  CheckCircle,
  AlertCircle,
  Layers,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function Tier3Onboarding() {
  const { tier3Data, setTier3Data, recalculatePathway } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [artifactResult, setArtifactResult] = useState(() =>
    evaluateGitHubArtifact(tier3Data.githubRepoUrl)
  );

  const domains: DomainCategory[] = [
    "Software & Full-Stack",
    "Cloud Architecture & DevOps",
    "AI & Machine Learning",
    "Fintech & Quantitative Finance",
    "Product Management & UI/UX",
    "Corporate Law & Compliance",
  ];

  const handleScanRepo = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = evaluateGitHubArtifact(tier3Data.githubRepoUrl);
      setArtifactResult(res);
      setIsScanning(false);
      recalculatePathway();
    }, 600);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-5 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
            Lifecycle Intake · Tier 3
          </span>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
            <Briefcase className="w-5 h-5 text-emerald-400" /> Graduation Domain & Authentic Artifact Scoring
          </h3>
        </div>
        <button
          onClick={recalculatePathway}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Recompute Job Readiness
        </button>
      </div>

      {/* Domain Selection */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Specialization Domain:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => {
                setTier3Data((prev) => ({ ...prev, domain: d }));
              }}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                tier3Data.domain === d
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm shadow-emerald-500/20"
                  : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Details & Repo Link */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Undergrad Major</label>
              <input
                type="text"
                value={tier3Data.degreeMajor}
                onChange={(e) => setTier3Data((prev) => ({ ...prev, degreeMajor: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Cumulative CGPA (/10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={tier3Data.cgpa}
                onChange={(e) => setTier3Data((prev) => ({ ...prev, cgpa: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              Public GitHub Repository / Capstone Artifact URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={tier3Data.githubRepoUrl}
                onChange={(e) =>
                  setTier3Data((prev) => ({ ...prev, githubRepoUrl: e.target.value }))
                }
                placeholder="https://github.com/user/production-project"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 font-mono"
              />
              <button
                onClick={handleScanRepo}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
              >
                {isScanning ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                Scan
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            * Automated AST parsing analyzes package dependencies, modularity, test suites, and commit cadences.
          </div>
        </div>

        {/* Live Artifact Scorer Card */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authentic Artifact Audit
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              {artifactResult.architectureComplexity}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Code Rigor</span>
              <span className="text-sm font-extrabold text-emerald-400">
                {artifactResult.codeQualityScore}/100
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Test Coverage</span>
              <span className="text-sm font-extrabold text-cyan-400">
                {artifactResult.testCoverageEstimate}%
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Commits</span>
              <span className="text-sm font-extrabold text-violet-400">
                {artifactResult.totalCommits}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Detected Stack:
            </span>
            <div className="flex flex-wrap gap-1">
              {artifactResult.detectedTechStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="text-emerald-400 flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{artifactResult.verifiedStrengths[0]}</span>
            </div>
            <div className="text-amber-400 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{artifactResult.flaggedGaps[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
