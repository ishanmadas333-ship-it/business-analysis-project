'use client';

import React from 'react';
import { EstimatedTag, ClassificationBadge } from '@/components/ui/Badge';
import { WhyThisNumberButton, WhyThisNumberData } from '@/components/ui/WhyThisNumberModal';
import { ClassificationType, EvidenceDataType } from '@/types/business';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  classification?: ClassificationType | EvidenceDataType;
  showEstimated?: boolean;
  highlight?: 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
  tooltip?: string;
  whyThisNumberData?: WhyThisNumberData;
  onEditAssumption?: () => void;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  classification = 'ESTIMATE',
  showEstimated = true,
  highlight = 'slate',
  tooltip,
  whyThisNumberData,
  onEditAssumption
}: MetricCardProps) {
  const highlightRing = {
    emerald: 'border-l-4 border-l-emerald-500',
    amber: 'border-l-4 border-l-amber-500',
    blue: 'border-l-4 border-l-blue-500',
    purple: 'border-l-4 border-l-purple-500',
    slate: 'border-l-4 border-l-slate-400'
  }[highlight];

  return (
    <div className={`relative bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all ${highlightRing}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          {showEstimated && <EstimatedTag />}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {icon}
          </div>
        )}
      </div>

      <div className="my-1.5 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {trend.value}
          </span>
        )}
      </div>

      {/* Why This Number Transparency Link */}
      {whyThisNumberData && (
        <div className="my-1">
          <WhyThisNumberButton
            data={whyThisNumberData}
            onEditAssumption={onEditAssumption}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate" title={subtitle}>
          {subtitle}
        </span>
        <ClassificationBadge type={classification} size="sm" />
      </div>
    </div>
  );
}
