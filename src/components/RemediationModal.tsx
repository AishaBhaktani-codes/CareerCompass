"use client";

import React, { useState } from "react";
import { RemediationPath, RemediationModule } from "@/lib/types";
import {
  X,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
} from "lucide-react";

interface RemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  remediationPlan: RemediationPath | null;
  completedModules: Set<number | string>;
  onToggleModule: (id: number | string) => void;
}

export default function RemediationModal({
  isOpen,
  onClose,
  remediationPlan,
  completedModules,
  onToggleModule,
}: RemediationModalProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | number | null>("mod-1");
  const [quizAnswers, setQuizAnswers] = useState<Record<string | number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string | number, boolean>>({});

  if (!isOpen || !remediationPlan) return null;

  const handleAnswerQuiz = (modId: string | number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [modId]: optionIndex }));
  };

  const handleSubmitQuiz = (modId: string | number) => {
    setQuizSubmitted((prev) => ({ ...prev, [modId]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-start bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Adaptive AI Remediation Path
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Calibrated Micro-Course Pathway for Target:{" "}
              <strong className="text-cyan-300">{remediationPlan.careerTitle}</strong> (
              {remediationPlan.overallTargetHours} hrs total estimated)
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {remediationPlan.phases.map((phase) => (
            <div key={phase.phaseNumber} className="space-y-3">
              {/* Phase Header */}
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                  {phase.phaseNumber}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    {phase.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">{phase.description}</p>
                </div>
              </div>

              {/* Modules in Phase */}
              <div className="space-y-3 pl-3 border-l-2 border-slate-800 ml-3">
                {phase.modules.map((mod: RemediationModule) => {
                  const isExpanded = expandedModuleId === mod.id;
                  const isCompleted = completedModules.has(mod.id);
                  const selectedOpt = quizAnswers[mod.id];
                  const isQuizDone = quizSubmitted[mod.id];

                  return (
                    <div
                      key={mod.id}
                      className={`rounded-xl border transition-all ${
                        isCompleted
                          ? "bg-emerald-950/20 border-emerald-500/30"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {/* Module Header Bar */}
                      <div
                        onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleModule(mod.id);
                            }}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                              isCompleted
                                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30"
                                : "border border-slate-700 bg-slate-900 text-slate-500 hover:border-cyan-400"
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-xs font-bold ${
                                  isCompleted ? "text-emerald-300 line-through" : "text-white"
                                }`}
                              >
                                {mod.title}
                              </h4>
                              <span
                                className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded ${
                                  mod.priority === "critical"
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {mod.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-cyan-400" /> {mod.hours} hrs
                              </span>
                              <span>·</span>
                              <span className="capitalize">{mod.difficulty} level</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-4 text-xs">
                          <p className="text-slate-300 leading-relaxed">{mod.description}</p>

                          {/* Covered Skills */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                              Competencies Covered:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {mod.skillsCovered.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 text-[11px] border border-slate-800"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Curated Resources */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                              Curated Learning Artifacts:
                            </span>
                            <div className="space-y-1.5">
                              {mod.resources.map((res, idx) => (
                                <a
                                  key={idx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all group"
                                >
                                  <div className="flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium text-xs">{res.title}</span>
                                    <span className="text-[10px] text-slate-500">({res.source})</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-mono">{res.duration}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Checkpoint Quiz */}
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                                <Zap className="w-3.5 h-3.5 text-amber-400" /> Micro-Checkpoint Challenge
                              </span>
                              <span className="text-[10px] text-slate-400">Validate Mastery</span>
                            </div>

                            <p className="text-slate-200 font-medium">{mod.quiz.question}</p>

                            <div className="space-y-1.5">
                              {mod.quiz.options.map((opt, oIdx) => {
                                let style = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
                                if (isQuizDone) {
                                  if (oIdx === mod.quiz.correct) {
                                    style = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                                  } else if (selectedOpt === oIdx) {
                                    style = "bg-rose-500/20 border-rose-500 text-rose-300";
                                  }
                                } else if (selectedOpt === oIdx) {
                                  style = "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold";
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={isQuizDone}
                                    onClick={() => handleAnswerQuiz(mod.id, oIdx)}
                                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${style}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {!isQuizDone ? (
                              <button
                                disabled={selectedOpt === undefined}
                                onClick={() => {
                                  handleSubmitQuiz(mod.id);
                                  if (selectedOpt === mod.quiz.correct) {
                                    onToggleModule(mod.id);
                                  }
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all"
                              >
                                Submit Checkpoint
                              </button>
                            ) : (
                              <div className="text-[11px] p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                                <span
                                  className={`font-bold block mb-1 ${
                                    selectedOpt === mod.quiz.correct
                                      ? "text-emerald-400"
                                      : "text-amber-400"
                                  }`}
                                >
                                  {selectedOpt === mod.quiz.correct
                                    ? "✓ Checkpoint Passed!"
                                    : "Review Concept Explanation:"}
                                </span>
                                {mod.quiz.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Completed Modules:{" "}
              <strong className="text-emerald-400">{completedModules.size}</strong> of{" "}
              {remediationPlan.phases.reduce((sum, p) => sum + p.modules.length, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
          >
            Close Pathway
          </button>
        </div>
      </div>
    </div>
  );
}
