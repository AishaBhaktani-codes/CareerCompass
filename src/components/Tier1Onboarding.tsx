"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { BookOpen, HelpCircle, RefreshCw, Sliders, CheckCircle } from "lucide-react";

export default function Tier1Onboarding() {
  const { tier1Data, setTier1Data, recalculatePathway } = useApp();

  const handleMarkChange = (subject: keyof typeof tier1Data.marks, val: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setTier1Data((prev) => ({
      ...prev,
      marks: {
        ...prev.marks,
        [subject]: clamped,
      },
    }));
  };

  const handleInterestChange = (interest: keyof typeof tier1Data.interests, val: number) => {
    setTier1Data((prev) => ({
      ...prev,
      interests: {
        ...prev.interests,
        [interest]: val,
      },
    }));
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-5 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
            Lifecycle Intake · Tier 1
          </span>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Class 10 Academic Marks & Interest Survey
          </h3>
        </div>
        <button
          onClick={recalculatePathway}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Recompute Stream Fit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Marks Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Standardized Subject Scores (out of 100)
          </h4>

          <div className="space-y-3">
            {[
              { key: "mathematics", label: "Mathematics (Algebra, Geometry, Trig)", val: tier1Data.marks.mathematics },
              { key: "science", label: "Science (Physics, Chemistry, Biology)", val: tier1Data.marks.science },
              { key: "english", label: "English & Communication", val: tier1Data.marks.english },
              { key: "socialScience", label: "Social Science (History, Civics, Geo)", val: tier1Data.marks.socialScience },
              { key: "computerScience", label: "Computer / Information Tech (Optional)", val: tier1Data.marks.computerScience },
            ].map((sub) => (
              <div key={sub.key} className="flex items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-xs text-slate-300 font-medium">{sub.label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={sub.val}
                    onChange={(e) => handleMarkChange(sub.key as any, parseInt(e.target.value))}
                    className="w-24 sm:w-32 accent-cyan-400 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={sub.val}
                    onChange={(e) => handleMarkChange(sub.key as any, parseInt(e.target.value))}
                    className="w-14 px-2 py-1 text-center font-bold text-xs bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interest Survey Sliders */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-violet-400" /> Aptitude & Curiosity Vector (0 - 100)
          </h4>

          <div className="space-y-3">
            {[
              { key: "problemSolving", label: "Abstract Logic & Quantitative Problem Solving", val: tier1Data.interests.problemSolving },
              { key: "spatialHandsOn", label: "Spatial Reasoning, Mechanics & Building", val: tier1Data.interests.spatialHandsOn },
              { key: "biologyNature", label: "Living Systems, Medicine & Life Sciences", val: tier1Data.interests.biologyNature },
              { key: "businessFinance", label: "Markets, Economics, Finance & Commerce", val: tier1Data.interests.businessFinance },
              { key: "creativeLinguistic", label: "Creative Arts, Journalism & Expression", val: tier1Data.interests.creativeLinguistic },
              { key: "socialPublicPolicy", label: "Law, Governance, Ethics & Public Policy", val: tier1Data.interests.socialPublicPolicy },
            ].map((item) => (
              <div key={item.key} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-bold text-violet-300">{item.val}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={item.val}
                  onChange={(e) => handleInterestChange(item.key as any, parseInt(e.target.value))}
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
