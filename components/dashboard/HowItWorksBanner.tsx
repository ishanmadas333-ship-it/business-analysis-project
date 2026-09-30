import React from 'react';
import { 
  Brain, 
  MapPin, 
  BarChart3, 
  DollarSign, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export function HowItWorksBanner({ className = '' }: { className?: string }) {
  const steps = [
    {
      icon: <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      tag: '🧠 NLP',
      label: 'Natural Language',
      desc: 'Understands your raw business idea & extracts parameters'
    },
    {
      icon: <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      tag: '📍 Local Data',
      label: 'Locality Pipeline',
      desc: 'Understands your area, institutions & competitor cluster'
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      tag: '📊 Analysis Engine',
      label: 'Demand Engine',
      desc: 'Analyzes footfall, customer segments & category velocity'
    },
    {
      icon: <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      tag: '💰 Financial Engine',
      label: 'Deterministic Math',
      desc: 'Calculates exact costs, revenue, margins & break-even'
    },
    {
      icon: <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
      tag: '🔄 What-If Engine',
      label: 'Scenario Testing',
      desc: 'Simulates budget shocks, price shifts & volume swings'
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      tag: '🔎 Evidence Layer',
      label: 'Source Audit',
      desc: 'Classifies verified data vs assumptions with [Why?] trails'
    }
  ];

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl ${className}`}>
      {/* Principle Eyebrow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              Startup Sheild System Architecture & Product Philosophy
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
            How Startup Sheild Works
          </h3>
        </div>

        {/* The 5 Axioms */}
        <div className="text-[11px] font-mono text-emerald-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
          <span>AI Explains • Data Provides Evidence • Calculations Produce Numbers</span>
        </div>
      </div>

      {/* 6 Engine Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((st, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-slate-800/40 border border-slate-750 hover:border-slate-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-200">{st.tag}</span>
                <div className="p-1 rounded bg-slate-800">
                  {st.icon}
                </div>
              </div>
              <div className="font-bold text-xs text-white mb-1">
                {st.label}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug mt-1">
              {st.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Core Principle Quote */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">
          Core Principle: <span className="text-emerald-400 font-bold">AI DOES NOT CREATE FACTS. THE ENTREPRENEUR MAKES THE DECISION.</span>
        </span>
        <span className="text-[11px] text-slate-400">
          Zero synthetic arithmetic hallucinations
        </span>
      </div>
    </div>
  );
}
