"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { CareerMatch } from "@/lib/types";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CareerProbabilityChartProps {
  careerMatches: CareerMatch[];
  onSelectCareer?: (career: CareerMatch) => void;
  selectedId?: string;
}

// Custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: CareerMatch = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md max-w-xs text-xs text-slate-200">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
          <span className="font-bold text-sm text-white line-clamp-1">{data.title}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {data.probability}%
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Category:</span>
            <span className="text-slate-200 font-medium">{data.category}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Market Demand:</span>
            <span className="text-emerald-400 font-semibold">{data.marketDemand}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Estimated CTC:</span>
            <span className="text-violet-300 font-medium">{data.salaryRange}</span>
          </div>
          {data.cutoffStatus && (
            <div className="flex justify-between text-slate-400">
              <span>Cutoff Band:</span>
              <span className="text-amber-400 font-medium">{data.cutoffStatus}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Top Strengths
          </span>
          <div className="flex flex-wrap gap-1">
            {data.keyStrengths.slice(0, 2).map((s, idx) => (
              <span key={idx} className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 text-[10px] text-cyan-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Click bar to inspect remediation
        </div>
      </div>
    );
  }
  return null;
};

export default function CareerProbabilityChart({
  careerMatches,
  onSelectCareer,
  selectedId,
}: CareerProbabilityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!careerMatches || careerMatches.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No career match probabilities computed yet.
      </div>
    );
  }

  // Format data for horizontal bar chart
  const chartData = careerMatches.map((career) => ({
    ...career,
    shortTitle:
      career.title.length > 28 ? career.title.substring(0, 26) + "..." : career.title,
  }));

  // Dynamic cell color based on probability tier and selection
  const getBarColor = (item: CareerMatch, index: number) => {
    const isSelected = item.id === selectedId;
    if (isSelected) return "#06B6D4"; // vibrant cyan
    if (item.probability >= 40) return "#10B981"; // emerald
    if (item.probability >= 25) return "#8B5CF6"; // violet
    if (item.probability >= 15) return "#6366F1"; // indigo
    return "#F59E0B"; // amber
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Probabilistic Career Match Distribution P(Career_i)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized across candidate paths (Σ P = 100%) calibrated with softmax temperature scaling
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            <span className="text-slate-300">High (≥40%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" />
            <span className="text-slate-300">Moderate (25-39%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            <span className="text-slate-300">Exploratory (&lt;25%)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                onSelectCareer?.(state.activePayload[0].payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1E293B" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              unit="%"
              stroke="#334155"
            />
            <YAxis
              dataKey="shortTitle"
              type="category"
              width={160}
              tick={{ fill: "#CBD5E1", fontSize: 11, fontWeight: 500 }}
              stroke="#334155"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(51, 65, 85, 0.3)" }} />
            <Bar
              dataKey="probability"
              radius={[0, 8, 8, 0]}
              barSize={24}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={getBarColor(entry, index)}
                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                  stroke={entry.id === selectedId ? "#FFFFFF" : "transparent"}
                  strokeWidth={entry.id === selectedId ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Top Recommended:{" "}
          <strong className="text-white">{careerMatches[0]?.title}</strong> ({careerMatches[0]?.probability}%)
        </span>
        <span className="text-[11px] text-slate-500">
          Click any bar to toggle active target & gap breakdown
        </span>
      </div>
    </div>
  );
}
