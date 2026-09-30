'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot, Legend, ReferenceLine } from 'recharts';
import { FinancialAssumptions, CalculatedFinancials } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';

interface BreakEvenChartProps {
  assumptions: FinancialAssumptions;
  financials: CalculatedFinancials;
}

export function BreakEvenChart({ assumptions, financials }: BreakEvenChartProps) {
  const { sellingPricePerUnit, variableCostPerUnit } = assumptions;
  const fixedCost = financials.monthlyFixedCost;
  const breakEvenUnits = financials.breakEvenUnitsMonthly;
  const currentUnits = financials.monthlyUnits;

  // Generate 8 data points from 0 to 1.8x max(currentUnits, breakEvenUnits)
  const maxUnits = Math.max(currentUnits * 1.4, breakEvenUnits * 1.5, 5000);
  const step = Math.round(maxUnits / 7);

  const data = [];
  for (let i = 0; i <= 7; i++) {
    const units = i * step;
    const revenue = Math.round(units * sellingPricePerUnit);
    const totalCost = Math.round(fixedCost + (units * variableCostPerUnit));
    data.push({
      units,
      revenue,
      totalCost,
      fixedCost
    });
  }

  // Ensure exact break-even point is plotted smoothly
  const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>Break-Even Analysis Curve</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Deterministic Model
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Intersection where Cumulative Monthly Revenue equals Total Costs (Fixed + Variable).
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Break-even Threshold</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {breakEvenUnits.toLocaleString()} units ({formatINR(breakEvenRevenue)})
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 25, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis
              dataKey="units"
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k u`}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              tickFormatter={(v) => formatINR(v, { compact: true })}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                formatINR(Number(value)),
                name === 'revenue' ? 'Monthly Revenue' : name === 'totalCost' ? 'Total Cost (Fixed+Var)' : 'Fixed Cost'
              ]}
              labelFormatter={(label) => `Monthly Volume: ${Number(label).toLocaleString()} units`}
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
              height={36}
              formatter={(val) => (
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {val === 'revenue' ? 'Revenue Line' : val === 'totalCost' ? 'Total Cost Line' : 'Fixed Cost Baseline'}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981' }}
              name="revenue"
            />
            <Line
              type="monotone"
              dataKey="totalCost"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#f43f5e' }}
              name="totalCost"
            />
            <Line
              type="monotone"
              dataKey="fixedCost"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              name="fixedCost"
            />
            {breakEvenUnits > 0 && (
              <ReferenceDot
                x={breakEvenUnits}
                y={breakEvenRevenue}
                r={6}
                fill="#059669"
                stroke="#fff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="font-semibold text-slate-900 dark:text-white">Formula: </span>
          Fixed Costs ({formatINR(fixedCost)}) ÷ [Selling Price (₹{sellingPricePerUnit}) - Variable Cost (₹{variableCostPerUnit})] ={' '}
          <strong className="text-emerald-600 dark:text-emerald-400">{breakEvenUnits.toLocaleString()} units</strong>
        </div>
        <div className="text-[11px] text-slate-400">
          Current Capacity: <strong className="text-slate-700 dark:text-slate-200">{currentUnits.toLocaleString()} units/mo</strong> ({((currentUnits / breakEvenUnits) * 100).toFixed(0)}% of break-even)
        </div>
      </div>
    </div>
  );
}
