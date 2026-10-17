"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useApp } from "@/lib/context";

export default function LandingPage() {
  const router = useRouter();
  const { isLoggedIn, userProfile } = useApp();

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 py-16 overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-emerald-400/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 faint-grid opacity-15 pointer-events-none" />

      {/* Main Hero Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-surface-container/60 backdrop-blur-md mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            Next-Gen AI Career Diagnostic Engine
          </span>
        </div>

        {/* Brand Heading */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            CareerCompass
          </span>
        </h1>

        {/* 2-3 Line Description */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-10">
          CareerCompass maps your authentic skills against live industry benchmarks and premier university cutoffs.
          Detect critical knowledge gaps, measure your hiring readiness score, and navigate dynamic,
          step-by-step learning roadmaps tailored to your ambition.
        </p>

        {/* Auth Action Controls */}
        <div className="w-full max-w-md flex flex-col items-center gap-4 bg-surface-container/80 backdrop-blur-xl border border-outline-variant/30 p-6 rounded-2xl shadow-xl mb-12">
          {isLoggedIn ? (
            <div className="w-full space-y-3">
              <p className="text-sm text-slate-300">
                Logged in as <span className="text-cyan-400 font-bold">{userProfile?.name || "Student"}</span>
              </p>
              <button
                onClick={() => router.push("/student-verification")}
                className="w-full py-3.5 px-6 rounded-xl pulse-gradient text-white font-extrabold text-sm shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Go to Student Verification
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ) : (
            <>
              {/* Google One-Click Login */}
              <div className="w-full">
                <GoogleLoginButton
                  label="Continue with Google"
                  redirectTo="/student-verification"
                  className="shadow-md hover:shadow-cyan-500/20"
                />
              </div>

              {/* Divider */}
              <div className="w-full flex items-center gap-3 my-1">
                <div className="h-[1px] flex-1 bg-outline-variant/30" />
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  or sign in with credentials
                </span>
                <div className="h-[1px] flex-1 bg-outline-variant/30" />
              </div>

              {/* Login & Signup Buttons */}
              <div className="w-full grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="w-full py-3 px-4 rounded-xl pulse-gradient text-white font-bold text-sm shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="w-full py-3 px-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-semibold text-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Sign Up
                </Link>
              </div>
            </>
          )}

          {/* Quick guest bypass */}
          <Link
            href="/student-verification"
            className="text-xs text-slate-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1 mt-1"
          >
            Explore Student Verification as Guest
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl text-left w-full">
          <div className="bg-surface-container-low/70 border border-outline-variant/20 rounded-xl p-5 hover:border-violet-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1.5">Skill Gap Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize multidimensional strengths vs target role benchmarks with live category percentages.
            </p>
          </div>

          <div className="bg-surface-container-low/70 border border-outline-variant/20 rounded-xl p-5 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">route</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1.5">Adaptive Roadmaps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-generated personalized milestone sequences with curated topics, video resources, and applied projects.
            </p>
          </div>

          <div className="bg-surface-container-low/70 border border-outline-variant/20 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1.5">Multi-Tier Lifecycle</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailored pathways for Class 10 stream choices, Class 12 entrance exams, and College job readiness.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
