'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { StartupCostItem } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';

interface CostBreakdownPieProps {
  startupCosts: StartupCostItem[];
}

const COLORS = [
  '#059669', // Emerald
  '#0284c7', // Sky
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#e11d48', // Rose
  '#0d9488', // Teal
  '#4f46e5', // Indigo
  '#475569'  // Slate
];

export function CostBreakdownPie({ startupCosts }: CostBreakdownPieProps) {
  // Aggregate items by category
  const categoryMap: Record<string, number> = {};
  startupCosts.forEach(item => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
  });

  const data = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  const total = startupCosts.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Capital Allocation Breakdown
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Initial startup investment distributed across hardware, premises, and reserves.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          Total: {formatINR(total)}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                `${formatINR(Number(value))} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                'Allocated'
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
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
