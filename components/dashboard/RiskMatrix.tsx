'use client';

import React, { useState } from 'react';
import { RiskAnalysisItem, FeasibilityLevel } from '@/types/business';
import { FeasibilityBadge } from '@/components/ui/Badge';
import { AlertTriangle, ShieldCheck, CheckCircle2, ChevronDown, Filter } from 'lucide-react';

interface RiskMatrixProps {
  risks: RiskAnalysisItem[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Market Risk',
    'Competition Risk',
    'Financial Risk',
    'Operational Risk',
    'Supply Chain Risk',
    'Regulatory Risk',
    'Customer Acquisition Risk'
  ];

  const filtered = selectedCategory === 'All'
    ? risks
    : risks.filter(r => r.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Comprehensive Risk Analysis & Mitigation Strategies</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-mortem risk assessment across commercial, regulatory, operational, and financial dimensions.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {filtered.length} Critical Vectors Mapped
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {item.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Impact:</span>
                  <FeasibilityBadge level={item.impact} />
                </div>
              </div>

              <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-2 leading-snug">
                {item.risk}
              </h5>

              <div className="mb-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Root Cause / Exposure:</strong>
                {item.reason}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Actionable Mitigation Protocol:</span>
              </div>
              <p className="text-emerald-900 dark:text-emerald-200/90 leading-relaxed">
                {item.mitigation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
