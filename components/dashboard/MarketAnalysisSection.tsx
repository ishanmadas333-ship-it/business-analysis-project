'use client';

import React from 'react';
import { MarketAnalysisData } from '@/types/business';
import { ClassificationBadge } from '@/components/ui/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Sun, 
  MapPin, 
  AlertCircle, 
  BarChart2, 
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

interface MarketAnalysisSectionProps {
  market: MarketAnalysisData;
  city: string;
  businessType: string;
}

export function MarketAnalysisSection({ market, city, businessType }: MarketAnalysisSectionProps) {
  const hasVerifiedExternalData = market.dataSourceClassification === 'VERIFIED DATA';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Target Market Sizing & Demand Dynamics</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Macro-market indicators, customer segmentation, and localized seasonality for {businessType} in {city}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClassificationBadge type={market.dataSourceClassification} size="sm" />
        </div>
      </div>

      {/* Verified vs Estimated Data Banner Requirement */}
      {!hasVerifiedExternalData ? (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Data Provenance Advisory</span>
            <p className="leading-relaxed">
              Insufficient verified real-time census data. This section is currently based on calibrated user assumptions and industry benchmark estimates.
            </p>
            {market.citation && (
              <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                Source Benchmark: {market.citation.source} ({market.citation.date})
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Verified External Market Source</span>
            <p className="leading-relaxed">
              Source: <strong>{market.citation.source}</strong> ({market.citation.date}).
            </p>
          </div>
        </div>
      )}

      {/* Market Sizing & Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total Addressable Market Overview
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
            {market.marketSizeDesc}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Projected Annualized Growth (CAGR)
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {market.cagr}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Customer Segments Table */}
      <div>
        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Key Customer Segments & Purchase Triggers</span>
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {market.customerSegments.map((seg, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {seg.name}
                </span>
                <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[11px]">
                  ~{seg.sharePct}% Volume
                </span>
              </div>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">Pain Points: </strong>
                  {seg.painPoints}
                </div>
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">Willingness to Pay: </strong>
                  {seg.willingnessToPay}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong>Acquisition Route: </strong>{seg.acquisitionChannel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Demand Curve Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Monthly Seasonal Demand Index (100 = Baseline Average)</span>
          </h5>
          <span className="text-[11px] text-slate-400">
            High Season: March - June (Summer Surge)
          </span>
        </div>

        <div className="h-48 w-full bg-slate-50/50 dark:bg-slate-850 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={market.seasonalDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[50, 200]} />
              <Tooltip
                formatter={(val: any) => [`${val} Index (${val > 100 ? `+${val - 100}%` : `${val - 100}%`} vs Base)`, 'Demand Index']}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
              />
              <Bar dataKey="demandIndex" fill="#0d9488" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Localized Considerations & Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
          <h6 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Emerging Category Trends</span>
          </h6>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            {market.marketTrends.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
          <h6 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>{city} Local Considerations</span>
          </h6>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            {market.localConsiderations.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
