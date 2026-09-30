'use client';

import React, { useState } from 'react';
import { FinancialAssumptions, CalculatedFinancials } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';
import { Sliders, Check, Edit3, X, HelpCircle } from 'lucide-react';

interface KeyAssumptionsCardProps {
  assumptions: FinancialAssumptions;
  financials: CalculatedFinancials;
  onUpdateAssumptions: (newAssumptions: FinancialAssumptions) => void;
  isExternalOpen?: boolean;
  onCloseExternal?: () => void;
}

export function KeyAssumptionsCard({
  assumptions,
  financials,
  onUpdateAssumptions,
  isExternalOpen,
  onCloseExternal
}: KeyAssumptionsCardProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = internalOpen || !!isExternalOpen;
  const [draft, setDraft] = useState<FinancialAssumptions>({ ...assumptions });

  React.useEffect(() => {
    setDraft({ ...assumptions });
  }, [assumptions, isExternalOpen]);

  const handleClose = () => {
    setInternalOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  const handleSave = () => {
    onUpdateAssumptions(draft);
    handleClose();
  };

  const handleReset = () => {
    setDraft({ ...assumptions });
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Baseline Model Assumptions
            </h4>
          </div>

          <button
            onClick={() => {
              setDraft({ ...assumptions });
              setInternalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Change assumptions</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Estimated Daily Sales
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
              {assumptions.unitsSoldPerDay.toLocaleString()} units/day
            </span>
            <span className="text-[10px] text-slate-400">
              ({assumptions.operatingDaysPerMonth} operating days)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Estimated Selling Price
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
              ₹{assumptions.sellingPricePerUnit.toFixed(2)} / unit
            </span>
            <span className="text-[10px] text-slate-400">
              Wholesale blended rate
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Estimated Variable Cost
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
              ₹{assumptions.variableCostPerUnit.toFixed(2)} / unit
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Margin: ₹{(assumptions.sellingPricePerUnit - assumptions.variableCostPerUnit).toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Estimated Fixed Costs
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
              {formatINR(financials.monthlyFixedCost)} / mo
            </span>
            <span className="text-[10px] text-slate-400">
              Rent + Staff + Utilities
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Monthly Break-even
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
              {financials.breakEvenUnitsMonthly.toLocaleString()} units
            </span>
            <span className="text-[10px] text-slate-400">
              {formatINR(financials.breakEvenRevenueMonthly)} revenue
            </span>
          </div>
        </div>
      </div>

      {/* Edit Assumptions Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Model Assumptions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update baseline numbers. Deterministic calculations will instantly recompute.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Selling Price Per Unit (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={draft.sellingPricePerUnit}
                  onChange={(e) => setDraft({ ...draft, sellingPricePerUnit: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Units Sold Per Day
                </label>
                <input
                  type="number"
                  value={draft.unitsSoldPerDay}
                  onChange={(e) => setDraft({ ...draft, unitsSoldPerDay: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Variable Cost Per Unit (₹)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={draft.variableCostPerUnit}
                  onChange={(e) => setDraft({ ...draft, variableCostPerUnit: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Operating Days / Month
                </label>
                <input
                  type="number"
                  max="31"
                  value={draft.operatingDaysPerMonth}
                  onChange={(e) => setDraft({ ...draft, operatingDaysPerMonth: parseInt(e.target.value) || 26 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  value={draft.monthlyRent}
                  onChange={(e) => setDraft({ ...draft, monthlyRent: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Monthly Staff Cost (₹)
                </label>
                <input
                  type="number"
                  value={draft.monthlyStaffCost}
                  onChange={(e) => setDraft({ ...draft, monthlyStaffCost: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Monthly Marketing (₹)
                </label>
                <input
                  type="number"
                  value={draft.monthlyMarketingCost}
                  onChange={(e) => setDraft({ ...draft, monthlyMarketingCost: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Utilities & Misc Overheads (₹)
                </label>
                <input
                  type="number"
                  value={draft.monthlyUtilitiesAndMisc}
                  onChange={(e) => setDraft({ ...draft, monthlyUtilitiesAndMisc: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply Assumptions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
