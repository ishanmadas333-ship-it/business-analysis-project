'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CalculatedFinancials, FinancialAssumptions } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';

interface RevenueExpensesChartProps {
  financials: CalculatedFinancials;
  assumptions: FinancialAssumptions;
}

export function RevenueExpensesChart({ financials, assumptions }: RevenueExpensesChartProps) {
  // Generate 12-month projection modeling ramp-up and monthly growth
  const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
  const growthRate = assumptions.customerGrowthMonthlyPct / 100;

  // Month 1 starts at 65% capacity, ramps to 100% by month 4, then grows smoothly
  const data = months.map((m, idx) => {
    let rampFactor = 1.0;
    if (idx === 0) rampFactor = 0.65;
    else if (idx === 1) rampFactor = 0.78;
    else if (idx === 2) rampFactor = 0.90;
    else rampFactor = 1.0 + (idx - 3) * (growthRate * 0.8);

    const units = Math.round(financials.monthlyUnits * rampFactor);
    const revenue = Math.round(units * assumptions.sellingPricePerUnit);
    const variableCost = Math.round(units * assumptions.variableCostPerUnit);
    const fixedCost = financials.monthlyFixedCost;
    const totalExpenses = variableCost + fixedCost;
    const profit = revenue - totalExpenses;

    return {
      month: m,
      revenue,
      expenses: totalExpenses,
      profit
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            12-Month Cash Flow & Profit Trajectory
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Projected monthly revenue vs operating expenses incorporating commercial ramp-up curves.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Annual Revenue: </span>
            <strong className="text-slate-900 dark:text-white">{formatINR(financials.annualRevenue, { compact: true })}</strong>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Annual EBITDA: </span>
            <strong className="text-emerald-600 dark:text-emerald-400">{formatINR(financials.annualOperatingProfit, { compact: true })}</strong>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 25, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis
              tickFormatter={(v) => formatINR(v, { compact: true })}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                formatINR(Number(value)),
                name === 'revenue' ? 'Monthly Revenue' : name === 'expenses' ? 'Total Expenses' : 'Operating Profit'
              ]}
              labelFormatter={(label) => `Projection Month ${label}`}
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
                  {val === 'revenue' ? 'Projected Revenue' : val === 'expenses' ? 'Total Expenses' : 'Operating Profit'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRev)"
              name="revenue"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#64748b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExp)"
              name="expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
