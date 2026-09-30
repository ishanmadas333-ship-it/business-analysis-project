'use client';

import React, { useState } from 'react';
import { FinancialAssumptions, StartupCostItem, CalculatedFinancials } from '@/types/business';
import { calculateFinancials, formatINR } from '@/lib/calculations/financialEngine';
import { RefreshCw, RotateCcw, TrendingUp, TrendingDown, ArrowRight, Sparkles, Check, SlidersHorizontal } from 'lucide-react';

interface WhatIfSimulatorProps {
  initialAssumptions: FinancialAssumptions;
  startupCosts: StartupCostItem[];
  initialBudget: number;
  onApplyModifiedToMaster?: (assumptions: FinancialAssumptions, budget: number) => void;
}

export function WhatIfSimulator({
  initialAssumptions,
  startupCosts,
  initialBudget,
  onApplyModifiedToMaster
}: WhatIfSimulatorProps) {
  // Baseline (Current Scenario)
  const currentBudget = initialBudget;
  const currentAssumptions = initialAssumptions;
  const currentFinancials = calculateFinancials(startupCosts, currentAssumptions, currentBudget);

  // Modified (What-If Scenario)
  const [modBudget, setModBudget] = useState<number>(initialBudget);
  const [modAssumptions, setModAssumptions] = useState<FinancialAssumptions>({ ...initialAssumptions });

  // Recalculate modified financials on the fly
  const modFinancials = calculateFinancials(startupCosts, modAssumptions, modBudget);

  // Deltas
  const revDiff = modFinancials.monthlyRevenue - currentFinancials.monthlyRevenue;
  const revPct = currentFinancials.monthlyRevenue > 0 ? (revDiff / currentFinancials.monthlyRevenue) * 100 : 0;

  const costDiff = modFinancials.monthlyTotalCost - currentFinancials.monthlyTotalCost;
  const costPct = currentFinancials.monthlyTotalCost > 0 ? (costDiff / currentFinancials.monthlyTotalCost) * 100 : 0;

  const profitDiff = modFinancials.operatingProfit - currentFinancials.operatingProfit;
  const profitPct = currentFinancials.operatingProfit !== 0 ? (profitDiff / Math.abs(currentFinancials.operatingProfit)) * 100 : 0;

  const handleReset = () => {
    setModBudget(initialBudget);
    setModAssumptions({ ...initialAssumptions });
  };

  const handleApply = () => {
    if (onApplyModifiedToMaster) {
      onApplyModifiedToMaster(modAssumptions, modBudget);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive What-If Scenario Simulator</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test budget constraints, pricing shifts, volume swings, and overhead changes in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
          {onApplyModifiedToMaster && (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Main Model</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Comparison: Current Scenario vs Modified Scenario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Current Scenario Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Baseline Scenario
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              Active Model
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
            <div>
              <span className="text-slate-400 block">Available Budget</span>
              <strong className="text-sm text-slate-900 dark:text-white font-bold">{formatINR(currentBudget)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Daily Sales Volume</span>
              <strong className="text-sm text-slate-900 dark:text-white font-bold">{currentAssumptions.unitsSoldPerDay.toLocaleString()} units/day</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Monthly Revenue</span>
              <strong className="text-sm text-slate-900 dark:text-white font-bold">{formatINR(currentFinancials.monthlyRevenue)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Monthly Operating Profit</span>
              <strong className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                {formatINR(currentFinancials.operatingProfit)} ({currentFinancials.operatingMarginPct}%)
              </strong>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Break-even: <strong>{currentFinancials.breakEvenMonths ? `${currentFinancials.breakEvenMonths} mos` : 'N/A'}</strong></span>
            <span>Runway: <strong>{currentFinancials.runwayMonthsWithBudget} mos</strong></span>
          </div>
        </div>

        {/* Modified Scenario Card with Dynamic Delta */}
        <div className="p-4 rounded-xl border-2 border-emerald-500/80 dark:border-emerald-500/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/5">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-200 dark:border-emerald-800/60">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modified Simulated Scenario</span>
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
              Dynamic Recalculation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
            <div>
              <span className="text-slate-400 block">Simulated Budget</span>
              <strong className="text-sm text-slate-900 dark:text-white font-bold">{formatINR(modBudget)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Daily Sales Volume</span>
              <strong className="text-sm text-slate-900 dark:text-white font-bold">{modAssumptions.unitsSoldPerDay.toLocaleString()} units/day</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Monthly Revenue</span>
              <div className="flex items-baseline gap-1.5">
                <strong className="text-sm text-slate-900 dark:text-white font-bold">{formatINR(modFinancials.monthlyRevenue)}</strong>
                <span className={`text-[10px] font-bold ${revDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {revDiff >= 0 ? `+${revPct.toFixed(0)}%` : `${revPct.toFixed(0)}%`}
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block">Operating Profit</span>
              <div className="flex items-baseline gap-1.5">
                <strong className={`text-sm font-bold ${modFinancials.operatingProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {formatINR(modFinancials.operatingProfit)} ({modFinancials.operatingMarginPct}%)
                </strong>
                <span className={`text-[10px] font-bold ${profitDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {profitDiff >= 0 ? `+${profitPct.toFixed(0)}%` : `${profitPct.toFixed(0)}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
            <span>
              Break-even: <strong className="text-slate-900 dark:text-white">{modFinancials.breakEvenMonths ? `${modFinancials.breakEvenMonths} mos` : 'Unreachable'}</strong>
            </span>
            <span>
              Runway: <strong className="text-slate-900 dark:text-white">{modFinancials.runwayMonthsWithBudget} mos</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 8 Interactive Simulation Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Capital Budget */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Available Budget</label>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(modBudget)}</span>
          </div>
          <input
            type="range"
            min="100000"
            max="2500000"
            step="25000"
            value={modBudget}
            onChange={(e) => setModBudget(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹1 Lakh</span>
            <span>₹25 Lakh</span>
          </div>
        </div>

        {/* 2. Selling Price */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Selling Price / Unit</label>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{modAssumptions.sellingPricePerUnit.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="0.5"
            value={modAssumptions.sellingPricePerUnit}
            onChange={(e) => setModAssumptions({ ...modAssumptions, sellingPricePerUnit: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹5</span>
            <span>₹50</span>
          </div>
        </div>

        {/* 3. Daily Sales Volume */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Daily Sales Volume</label>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{modAssumptions.unitsSoldPerDay.toLocaleString()} units</span>
          </div>
          <input
            type="range"
            min="100"
            max="3500"
            step="50"
            value={modAssumptions.unitsSoldPerDay}
            onChange={(e) => setModAssumptions({ ...modAssumptions, unitsSoldPerDay: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>100 u/day</span>
            <span>3,500 u/day</span>
          </div>
        </div>

        {/* 4. Variable Cost Per Unit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Variable Cost / Unit</label>
            <span className="font-bold text-rose-600 dark:text-rose-400">₹{modAssumptions.variableCostPerUnit.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="2"
            max="25"
            step="0.2"
            value={modAssumptions.variableCostPerUnit}
            onChange={(e) => setModAssumptions({ ...modAssumptions, variableCostPerUnit: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹2</span>
            <span>₹25</span>
          </div>
        </div>

        {/* 5. Monthly Rent */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly Rent</label>
            <span className="font-bold text-slate-900 dark:text-white">{formatINR(modAssumptions.monthlyRent)}</span>
          </div>
          <input
            type="range"
            min="5000"
            max="60000"
            step="1000"
            value={modAssumptions.monthlyRent}
            onChange={(e) => setModAssumptions({ ...modAssumptions, monthlyRent: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹5k</span>
            <span>₹60k</span>
          </div>
        </div>

        {/* 6. Monthly Staff Cost */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly Staff Payroll</label>
            <span className="font-bold text-slate-900 dark:text-white">{formatINR(modAssumptions.monthlyStaffCost)}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="120000"
            step="2000"
            value={modAssumptions.monthlyStaffCost}
            onChange={(e) => setModAssumptions({ ...modAssumptions, monthlyStaffCost: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹10k</span>
            <span>₹1.2L</span>
          </div>
        </div>

        {/* 7. Marketing Budget */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly Marketing</label>
            <span className="font-bold text-slate-900 dark:text-white">{formatINR(modAssumptions.monthlyMarketingCost)}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="40000"
            step="1000"
            value={modAssumptions.monthlyMarketingCost}
            onChange={(e) => setModAssumptions({ ...modAssumptions, monthlyMarketingCost: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹1k</span>
            <span>₹40k</span>
          </div>
        </div>

        {/* 8. Operating Days */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Operating Days / Month</label>
            <span className="font-bold text-slate-900 dark:text-white">{modAssumptions.operatingDaysPerMonth} days</span>
          </div>
          <input
            type="range"
            min="20"
            max="31"
            step="1"
            value={modAssumptions.operatingDaysPerMonth}
            onChange={(e) => setModAssumptions({ ...modAssumptions, operatingDaysPerMonth: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>20 days</span>
            <span>31 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
