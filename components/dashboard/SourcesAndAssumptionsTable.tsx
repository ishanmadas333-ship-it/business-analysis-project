import React from 'react';
import { ClassificationBadge } from '@/components/ui/Badge';
import { ClassificationType } from '@/types/business';
import { ShieldCheck, Info, FileText } from 'lucide-react';

interface SourceItem {
  item: string;
  value: string;
  classification: ClassificationType;
  rationale: string;
  sourceRef?: string;
}

interface SourcesAndAssumptionsTableProps {
  sources: SourceItem[];
}

export function SourcesAndAssumptionsTable({ sources }: SourcesAndAssumptionsTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Audit Trail: Data Provenance & Assumption Ledger</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent categorization of verified external benchmarks, founder inputs, and AI hypotheses.
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <ClassificationBadge type="VERIFIED DATA" size="sm" />
          <ClassificationBadge type="USER INPUT" size="sm" />
          <ClassificationBadge type="ESTIMATE" size="sm" />
          <ClassificationBadge type="AI ASSUMPTION" size="sm" />
        </div>
      </div>

      <div className="p-3.5 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Startup Sheild Transparency Charter: </strong>
          No synthetic number is disguised as fact. Numerical outputs labeled <em>AI ASSUMPTION</em> or <em>ESTIMATE</em> reflect parametric modeling requiring field testing before capital allocation.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3 font-semibold">Model Metric / Variable</th>
              <th className="py-2.5 px-3 font-semibold">Adopted Value</th>
              <th className="py-2.5 px-3 font-semibold">Classification</th>
              <th className="py-2.5 px-3 font-semibold">Calculation Rationale & Method</th>
              <th className="py-2.5 px-3 font-semibold">External Citation / Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sources.map((src, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                  {src.item}
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {src.value}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <ClassificationBadge type={src.classification} size="sm" />
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
                  {src.rationale}
                </td>
                <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                  {src.sourceRef ? (
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {src.sourceRef}
                    </span>
                  ) : (
                    <span className="italic text-slate-400">Founder Direct Input</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
