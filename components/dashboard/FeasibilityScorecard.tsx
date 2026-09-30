import React from 'react';
import { FeasibilityScorecard as IFeasibilityScorecard } from '@/types/business';
import { FeasibilityBadge } from '@/components/ui/Badge';
import { Info, CheckCircle2, AlertTriangle, Scale, Target, DollarSign, Users, Cog, ShieldAlert } from 'lucide-react';

interface FeasibilityScorecardProps {
  scorecard: IFeasibilityScorecard;
  onOpenAssumptions?: () => void;
}

export function FeasibilityScorecard({ scorecard, onOpenAssumptions }: FeasibilityScorecardProps) {
  const indicators = [
    {
      key: 'marketOpportunity',
      data: scorecard.marketOpportunity,
      icon: <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      color: 'emerald'
    },
    {
      key: 'financialFeasibility',
      data: scorecard.financialFeasibility,
      icon: <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      color: 'blue'
    },
    {
      key: 'competitionIntensity',
      data: scorecard.competitionIntensity,
      icon: <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      color: 'amber'
    },
    {
      key: 'operationalComplexity',
      data: scorecard.operationalComplexity,
      icon: <Cog className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      color: 'purple'
    },
    {
      key: 'regulatoryComplexity',
      data: scorecard.regulatoryComplexity,
      icon: <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      color: 'indigo'
    },
    {
      key: 'riskExposure',
      data: scorecard.riskExposure,
      icon: <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      color: 'rose'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      {/* Header & Verdict */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Feasibility Scorecard & Decision Support
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Rules-Based Model
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculated deterministically from unit margins, capital coverage, regulatory lead times, and competitive density.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 px-3.5 py-1.5 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Confidence Index: {scorecard.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Strategic Verdict Banner */}
      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              Preliminary Feasibility Verdict
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
              {scorecard.verdictSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Transparent Dimensional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((ind) => (
          <div
            key={ind.key}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    {ind.icon}
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {ind.data.dimension}
                  </span>
                </div>
                <FeasibilityBadge level={ind.data.level} />
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${ind.data.score}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {ind.data.rationale}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 italic">
              Rule: {ind.data.ruleExplanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
