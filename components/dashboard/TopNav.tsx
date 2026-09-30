'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FullBusinessReport } from '@/types/business';
import { formatINR } from '@/lib/calculations/financialEngine';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  Plus, 
  Sparkles, 
  User, 
  ExternalLink,
  Check,
  Bot
} from 'lucide-react';

interface TopNavProps {
  currentReport: FullBusinessReport;
  allReports: Record<string, FullBusinessReport>;
  onSelectBusiness: (reportId: string) => void;
  onOpenAssistant: () => void;
  onNewIdeaClick: () => void;
}

export function TopNav({
  currentReport,
  allReports,
  onSelectBusiness,
  onOpenAssistant,
  onNewIdeaClick
}: TopNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Active Business Switcher Pill */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
            <Building2 className="w-4 h-4" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate max-w-[200px] md:max-w-xs">
                {currentReport.idea.businessType}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {currentReport.idea.location.city}, {currentReport.idea.location.state}
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Budget: {formatINR(currentReport.idea.budget, { compact: true })}
              </span>
            </div>
          </div>
        </button>

        {/* Dropdown Menu for Switching Businesses */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Business
                </span>
                <span className="text-[10px] text-slate-400">
                  {Object.keys(allReports).length} saved
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                {Object.values(allReports).map((rep) => {
                  const isCurrent = rep.idea.id === currentReport.idea.id;
                  return (
                    <button
                      key={rep.idea.id}
                      onClick={() => {
                        onSelectBusiness(rep.idea.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {rep.idea.businessType}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{rep.idea.location.city}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">
                            {formatINR(rep.idea.budget, { compact: true })}
                          </span>
                        </div>
                      </div>

                      {isCurrent && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNewIdeaClick();
                  }}
                  className="w-full py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Analyze New Idea</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Assistant Quick Trigger Button */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors shadow-xs"
        >
          <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="hidden sm:inline">Ask AI Assistant</span>
        </button>

        {/* New Idea Button */}
        <button
          onClick={onNewIdeaClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Analysis</span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold">
            RS
          </div>
          <div className="hidden lg:block text-left">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs leading-none">
              Rohit Sharma
            </span>
            <span className="text-[10px] text-slate-400 leading-none">
              Founder Mode
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
