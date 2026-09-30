'use client';

import React, { useState } from 'react';
import { ClassificationBadge, DataFreshnessBadge } from '@/components/ui/Badge';
import { EvidenceDataType, ClassificationType } from '@/types/business';
import { HelpCircle, Calculator, X, Edit3, ArrowRight, ShieldCheck } from 'lucide-react';

export interface WhyThisNumberData {
  title: string;
  metricValue: string | number;
  classification: EvidenceDataType | ClassificationType;
  formula?: string;
  breakdownItems?: Array<{ label: string; value: string | number }>;
  underlyingAssumptions?: string[];
  sourceName?: string;
  sourceUrl?: string;
  collectedAt?: string;
}

interface WhyThisNumberButtonProps {
  data: WhyThisNumberData;
  onEditAssumption?: () => void;
  className?: string;
}

export function WhyThisNumberButton({
  data,
  onEditAssumption,
  className = ''
}: WhyThisNumberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold underline underline-offset-2 cursor-pointer transition-colors ${className}`}
        title="Inspect formula, data classification, and underlying assumptions"
      >
        <HelpCircle className="w-3 h-3 shrink-0" />
        <span>Why this number?</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Calculation & Provenance Audit
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {data.title}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Result & Classification */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Computed Metric Output</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {data.metricValue}
                </span>
              </div>
              <ClassificationBadge type={data.classification} size="sm" />
            </div>

            {/* Breakdown Parameters */}
            {data.breakdownItems && data.breakdownItems.length > 0 && (
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Underlying Numerical Components
                </span>
                <div className="space-y-1.5 bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  {data.breakdownItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
                      <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                      <strong className="font-bold text-slate-900 dark:text-white font-mono">{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mathematical Formula */}
            {data.formula && (
              <div className="mb-4 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs">
                <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold mb-1">
                  <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Deterministic Calculation Formula:</span>
                </div>
                <code className="font-mono text-[11px] text-blue-900 dark:text-blue-200 block p-1.5 bg-blue-100/50 dark:bg-blue-900/40 rounded mt-1">
                  {data.formula}
                </code>
              </div>
            )}

            {/* Underlying Assumptions */}
            {data.underlyingAssumptions && data.underlyingAssumptions.length > 0 && (
              <div className="mb-4 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Underlying Assumptions & Field Hypotheses
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                  {data.underlyingAssumptions.map((assump, i) => (
                    <li key={i}>{assump}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Source Reference & Freshness */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="text-[11px] text-slate-500">
                Source: <strong>{data.sourceName || 'Startup Sheild Financial Engine'}</strong>
              </div>
              <DataFreshnessBadge collectedAt={data.collectedAt || '2026-09-30'} />
            </div>

            {/* Edit Assumption Action */}
            {onEditAssumption && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onEditAssumption();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Assumptions</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
