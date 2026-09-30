import React from 'react';
import { CalculatedFinancials, FinancialAssumptions } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';

interface PLStatementTableProps {
  financials: CalculatedFinancials;
  assumptions: FinancialAssumptions;
}

export function PLStatementTable({ financials, assumptions }: PLStatementTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Pro Forma Profit & Loss (P&L) Statement
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Standard GAAP-aligned income statement for monthly steady-state and annualized scale.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Corporate Tax Modeled: {assumptions.taxRatePct}%
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3 font-semibold">Financial Line Item</th>
              <th className="py-2.5 px-3 font-semibold text-right">Monthly Steady State</th>
              <th className="py-2.5 px-3 font-semibold text-right">Annual Projection (x12)</th>
              <th className="py-2.5 px-3 font-semibold text-right">% of Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Revenue */}
            <tr className="bg-emerald-50/30 dark:bg-emerald-950/10 font-bold text-slate-900 dark:text-white">
              <td className="py-2.5 px-3">Gross Operating Revenue</td>
              <td className="py-2.5 px-3 text-right">{formatINR(financials.monthlyRevenue)}</td>
              <td className="py-2.5 px-3 text-right">{formatINR(financials.annualRevenue)}</td>
              <td className="py-2.5 px-3 text-right">100.0%</td>
            </tr>

            {/* Variable Costs / COGS */}
            <tr className="text-slate-600 dark:text-slate-300">
              <td className="py-2 px-3 pl-6">Less: Variable Production Costs (COGS)</td>
              <td className="py-2 px-3 text-right text-rose-600 dark:text-rose-400">-{formatINR(financials.monthlyVariableCost)}</td>
              <td className="py-2 px-3 text-right text-rose-600 dark:text-rose-400">-{formatINR(financials.monthlyVariableCost * 12)}</td>
              <td className="py-2 px-3 text-right">
                {financials.monthlyRevenue > 0 ? ((financials.monthlyVariableCost / financials.monthlyRevenue) * 100).toFixed(1) : 0}%
              </td>
            </tr>

            {/* Gross Profit */}
            <tr className="bg-slate-50/60 dark:bg-slate-800/30 font-semibold text-slate-900 dark:text-white">
              <td className="py-2 px-3">Gross Profit</td>
              <td className="py-2 px-3 text-right">{formatINR(financials.grossProfit)}</td>
              <td className="py-2 px-3 text-right">{formatINR(financials.grossProfit * 12)}</td>
              <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">
                {financials.grossMarginPct}%
              </td>
            </tr>

            {/* Fixed Overheads Breakdown */}
            <tr className="text-slate-500 dark:text-slate-400">
              <td className="py-1.5 px-3 pl-6">Operating Lease / Factory Rent</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyRent)}</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyRent * 12)}</td>
              <td className="py-1.5 px-3 text-right">{((assumptions.monthlyRent / financials.monthlyRevenue) * 100).toFixed(1)}%</td>
            </tr>
            <tr className="text-slate-500 dark:text-slate-400">
              <td className="py-1.5 px-3 pl-6">Personnel & Operator Payroll</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyStaffCost)}</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyStaffCost * 12)}</td>
              <td className="py-1.5 px-3 text-right">{((assumptions.monthlyStaffCost / financials.monthlyRevenue) * 100).toFixed(1)}%</td>
            </tr>
            <tr className="text-slate-500 dark:text-slate-400">
              <td className="py-1.5 px-3 pl-6">Marketing & B2B Distribution Incentive</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyMarketingCost)}</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyMarketingCost * 12)}</td>
              <td className="py-1.5 px-3 text-right">{((assumptions.monthlyMarketingCost / financials.monthlyRevenue) * 100).toFixed(1)}%</td>
            </tr>
            <tr className="text-slate-500 dark:text-slate-400">
              <td className="py-1.5 px-3 pl-6">Utilities, Power & Fuel Expenses</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyUtilitiesAndMisc)}</td>
              <td className="py-1.5 px-3 text-right">-{formatINR(assumptions.monthlyUtilitiesAndMisc * 12)}</td>
              <td className="py-1.5 px-3 text-right">{((assumptions.monthlyUtilitiesAndMisc / financials.monthlyRevenue) * 100).toFixed(1)}%</td>
            </tr>

            {/* Operating Profit (EBITDA) */}
            <tr className="bg-emerald-50 dark:bg-emerald-950/30 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
              <td className="py-2.5 px-3">Operating Profit (EBITDA)</td>
              <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{formatINR(financials.operatingProfit)}</td>
              <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{formatINR(financials.annualOperatingProfit)}</td>
              <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                {financials.operatingMarginPct}%
              </td>
            </tr>

            {/* Taxes */}
            <tr className="text-slate-500 dark:text-slate-400">
              <td className="py-2 px-3 pl-6">Estimated Income Tax ({assumptions.taxRatePct}%)</td>
              <td className="py-2 px-3 text-right">-{formatINR(financials.operatingProfit > 0 ? financials.operatingProfit * (assumptions.taxRatePct / 100) : 0)}</td>
              <td className="py-2 px-3 text-right">-{formatINR(financials.annualOperatingProfit > 0 ? financials.annualOperatingProfit * (assumptions.taxRatePct / 100) : 0)}</td>
              <td className="py-2 px-3 text-right">-</td>
            </tr>

            {/* Net Profit */}
            <tr className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
              <td className="py-3 px-3">Net Profit After Tax (PAT)</td>
              <td className="py-3 px-3 text-right text-sm text-emerald-700 dark:text-emerald-300">{formatINR(financials.netProfit)}</td>
              <td className="py-3 px-3 text-right text-sm text-emerald-700 dark:text-emerald-300">{formatINR(financials.netProfit * 12)}</td>
              <td className="py-3 px-3 text-right text-sm text-emerald-700 dark:text-emerald-300">
                {financials.netMarginPct}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
