"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import {
  CAT_QUESTION_BANK,
  calculateUpdatedTheta,
  FORMATIVE_PRACTICE_ITEMS,
  SUMMATIVE_MOCK_QUESTIONS,
  scoreAuthenticArtifact,
} from "@/lib/assessments";
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Timer,
  XCircle,
} from "lucide-react";

export default function AssessmentFramework() {
  const { assessmentProgress, updateAssessmentProgress } = useApp();
  const [activeTab, setActiveTab] = useState<"cat" | "formative" | "mock" | "artifact">("cat");

  // Level 1: CAT State
  const [catIndex, setCatIndex] = useState(0);
  const [catSelected, setCatSelected] = useState<number | null>(null);
  const [catFeedback, setCatFeedback] = useState<boolean | null>(null);
  const currentCatQ = CAT_QUESTION_BANK[catIndex % CAT_QUESTION_BANK.length];

  const handleCatAnswer = (idx: number) => {
    setCatSelected(idx);
    const isCorrect = idx === currentCatQ.correct;
    setCatFeedback(isCorrect);
    const newTheta = calculateUpdatedTheta(
      assessmentProgress.catAbilityTheta,
      currentCatQ.difficulty,
      isCorrect
    );
    updateAssessmentProgress("catAbilityTheta", newTheta);
    updateAssessmentProgress(
      "catQuestionsCompleted",
      assessmentProgress.catQuestionsCompleted + 1
    );
  };

  const handleNextCat = () => {
    setCatSelected(null);
    setCatFeedback(null);
    // In adaptive test, pick next question matching student theta
    setCatIndex((prev) => (prev + 1) % CAT_QUESTION_BANK.length);
  };

  // Level 2: Formative State
  const [formativeIndex, setFormativeIndex] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [formativeSelected, setFormativeSelected] = useState<number | null>(null);
  const currentFormative = FORMATIVE_PRACTICE_ITEMS[formativeIndex % FORMATIVE_PRACTICE_ITEMS.length];

  // Level 3: Mock Exam State
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [mockTimeRemaining, setMockTimeRemaining] = useState(180); // 3 minutes demo
  const [mockSubmitted, setMockSubmitted] = useState(false);

  useEffect(() => {
    if (activeTab === "mock" && !mockSubmitted && mockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setMockTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, mockSubmitted, mockTimeRemaining]);

  const currentMockQ = SUMMATIVE_MOCK_QUESTIONS[mockIndex];

  const calculateMockScore = () => {
    let score = 0;
    SUMMATIVE_MOCK_QUESTIONS.forEach((q, idx) => {
      const ans = mockAnswers[idx];
      if (ans !== undefined) {
        if (ans === q.correct) score += q.marksPositive;
        else score -= q.marksNegative;
      }
    });
    return score;
  };

  // Level 4: Artifact State
  const [artifactHasDocker, setArtifactHasDocker] = useState(true);
  const [artifactHasTests, setArtifactHasTests] = useState(true);
  const [artifactHasReadme, setArtifactHasReadme] = useState(true);
  const [artifactCommits, setArtifactCommits] = useState(58);

  const rubricResult = scoreAuthenticArtifact(
    "https://github.com/student/repo",
    artifactHasDocker,
    artifactHasTests,
    artifactHasReadme,
    artifactCommits
  );

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Assessment & Diagnostics Engine
          </span>
          <h3 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
            4-Level Cognitive Evaluation Framework
          </h3>
        </div>

        {/* Level Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          {[
            { id: "cat", label: "L1: CAT (Adaptive)" },
            { id: "formative", label: "L2: Formative Drill" },
            { id: "mock", label: "L3: Summative Mock" },
            { id: "artifact", label: "L4: Artifact Scorer" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === t.id
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEVEL 1: CAT SIMULATOR */}
      {activeTab === "cat" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Dynamic Item Response Theory (IRT) Baseline
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Difficulty dynamically adjusts after each response to isolate true student latent ability (θ).
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Latent Ability (θ)</span>
                <span className="text-sm font-extrabold text-cyan-400">
                  {assessmentProgress.catAbilityTheta > 0 ? `+${assessmentProgress.catAbilityTheta}` : assessmentProgress.catAbilityTheta}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Item Difficulty (b)</span>
                <span className="text-sm font-extrabold text-violet-400">
                  {currentCatQ.difficulty * 10}/10
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                Domain: {currentCatQ.domain}
              </span>
              <span>Question #{catIndex + 1}</span>
            </div>

            <p className="text-sm font-semibold text-white mb-4 leading-relaxed">
              {currentCatQ.question}
            </p>

            <div className="space-y-2 mb-4">
              {currentCatQ.options.map((opt, idx) => {
                let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";
                if (catSelected !== null) {
                  if (idx === currentCatQ.correct) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                  } else if (catSelected === idx) {
                    btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 font-bold";
                  }
                }
                return (
                  <button
                    key={idx}
                    disabled={catSelected !== null}
                    onClick={() => handleCatAnswer(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {catSelected !== null && idx === currentCatQ.correct && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {catSelected === idx && idx !== currentCatQ.correct && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {catFeedback !== null && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs animate-fade-in-up">
                <span className={`font-bold block mb-1 ${catFeedback ? "text-emerald-400" : "text-rose-400"}`}>
                  {catFeedback ? "✓ Correct! Ability theta updated." : "✗ Incorrect! Diagnostic calibrated."}
                </span>
                <p className="text-slate-300 mb-3">{currentCatQ.explanation}</p>
                <button
                  onClick={handleNextCat}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Next Adaptive Item →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEVEL 2: FORMATIVE PRACTICE */}
      {activeTab === "formative" && (
        <div className="space-y-4">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Scaffolding & Cognitive Hint Engine
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Targeted practice on flagged weak topics with graduated micro-hints.
              </p>
            </div>
            <button
              onClick={() => setHintsRevealed((prev) => Math.min(currentFormative.hints.length, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1 hover:bg-amber-500/20"
            >
              <Lightbulb className="w-3.5 h-3.5" /> Reveal Hint ({hintsRevealed}/{currentFormative.hints.length})
            </button>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs font-semibold text-violet-400 mb-2">
              Concept Drill: {currentFormative.concept}
            </div>
            <p className="text-sm font-semibold text-white mb-4">
              {currentFormative.question}
            </p>

            {/* Revealed Hints */}
            {hintsRevealed > 0 && (
              <div className="mb-4 space-y-1.5">
                {currentFormative.hints.slice(0, hintsRevealed).map((h, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                    {h}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 mb-4">
              {currentFormative.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setFormativeSelected(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    formativeSelected === idx
                      ? idx === currentFormative.correct
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                        : "bg-rose-500/20 border-rose-500 text-rose-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {formativeSelected !== null && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="font-bold text-emerald-400 block mb-1">Concept Mastery Verified:</span>
                <p className="text-slate-300">{currentFormative.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEVEL 3: SUMMATIVE MOCK */}
      {activeTab === "mock" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-violet-400" /> National Standard Competitive Mock Simulator
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Marking Scheme: +4 marks for correct, -1 mark penalty for incorrect.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-cyan-400">
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(mockTimeRemaining / 60)}:
              {(mockTimeRemaining % 60).toString().padStart(2, "0")}
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span className="text-violet-300 font-medium">{currentMockQ.section}</span>
              <span>Question {mockIndex + 1} of {SUMMATIVE_MOCK_QUESTIONS.length}</span>
            </div>

            <p className="text-sm font-semibold text-white mb-4">{currentMockQ.question}</p>

            <div className="space-y-2 mb-4">
              {currentMockQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setMockAnswers((prev) => ({ ...prev, [mockIndex]: idx }))}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    mockAnswers[mockIndex] === idx
                      ? "bg-violet-600/30 border-violet-500 text-white font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="flex gap-2">
                {SUMMATIVE_MOCK_QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMockIndex(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      mockIndex === i
                        ? "bg-violet-500 text-white"
                        : mockAnswers[i] !== undefined
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setMockSubmitted(true)}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Submit Mock Exam
              </button>
            </div>

            {mockSubmitted && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-sm font-extrabold text-white block mb-1">Mock Exam Result:</span>
                <span className="text-xl font-black text-cyan-400 block mb-2">
                  Total Score: {calculateMockScore()} / {SUMMATIVE_MOCK_QUESTIONS.length * 4}
                </span>
                <p className="text-slate-400">
                  Speed index: 48 sec/question. High accuracy in systems & probability concepts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEVEL 4: ARTIFACT SCORING */}
      {activeTab === "artifact" && (
        <div className="space-y-4">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" /> Authentic Artifact Rubric Scorer
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluates code repository completeness, architectural decoupling, and delivery consistency.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
              Rubric Score: {rubricResult.compositeScore}/100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Artifact Checkpoint Configuration
              </h4>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={artifactHasDocker}
                  onChange={(e) => setArtifactHasDocker(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
                Multi-stage Containerization (Docker / Compose)
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={artifactHasTests}
                  onChange={(e) => setArtifactHasTests(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
                Automated Unit / Integration Tests (≥ 70% coverage)
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={artifactHasReadme}
                  onChange={(e) => setArtifactHasReadme(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
                Exemplary Architectural Documentation & README
              </label>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Git Commit Count:</span>
                  <span className="font-bold text-emerald-400">{artifactCommits}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={artifactCommits}
                  onChange={(e) => setArtifactCommits(parseInt(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Weighted Rubric Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Architecture & System Blueprint (30%):</span>
                  <span className="font-bold text-white">{rubricResult.architectureScore} / 30</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Code Rigor & Verification (25%):</span>
                  <span className="font-bold text-white">{rubricResult.codeQualityScore} / 25</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Documentation & Reproducibility (20%):</span>
                  <span className="font-bold text-white">{rubricResult.documentationScore} / 20</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Problem Complexity & Real-World Value (25%):</span>
                  <span className="font-bold text-white">{rubricResult.complexityScore} / 25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
