'use client';

import React, { useState } from 'react';
import { ClassificationType, EvidenceDataType, FeasibilityLevel, ConfidenceLevel } from '@/types/business';
import { 
  ShieldCheck, 
  UserCheck, 
  Calculator, 
  Sparkles, 
  Eye, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  X
} from 'lucide-react';

interface ClassificationBadgeProps {
  type: ClassificationType | EvidenceDataType;
  size?: 'sm' | 'md';
  className?: string;
}

export function ClassificationBadge({ type, size = 'sm', className = '' }: ClassificationBadgeProps) {
  // Normalize string
  const norm = String(type).toUpperCase().replace('_', ' ');

  const configs: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
    'VERIFIED DATA': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
      icon: <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
      label: 'VERIFIED DATA'
    },
    'VERIFIED': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
      icon: <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
      label: 'VERIFIED'
    },
    'OBSERVED': {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-300 dark:border-teal-800',
      icon: <Eye className="w-3 h-3 text-teal-600 dark:text-teal-400" />,
      label: 'OBSERVED'
    },
    'CALCULATED': {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-800',
      icon: <Calculator className="w-3 h-3 text-blue-600 dark:text-blue-400" />,
      label: 'CALCULATED'
    },
    'USER INPUT': {
      bg: 'bg-slate-100 dark:bg-slate-800/80',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      icon: <UserCheck className="w-3 h-3 text-slate-600 dark:text-slate-400" />,
      label: 'USER INPUT'
    },
    'ESTIMATE': {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-800',
      icon: <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />,
      label: 'ESTIMATE'
    },
    'AI ASSUMPTION': {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-300 dark:border-purple-800',
      icon: <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />,
      label: 'AI ASSUMPTION'
    },
    'DEMO': {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
      text: 'text-fuchsia-700 dark:text-fuchsia-300',
      border: 'border-fuchsia-300 dark:border-fuchsia-800',
      icon: <AlertTriangle className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-400" />,
      label: 'DEMO DATA'
    },
    'DEMO DATA': {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
      text: 'text-fuchsia-700 dark:text-fuchsia-300',
      border: 'border-fuchsia-300 dark:border-fuchsia-800',
      icon: <AlertTriangle className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-400" />,
      label: 'DEMO DATA'
    }
  };

  const current = configs[norm] || configs['ESTIMATE'];
  const textPadding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      title={`Data Classification: ${current.label}`}
      className={`inline-flex items-center gap-1 rounded-md font-semibold tracking-wider uppercase border ${current.bg} ${current.text} ${current.border} ${textPadding} ${className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}

interface FeasibilityBadgeProps {
  level: FeasibilityLevel;
  className?: string;
}

export function FeasibilityBadge({ level, className = '' }: FeasibilityBadgeProps) {
  const configs: Record<FeasibilityLevel, { bg: string; text: string; border: string; dot: string }> = {
    'High': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
      dot: 'bg-emerald-500'
    },
    'Moderate': {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-800',
      dot: 'bg-amber-500'
    },
    'Low': {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-800',
      dot: 'bg-rose-500'
    }
  };

  const current = configs[level] || configs['Moderate'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{level}</span>
    </span>
  );
}

export function EstimatedTag() {
  return (
    <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
      Estimated
    </span>
  );
}

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  reason?: string;
  className?: string;
}

export function ConfidenceBadge({ level, reason, className = '' }: ConfidenceBadgeProps) {
  const [showReasonModal, setShowReasonModal] = useState(false);

  const colors = {
    HIGH: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    MEDIUM: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    LOW: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800'
  }[level];

  return (
    <>
      <div className={`inline-flex items-center gap-1 text-xs ${className}`}>
        <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] border ${colors}`}>
          {level} CONFIDENCE
        </span>

        {reason && (
          <button
            type="button"
            onClick={() => setShowReasonModal(true)}
            className="text-[10px] text-slate-400 hover:text-slate-200 underline font-medium cursor-pointer ml-0.5"
            title="Inspect confidence methodology"
          >
            [Why?]
          </button>
        )}
      </div>

      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 max-w-md w-full shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {level} Confidence Explanation
                </h4>
              </div>
              <button
                onClick={() => setShowReasonModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {reason}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Startup Sheild calculates confidence from external data provenance, verified regulatory fee schedules, and localized POI cluster completeness.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface DataFreshnessBadgeProps {
  collectedAt?: string;
  isOutdated?: boolean;
  className?: string;
}

export function DataFreshnessBadge({ collectedAt = '2026-09-30', isOutdated = false, className = '' }: DataFreshnessBadgeProps) {
  if (isOutdated) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded ${className}`}>
        <AlertTriangle className="w-3 h-3 text-amber-500" />
        <span>⚠️ Data may be outdated</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono ${className}`}>
      <Clock className="w-3 h-3 text-slate-400" />
      <span>Updated: {collectedAt}</span>
    </span>
  );
}
