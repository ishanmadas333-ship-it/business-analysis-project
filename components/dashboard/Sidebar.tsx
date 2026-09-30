'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { 
  Home, 
  Lightbulb, 
  BarChart3, 
  Store, 
  BadgePercent, 
  SlidersHorizontal, 
  AlertTriangle, 
  FileCheck2, 
  Rocket, 
  Bot, 
  FileText, 
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  MapPin
} from 'lucide-react';

export type DashboardTab = 
  | 'overview'
  | 'ideas'
  | 'locality'
  | 'market'
  | 'competitors'
  | 'financials'
  | 'simulator'
  | 'risks'
  | 'compliance'
  | 'roadmap'
  | 'assistant'
  | 'reports'
  | 'sources'
  | 'settings';

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  savedBusinessCount?: number;
  onOpenAssistantDrawer?: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  savedBusinessCount = 3,
  onOpenAssistantDrawer
}: SidebarProps) {
  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: Home },
    { id: 'locality' as DashboardTab, label: 'Locality Intelligence', icon: MapPin, highlight: true },
    { id: 'ideas' as DashboardTab, label: 'My Business Ideas', icon: Lightbulb, badge: savedBusinessCount },
    { id: 'market' as DashboardTab, label: 'Market Analysis', icon: BarChart3 },
    { id: 'competitors' as DashboardTab, label: 'Competitors', icon: Store },
    { id: 'financials' as DashboardTab, label: 'Financials', icon: BadgePercent },
    { id: 'simulator' as DashboardTab, label: 'What-If Simulator', icon: SlidersHorizontal, highlight: true },
    { id: 'risks' as DashboardTab, label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'compliance' as DashboardTab, label: 'Compliance Checklist', icon: FileCheck2 },
    { id: 'roadmap' as DashboardTab, label: '90-Day Launch Plan', icon: Rocket },
    { id: 'assistant' as DashboardTab, label: 'AI Business Assistant', icon: Bot, isSpecial: true },
    { id: 'reports' as DashboardTab, label: 'Feasibility Report', icon: FileText },
    { id: 'sources' as DashboardTab, label: 'Sources & Assumptions', icon: ShieldCheck },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <Link href="/" className="block">
          <Logo size="md" showTagline={true} />
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Feasibility Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'assistant' && onOpenAssistantDrawer) {
                  onOpenAssistantDrawer();
                } else {
                  onSelectTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : item.isSpecial
                  ? 'text-teal-400 hover:bg-slate-800/80 hover:text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isSpecial ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {item.badge}
                </span>
              )}

              {item.highlight && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Pro / Decision banner */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic AI</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Math-verified financial models and realistic location data before committing capital.
          </p>
        </div>
      </div>
    </aside>
  );
}
