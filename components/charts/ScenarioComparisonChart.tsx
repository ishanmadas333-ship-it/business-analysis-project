'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ScenarioBreakdown } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';
import { AlertCircle } from 'lucide-react';

interface ScenarioComparisonChartProps {
  scenarios: {
    conservative: ScenarioBreakdown;
    expected: ScenarioBreakdown;
    growth: ScenarioBreakdown;
  };
}

export function ScenarioComparisonChart({ scenarios }: ScenarioComparisonChartProps) {
  const chartData = [
    {
      scenario: 'Conservative',
      revenue: scenarios.conservative.financials.monthlyRevenue,
      expenses: scenarios.conservative.financials.monthlyTotalCost,
      profit: scenarios.conservative.financials.operatingProfit,
      margin: scenarios.conservative.financials.operatingMarginPct
    },
    {
      scenario: 'Expected (Base)',
      revenue: scenarios.expected.financials.monthlyRevenue,
      expenses: scenarios.expected.financials.monthlyTotalCost,
      profit: scenarios.expected.financials.operatingProfit,
      margin: scenarios.expected.financials.operatingMarginPct
    },
    {
      scenario: 'Growth (Traction)',
      revenue: scenarios.growth.financials.monthlyRevenue,
      expenses: scenarios.growth.financials.monthlyTotalCost,
      profit: scenarios.growth.financials.operatingProfit,
      margin: scenarios.growth.financials.operatingMarginPct
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>Multi-Scenario Sensitivity Comparison</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stress-tested downside vs expected baseline vs scale scenarios.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-md">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Growth scenario is illustrative, not guaranteed.</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="scenario" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis
              tickFormatter={(v) => formatINR(v, { compact: true })}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                formatINR(Number(value)),
                name === 'revenue' ? 'Monthly Revenue' : name === 'expenses' ? 'Monthly Expenses' : 'Operating Profit'
              ]}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              formatter={(val) => (
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {val === 'revenue' ? 'Monthly Revenue' : val === 'expenses' ? 'Monthly Total Expenses' : 'Operating Profit'}
                </span>
              )}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="revenue" />
            <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} name="expenses" />
            <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Structured Comparison Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3 font-semibold">Scenario Metric</th>
              <th className="py-2.5 px-3 font-semibold text-rose-600 dark:text-rose-400">Conservative (-25% Sales)</th>
              <th className="py-2.5 px-3 font-semibold text-blue-600 dark:text-blue-400">Expected (Baseline)</th>
              <th className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">Growth (+40% Sales)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr>
              <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">Monthly Volume</td>
              <td className="py-2 px-3">{scenarios.conservative.financials.monthlyUnits.toLocaleString()} units</td>
              <td className="py-2 px-3 font-bold">{scenarios.expected.financials.monthlyUnits.toLocaleString()} units</td>
              <td className="py-2 px-3">{scenarios.growth.financials.monthlyUnits.toLocaleString()} units</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">Monthly Revenue</td>
              <td className="py-2 px-3">{formatINR(scenarios.conservative.financials.monthlyRevenue)}</td>
              <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{formatINR(scenarios.expected.financials.monthlyRevenue)}</td>
              <td className="py-2 px-3">{formatINR(scenarios.growth.financials.monthlyRevenue)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">Monthly Operating Expenses</td>
              <td className="py-2 px-3">{formatINR(scenarios.conservative.financials.monthlyTotalCost)}</td>
              <td className="py-2 px-3">{formatINR(scenarios.expected.financials.monthlyTotalCost)}</td>
              <td className="py-2 px-3">{formatINR(scenarios.growth.financials.monthlyTotalCost)}</td>
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/20">
              <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">Operating Profit (EBITDA)</td>
              <td className="py-2 px-3 font-semibold text-rose-600 dark:text-rose-400">{formatINR(scenarios.conservative.financials.operatingProfit)}</td>
              <td className="py-2 px-3 font-bold text-emerald-600 dark:text-emerald-400">{formatINR(scenarios.expected.financials.operatingProfit)}</td>
              <td className="py-2 px-3 font-semibold text-emerald-700 dark:text-emerald-300">{formatINR(scenarios.growth.financials.operatingProfit)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">Operating Profit Margin</td>
              <td className="py-2 px-3">{scenarios.conservative.financials.operatingMarginPct}%</td>
              <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{scenarios.expected.financials.operatingMarginPct}%</td>
              <td className="py-2 px-3">{scenarios.growth.financials.operatingMarginPct}%</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">Estimated Capital Break-even</td>
              <td className="py-2 px-3">{scenarios.conservative.financials.breakEvenMonths ? `${scenarios.conservative.financials.breakEvenMonths} mos` : 'Unachieved'}</td>
              <td className="py-2 px-3 font-bold">{scenarios.expected.financials.breakEvenMonths} months</td>
              <td className="py-2 px-3">{scenarios.growth.financials.breakEvenMonths} months</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
