'use client';

import React, { useState } from 'react';
import { ComplianceItem } from '@/types/business';
import { COMPLIANCE_DISCLAIMER } from '@/lib/compliance/complianceService';
import { formatINR } from '@/lib/calculations/financialEngine';
import { FileCheck2, ExternalLink, AlertTriangle, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface ComplianceChecklistProps {
  compliance: ComplianceItem[];
  businessType: string;
  locationName: string;
}

export function ComplianceChecklist({ compliance, businessType, locationName }: ComplianceChecklistProps) {
  const [items, setItems] = useState<ComplianceItem[]>(compliance);

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Mandatory Before Launch' ? 'Recommended' : 'Mandatory Before Launch';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const totalFee = items.reduce((s, i) => s + i.estimatedCostInr, 0);
  const maxDays = Math.max(...items.map(i => i.estimatedTimeDays), 30);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Statutory Licensing & Regulatory Compliance Roadmap</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Jurisdictional compliance checklist customized for {businessType} in {locationName}.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Estimated Lead Time</span>
            <strong className="text-slate-900 dark:text-white font-bold">{maxDays} Days</strong>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-600 dark:text-emerald-400 block text-[10px]">Statutory Fee Reserve</span>
            <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{formatINR(totalFee)}</strong>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-3.5 mb-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Notice: </strong> {COMPLIANCE_DISCLAIMER}
        </p>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3 font-semibold">Requirement & Issuing Authority</th>
              <th className="py-2.5 px-3 font-semibold">Regulatory Purpose</th>
              <th className="py-2.5 px-3 font-semibold">Timeline & Statutory Cost</th>
              <th className="py-2.5 px-3 font-semibold">Priority Status</th>
              <th className="py-2.5 px-3 font-semibold">Official Source & Verified Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {item.requirement}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Authority: {item.issuingAuthority}
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                  {item.purpose}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{item.estimatedTimeDays} days</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    {item.estimatedCostInr > 0 ? formatINR(item.estimatedCostInr) : 'Free / No Govt Fee'}
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'Mandatory Before Launch'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : item.status === 'Recommended'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="truncate max-w-[160px]" title={item.officialSource}>
                      {item.officialSource}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Verified: {item.lastVerifiedDate}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
