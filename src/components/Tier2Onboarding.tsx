"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { Stream12 } from "@/lib/types";
import { GraduationCap, Award, RefreshCw, CheckCircle2 } from "lucide-react";

export default function Tier2Onboarding() {
  const { tier2Data, setTier2Data, recalculatePathway } = useApp();

  const streams: Stream12[] = ["Science PCM", "Science PCB", "Commerce", "Humanities/Arts"];

  const handleStreamSelect = (stream: Stream12) => {
    setTier2Data((prev) => ({ ...prev, stream }));
  };

  const handleExamChange = (field: keyof typeof tier2Data.competitiveExams, val: number) => {
    setTier2Data((prev) => ({
      ...prev,
      competitiveExams: {
        ...prev.competitiveExams,
        [field]: isNaN(val) ? undefined : val,
      },
    }));
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-5 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-violet-400 uppercase tracking-widest">
            Lifecycle Intake · Tier 2
          </span>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
            <GraduationCap className="w-5 h-5 text-violet-400" /> Class 12 Academic Transcripts & Entrance Cutoffs
          </h3>
        </div>
        <button
          onClick={recalculatePathway}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-md shadow-violet-600/20"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-evaluate Cutoffs & Degrees
        </button>
      </div>

      {/* Stream Selector Pills */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Current Enrolled Stream:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {streams.map((s) => (
            <button
              key={s}
              onClick={() => handleStreamSelect(s)}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                tier2Data.stream === s
                  ? "bg-violet-500/20 text-violet-300 border-violet-500 shadow-sm shadow-violet-500/20"
                  : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Marks */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" /> Board Examination Scores
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Class 12 Overall Aggregate (%):</span>
                <span className="text-white font-bold">{tier2Data.marks.aggregate}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={tier2Data.marks.aggregate}
                onChange={(e) =>
                  setTier2Data((prev) => ({
                    ...prev,
                    marks: { ...prev.marks, aggregate: parseFloat(e.target.value) },
                  }))
                }
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px]">{tier2Data.marks.subject1.name}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tier2Data.marks.subject1.score}
                  onChange={(e) =>
                    setTier2Data((prev) => ({
                      ...prev,
                      marks: {
                        ...prev.marks,
                        subject1: { ...prev.marks.subject1, score: parseInt(e.target.value) || 0 },
                      },
                    }))
                  }
                  className="w-full mt-1 bg-slate-950 px-2 py-1 rounded text-white font-bold border border-slate-700"
                />
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px]">{tier2Data.marks.subject3.name}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tier2Data.marks.subject3.score}
                  onChange={(e) =>
                    setTier2Data((prev) => ({
                      ...prev,
                      marks: {
                        ...prev.marks,
                        subject3: { ...prev.marks.subject3, score: parseInt(e.target.value) || 0 },
                      },
                    }))
                  }
                  className="w-full mt-1 bg-slate-950 px-2 py-1 rounded text-white font-bold border border-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Exam Scores */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-cyan-400" /> Competitive Mock Ranks & Percentiles
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-medium">JEE Main Percentile:</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 96.4"
                value={tier2Data.competitiveExams.jeeMainPercentile ?? ""}
                onChange={(e) => handleExamChange("jeeMainPercentile", parseFloat(e.target.value))}
                className="w-24 px-2 py-1 bg-slate-900 text-cyan-300 font-bold border border-slate-700 rounded-lg text-center"
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-medium">NEET UG Score (/720):</span>
              <input
                type="number"
                min="0"
                max="720"
                placeholder="e.g. 580"
                value={tier2Data.competitiveExams.neetScore ?? ""}
                onChange={(e) => handleExamChange("neetScore", parseInt(e.target.value))}
                className="w-24 px-2 py-1 bg-slate-900 text-cyan-300 font-bold border border-slate-700 rounded-lg text-center"
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-medium">CUET Domain Percentile:</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 94.2"
                value={tier2Data.competitiveExams.cuetPercentile ?? ""}
                onChange={(e) => handleExamChange("cuetPercentile", parseFloat(e.target.value))}
                className="w-24 px-2 py-1 bg-slate-900 text-cyan-300 font-bold border border-slate-700 rounded-lg text-center"
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-medium">CLAT AIR Rank:</span>
              <input
                type="number"
                min="1"
                placeholder="e.g. 1450"
                value={tier2Data.competitiveExams.clatRank ?? ""}
                onChange={(e) => handleExamChange("clatRank", parseInt(e.target.value))}
                className="w-24 px-2 py-1 bg-slate-900 text-cyan-300 font-bold border border-slate-700 rounded-lg text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
