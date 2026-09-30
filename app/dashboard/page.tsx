'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar, DashboardTab } from '@/components/dashboard/Sidebar';
import { TopNav } from '@/components/dashboard/TopNav';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FeasibilityScorecard } from '@/components/dashboard/FeasibilityScorecard';
import { KeyAssumptionsCard } from '@/components/dashboard/KeyAssumptionsCard';
import { BreakEvenChart } from '@/components/charts/BreakEvenChart';
import { RevenueExpensesChart } from '@/components/charts/RevenueExpensesChart';
import { CostBreakdownPie } from '@/components/charts/CostBreakdownPie';
import { ScenarioComparisonChart } from '@/components/charts/ScenarioComparisonChart';
import { StartupCostEditor } from '@/components/financial/StartupCostEditor';
import { UnitEconomicsCard } from '@/components/financial/UnitEconomicsCard';
import { PLStatementTable } from '@/components/financial/PLStatementTable';
import { WhatIfSimulator } from '@/components/simulator/WhatIfSimulator';
import { CompetitorTable } from '@/components/dashboard/CompetitorTable';
import { RiskMatrix } from '@/components/dashboard/RiskMatrix';
import { ComplianceChecklist } from '@/components/dashboard/ComplianceChecklist';
import { RoadmapTimeline } from '@/components/dashboard/RoadmapTimeline';
import { SourcesAndAssumptionsTable } from '@/components/dashboard/SourcesAndAssumptionsTable';
import { MarketAnalysisSection } from '@/components/dashboard/MarketAnalysisSection';
import { HowItWorksBanner } from '@/components/dashboard/HowItWorksBanner';
import { LocalityIntelligenceSection } from '@/components/dashboard/LocalityIntelligenceSection';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';
import { BusinessReportModal } from '@/components/dashboard/BusinessReportModal';
import { FullBusinessReport, FinancialAssumptions, StartupCostItem } from '@/types/business';
import { getInitialReports, saveReportsToStorage, getStoredActiveReportId, setStoredActiveReportId } from '@/lib/database/store';
import { calculateFinancials, generateThreeScenarios, evaluateFeasibility, formatINR } from '@/lib/calculations/financialEngine';
import { getLocalityIntelligence, getLocationComparisonOptions } from '@/lib/locality/localityIntelligenceService';
import { getCategoryProfile } from '@/lib/locality/businessCategoryProfiles';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Wallet, 
  SlidersHorizontal, 
  FileText, 
  Bot,
  Plus,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get('id');

  const [allReports, setAllReports] = useState<Record<string, FullBusinessReport>>({});
  const [activeReportId, setActiveReportId] = useState<string>('demo-water-hyd-1');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);

  // Load from local storage or defaults on mount
  useEffect(() => {
    const loaded = getInitialReports();
    setAllReports(loaded);

    const initialId = idFromUrl || getStoredActiveReportId() || Object.keys(loaded)[0] || 'demo-water-hyd-1';
    if (loaded[initialId]) {
      setActiveReportId(initialId);
    } else if (Object.keys(loaded).length > 0) {
      setActiveReportId(Object.keys(loaded)[0]);
    }
  }, [idFromUrl]);

  // Current active report
  const currentReport = allReports[activeReportId] || Object.values(allReports)[0];

  // Resolve locality intelligence, category profile, and location comparison with fallbacks
  const currentLocality = currentReport?.localityIntelligence || (currentReport ? getLocalityIntelligence(
    currentReport.idea.businessType,
    currentReport.idea.location.city,
    currentReport.idea.location.neighborhood
  ) : undefined);

  const currentCategoryProfile = currentReport?.categoryProfile || (currentReport ? getCategoryProfile(currentReport.idea.businessType) : undefined);

  const currentLocationComparison = currentReport?.locationComparison || (currentReport ? getLocationComparisonOptions(
    currentReport.idea.businessType,
    currentReport.idea.location.city
  ) : undefined);

  if (!currentReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
          <span>Loading Startup Sheild Feasibility Model...</span>
        </div>
      </div>
    );
  }

  // Handle switching business
  const handleSelectBusiness = (id: string) => {
    setActiveReportId(id);
    setStoredActiveReportId(id);
    router.replace(`/dashboard?id=${id}`);
  };

  // Update assumptions in active report
  const handleUpdateAssumptions = (newAssumptions: FinancialAssumptions) => {
    const newFinancials = calculateFinancials(currentReport.startupCosts, newAssumptions, currentReport.idea.budget);
    const newScenarios = generateThreeScenarios(currentReport.startupCosts, newAssumptions, currentReport.idea.budget);
    const newFeasibility = evaluateFeasibility(newFinancials, currentReport.idea.budget, currentReport.idea.businessType);

    const updatedReport: FullBusinessReport = {
      ...currentReport,
      financialAssumptions: newAssumptions,
      calculatedFinancials: newFinancials,
      scenarios: newScenarios,
      feasibility: newFeasibility
    };

    const nextReports = { ...allReports, [updatedReport.idea.id]: updatedReport };
    setAllReports(nextReports);
    saveReportsToStorage(nextReports);
  };

  // Update startup costs in active report
  const handleUpdateStartupCosts = (newCosts: StartupCostItem[]) => {
    const newFinancials = calculateFinancials(newCosts, currentReport.financialAssumptions, currentReport.idea.budget);
    const newScenarios = generateThreeScenarios(newCosts, currentReport.financialAssumptions, currentReport.idea.budget);
    const newFeasibility = evaluateFeasibility(newFinancials, currentReport.idea.budget, currentReport.idea.businessType);

    const updatedReport: FullBusinessReport = {
      ...currentReport,
      startupCosts: newCosts,
      calculatedFinancials: newFinancials,
      scenarios: newScenarios,
      feasibility: newFeasibility
    };

    const nextReports = { ...allReports, [updatedReport.idea.id]: updatedReport };
    setAllReports(nextReports);
    saveReportsToStorage(nextReports);
  };

  // Apply changes from What-If Simulator or AI Assistant
  const handleApplySimulatorToMaster = (newAssumptions: Partial<FinancialAssumptions> & { budget?: number }, newBudget?: number) => {
    const mergedAssumptions = { ...currentReport.financialAssumptions, ...newAssumptions };
    delete (mergedAssumptions as any).budget;

    const mergedBudget = newBudget !== undefined ? newBudget : (newAssumptions.budget !== undefined ? newAssumptions.budget : currentReport.idea.budget);

    const newFinancials = calculateFinancials(currentReport.startupCosts, mergedAssumptions, mergedBudget);
    const newScenarios = generateThreeScenarios(currentReport.startupCosts, mergedAssumptions, mergedBudget);
    const newFeasibility = evaluateFeasibility(newFinancials, mergedBudget, currentReport.idea.businessType);

    const updatedReport: FullBusinessReport = {
      ...currentReport,
      idea: { ...currentReport.idea, budget: mergedBudget },
      financialAssumptions: mergedAssumptions,
      calculatedFinancials: newFinancials,
      scenarios: newScenarios,
      feasibility: newFeasibility
    };

    const nextReports = { ...allReports, [updatedReport.idea.id]: updatedReport };
    setAllReports(nextReports);
    saveReportsToStorage(nextReports);
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* 1. Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'reports') {
              setIsReportModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          savedBusinessCount={Object.keys(allReports).length}
          onOpenAssistantDrawer={() => setIsAssistantOpen(true)}
        />
      </div>

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNav
          currentReport={currentReport}
          allReports={allReports}
          onSelectBusiness={handleSelectBusiness}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onNewIdeaClick={() => router.push('/analyze')}
        />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Banner - Business Feasibility Analysis */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Business Feasibility Analysis
                </span>
                <span className="text-xs text-slate-400">
                  {currentReport.idea.industry}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentReport.idea.businessType}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>{currentReport.idea.location.city}, {currentReport.idea.location.state}</strong>
                </span>
                <span>•</span>
                <span>
                  Allocated Capital: <strong className="text-slate-900 dark:text-white font-bold">{formatINR(currentReport.idea.budget)}</strong>
                </span>
                <span>•</span>
                <span>
                  Model: <strong className="text-slate-900 dark:text-white font-bold">{currentReport.idea.businessModel}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Business Report</span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {(activeTab === 'overview' || activeTab === 'ideas') && (
            <div className="space-y-6">
              {/* Visible System Architecture & Product Philosophy Banner (Requirement 20) */}
              <HowItWorksBanner />

              {/* 6 Metric Overview Cards with Strict Data Classification & Source Transparency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
                <MetricCard
                  title="Startup Cost"
                  value={formatINR(currentReport.calculatedFinancials.totalStartupCost, { compact: true })}
                  subtitle={`Budget: ${formatINR(currentReport.idea.budget, { compact: true })}`}
                  classification="CALCULATED"
                  showEstimated={false}
                  highlight="slate"
                  icon={<DollarSign className="w-4 h-4 text-slate-600" />}
                  whyThisNumberData={
                    currentReport.calculatedFinancials.auditTraces?.totalStartupCost ? {
                      title: 'Startup Cost Calculation',
                      metricValue: formatINR(currentReport.calculatedFinancials.totalStartupCost),
                      classification: 'CALCULATED',
                      formula: currentReport.calculatedFinancials.auditTraces.totalStartupCost.calculationFormula,
                      underlyingAssumptions: currentReport.calculatedFinancials.auditTraces.totalStartupCost.underlyingAssumptions,
                      sourceName: currentReport.calculatedFinancials.auditTraces.totalStartupCost.source,
                      collectedAt: currentReport.calculatedFinancials.auditTraces.totalStartupCost.collectedAt
                    } : undefined
                  }
                  onEditAssumption={() => setIsAssumptionsModalOpen(true)}
                />

                <MetricCard
                  title="Monthly Revenue"
                  value={formatINR(currentReport.calculatedFinancials.monthlyRevenue, { compact: true })}
                  subtitle={`${currentReport.calculatedFinancials.monthlyUnits.toLocaleString()} units / month`}
                  classification="CALCULATED"
                  showEstimated={false}
                  highlight="emerald"
                  trend={{ value: `+${currentReport.financialAssumptions.customerGrowthMonthlyPct}% mo`, isPositive: true }}
                  icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
                  whyThisNumberData={
                    currentReport.calculatedFinancials.auditTraces?.monthlyRevenue ? {
                      title: 'Monthly Revenue Calculation',
                      metricValue: formatINR(currentReport.calculatedFinancials.monthlyRevenue),
                      classification: 'CALCULATED',
                      formula: currentReport.calculatedFinancials.auditTraces.monthlyRevenue.calculationFormula,
                      underlyingAssumptions: currentReport.calculatedFinancials.auditTraces.monthlyRevenue.underlyingAssumptions,
                      sourceName: currentReport.calculatedFinancials.auditTraces.monthlyRevenue.source,
                      collectedAt: currentReport.calculatedFinancials.auditTraces.monthlyRevenue.collectedAt
                    } : undefined
                  }
                  onEditAssumption={() => setIsAssumptionsModalOpen(true)}
                />

                <MetricCard
                  title="Monthly Expenses"
                  value={formatINR(currentReport.calculatedFinancials.monthlyTotalCost, { compact: true })}
                  subtitle={`Fixed: ${formatINR(currentReport.calculatedFinancials.monthlyFixedCost, { compact: true })}`}
                  classification="CALCULATED"
                  showEstimated={false}
                  highlight="slate"
                  icon={<Wallet className="w-4 h-4 text-rose-500" />}
                  whyThisNumberData={
                    currentReport.calculatedFinancials.auditTraces?.monthlyTotalCost ? {
                      title: 'Monthly Operating Costs Calculation',
                      metricValue: formatINR(currentReport.calculatedFinancials.monthlyTotalCost),
                      classification: 'CALCULATED',
                      formula: currentReport.calculatedFinancials.auditTraces.monthlyTotalCost.calculationFormula,
                      underlyingAssumptions: currentReport.calculatedFinancials.auditTraces.monthlyTotalCost.underlyingAssumptions,
                      sourceName: currentReport.calculatedFinancials.auditTraces.monthlyTotalCost.source,
                      collectedAt: currentReport.calculatedFinancials.auditTraces.monthlyTotalCost.collectedAt
                    } : undefined
                  }
                  onEditAssumption={() => setIsAssumptionsModalOpen(true)}
                />

                <MetricCard
                  title="Operating Profit"
                  value={formatINR(currentReport.calculatedFinancials.operatingProfit, { compact: true })}
                  subtitle={`${currentReport.calculatedFinancials.operatingMarginPct}% EBITDA margin`}
                  classification="CALCULATED"
                  showEstimated={false}
                  highlight="emerald"
                  icon={<Building2 className="w-4 h-4 text-emerald-600" />}
                  whyThisNumberData={
                    currentReport.calculatedFinancials.auditTraces?.operatingProfit ? {
                      title: 'Operating Profit (EBITDA) Calculation',
                      metricValue: formatINR(currentReport.calculatedFinancials.operatingProfit),
                      classification: 'CALCULATED',
                      formula: currentReport.calculatedFinancials.auditTraces.operatingProfit.calculationFormula,
                      underlyingAssumptions: currentReport.calculatedFinancials.auditTraces.operatingProfit.underlyingAssumptions,
                      sourceName: currentReport.calculatedFinancials.auditTraces.operatingProfit.source,
                      collectedAt: currentReport.calculatedFinancials.auditTraces.operatingProfit.collectedAt
                    } : undefined
                  }
                  onEditAssumption={() => setIsAssumptionsModalOpen(true)}
                />

                <MetricCard
                  title="Break-even"
                  value={currentReport.calculatedFinancials.breakEvenMonths ? `${currentReport.calculatedFinancials.breakEvenMonths} mos` : 'N/A'}
                  subtitle={`${currentReport.calculatedFinancials.breakEvenUnitsMonthly.toLocaleString()} units/mo`}
                  classification="CALCULATED"
                  showEstimated={false}
                  highlight="blue"
                  icon={<Clock className="w-4 h-4 text-blue-600" />}
                  whyThisNumberData={
                    currentReport.calculatedFinancials.auditTraces?.breakEvenUnitsMonthly ? {
                      title: 'Break-Even Units Calculation',
                      metricValue: `${currentReport.calculatedFinancials.breakEvenUnitsMonthly.toLocaleString()} units/mo`,
                      classification: 'CALCULATED',
                      formula: currentReport.calculatedFinancials.auditTraces.breakEvenUnitsMonthly.calculationFormula,
                      underlyingAssumptions: currentReport.calculatedFinancials.auditTraces.breakEvenUnitsMonthly.underlyingAssumptions,
                      sourceName: currentReport.calculatedFinancials.auditTraces.breakEvenUnitsMonthly.source,
                      collectedAt: currentReport.calculatedFinancials.auditTraces.breakEvenUnitsMonthly.collectedAt
                    } : undefined
                  }
                  onEditAssumption={() => setIsAssumptionsModalOpen(true)}
                />

                <MetricCard
                  title="Working Capital"
                  value={currentReport.calculatedFinancials.workingCapitalAdequacy}
                  subtitle={`${currentReport.calculatedFinancials.runwayMonthsWithBudget} mos runway`}
                  classification="CALCULATED"
                  showEstimated={false}
                  highlight={currentReport.calculatedFinancials.workingCapitalAdequacy === 'Sufficient' ? 'emerald' : 'amber'}
                  icon={<ShieldCheck className="w-4 h-4 text-teal-600" />}
                />
              </div>

              {/* Feasibility Overview Scorecard & Transparent Rules */}
              <FeasibilityScorecard
                scorecard={currentReport.feasibility}
                onOpenAssumptions={() => setIsAssumptionsModalOpen(true)}
              />

              {/* Key Assumptions Card with Modal Editor */}
              <KeyAssumptionsCard
                assumptions={currentReport.financialAssumptions}
                financials={currentReport.calculatedFinancials}
                onUpdateAssumptions={handleUpdateAssumptions}
                isExternalOpen={isAssumptionsModalOpen}
                onCloseExternal={() => setIsAssumptionsModalOpen(false)}
              />

              {/* Charts Grid: Break-even Curve & Cash Flow Trajectory */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BreakEvenChart
                  assumptions={currentReport.financialAssumptions}
                  financials={currentReport.calculatedFinancials}
                />
                <RevenueExpensesChart
                  financials={currentReport.calculatedFinancials}
                  assumptions={currentReport.financialAssumptions}
                />
              </div>

              {/* Charts Grid 2: Capital Allocation Donut & 3 Scenarios Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <CostBreakdownPie startupCosts={currentReport.startupCosts} />
                </div>
                <div className="lg:col-span-2">
                  <ScenarioComparisonChart scenarios={currentReport.scenarios} />
                </div>
              </div>

              {/* Interactive What-If Simulator Section in Overview */}
              <div>
                <WhatIfSimulator
                  initialAssumptions={currentReport.financialAssumptions}
                  startupCosts={currentReport.startupCosts}
                  initialBudget={currentReport.idea.budget}
                  onApplyModifiedToMaster={handleApplySimulatorToMaster}
                />
              </div>
            </div>
          )}

          {/* TAB: LOCALITY INTELLIGENCE */}
          {activeTab === 'locality' && currentLocality && (
            <LocalityIntelligenceSection
              locality={currentLocality}
              categoryProfile={currentCategoryProfile}
              locationComparison={currentLocationComparison}
              businessType={currentReport.idea.businessType}
              city={currentReport.idea.location.city}
            />
          )}

          {/* TAB 2: MARKET ANALYSIS */}
          {activeTab === 'market' && (
            <MarketAnalysisSection
              market={currentReport.marketAnalysis}
              city={currentReport.idea.location.city}
              businessType={currentReport.idea.businessType}
            />
          )}

          {/* TAB 3: COMPETITORS */}
          {activeTab === 'competitors' && (
            <CompetitorTable
              competitors={currentReport.competitors}
              city={currentReport.idea.location.city}
            />
          )}

          {/* TAB 4: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <UnitEconomicsCard
                assumptions={currentReport.financialAssumptions}
                financials={currentReport.calculatedFinancials}
              />
              <StartupCostEditor
                startupCosts={currentReport.startupCosts}
                userBudget={currentReport.idea.budget}
                onUpdateCosts={handleUpdateStartupCosts}
              />
              <PLStatementTable
                financials={currentReport.calculatedFinancials}
                assumptions={currentReport.financialAssumptions}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BreakEvenChart
                  assumptions={currentReport.financialAssumptions}
                  financials={currentReport.calculatedFinancials}
                />
                <CostBreakdownPie startupCosts={currentReport.startupCosts} />
              </div>
            </div>
          )}

          {/* TAB 5: WHAT-IF SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <WhatIfSimulator
                initialAssumptions={currentReport.financialAssumptions}
                startupCosts={currentReport.startupCosts}
                initialBudget={currentReport.idea.budget}
                onApplyModifiedToMaster={handleApplySimulatorToMaster}
              />
              <ScenarioComparisonChart scenarios={currentReport.scenarios} />
            </div>
          )}

          {/* TAB 6: RISKS */}
          {activeTab === 'risks' && (
            <RiskMatrix risks={currentReport.risks} />
          )}

          {/* TAB 7: COMPLIANCE */}
          {activeTab === 'compliance' && (
            <ComplianceChecklist
              compliance={currentReport.compliance}
              businessType={currentReport.idea.businessType}
              locationName={currentReport.idea.location.city}
            />
          )}

          {/* TAB 8: ROADMAP */}
          {activeTab === 'roadmap' && (
            <RoadmapTimeline
              roadmap={currentReport.roadmap}
              businessType={currentReport.idea.businessType}
            />
          )}

          {/* TAB 9: SOURCES & ASSUMPTIONS */}
          {activeTab === 'sources' && (
            <SourcesAndAssumptionsTable sources={currentReport.sourcesAndAssumptions} />
          )}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Platform Settings & Environment Configurations
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">
                    AI Service Provider
                  </span>
                  <p className="text-slate-500 mb-2">
                    Connect Gemini 1.5 Flash or OpenAI API keys in <code>.env.local</code>. When unset, Startup Sheild uses its integrated offline heuristic model.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Heuristic + Modular API Ready
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">
                    Database & Storage Engine
                  </span>
                  <p className="text-slate-500 mb-2">
                    Saved reports persist in browser LocalStorage. Full PostgreSQL/Supabase RLS schema ready in <code>lib/database/schema.sql</code>.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      LocalStorage Active (Multi-Idea Enabled)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI Business Assistant Slide-Out Drawer */}
      <AIAssistantDrawer
        report={currentReport}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onApplyAssistantAction={handleApplySimulatorToMaster}
      />

      {/* Print-to-PDF Business Feasibility Report Modal */}
      <BusinessReportModal
        report={currentReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Startup Sheild dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
