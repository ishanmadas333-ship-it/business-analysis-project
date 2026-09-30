import React from 'react';
import { FinancialAssumptions, CalculatedFinancials } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';
import { Layers, ArrowRight, TrendingUp } from 'lucide-react';

interface UnitEconomicsCardProps {
  assumptions: FinancialAssumptions;
  financials: CalculatedFinancials;
}

export function UnitEconomicsCard({ assumptions, financials }: UnitEconomicsCardProps) {
  const { sellingPricePerUnit, variableCostPerUnit } = assumptions;
  const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
  const cmRatio = sellingPricePerUnit > 0 ? (contributionMargin / sellingPricePerUnit) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Unit Economics Breakdown</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Contribution margin per single unit sold before covering fixed facility overheads.
          </p>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          CM Ratio: {cmRatio.toFixed(1)}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
            Selling Price (A)
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white block">
            ₹{sellingPricePerUnit.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Per unit wholesale / retail blend
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
          <span className="text-xs text-rose-600 dark:text-rose-400 block mb-1">
            Variable Cost (B)
          </span>
          <span className="text-xl font-bold text-rose-700 dark:text-rose-300 block">
            ₹{variableCostPerUnit.toFixed(2)}
          </span>
          <span className="text-[11px] text-rose-500/80 mt-1 block">
            Direct raw materials + packaging
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 block mb-1">
            Contribution Margin (A - B)
          </span>
          <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300 block">
            ₹{contributionMargin.toFixed(2)}
          </span>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            Retained per bottle toward fixed costs
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Daily Volume: <strong>{assumptions.unitsSoldPerDay.toLocaleString()} units</strong> generates{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {formatINR(assumptions.unitsSoldPerDay * contributionMargin)}
            </strong> daily contribution margin.
          </span>
        </div>
      </div>
    </div>
  );
}
