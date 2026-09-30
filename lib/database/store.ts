'use client';

import { FullBusinessReport, BusinessIdea, StartupCostItem, FinancialAssumptions } from '@/types/business';
import { packagedWaterReport } from '@/lib/demo/packagedWaterDemo';
import { allDemoReports } from '@/lib/demo/allDemos';
import { calculateFinancials, generateThreeScenarios, evaluateFeasibility } from '@/lib/calculations/financialEngine';
import { getLocalityIntelligence, getLocationComparisonOptions } from '@/lib/locality/localityIntelligenceService';
import { getCategoryProfile } from '@/lib/locality/businessCategoryProfiles';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  savedBusinessCount: number;
}

const STORAGE_KEY_REPORTS = 'startupsheild_saved_reports';
const STORAGE_KEY_ACTIVE = 'startupsheild_active_report_id';
const STORAGE_KEY_USER = 'startupsheild_auth_user';

export function getInitialReports(): Record<string, FullBusinessReport> {
  if (typeof window === 'undefined') {
    return allDemoReports;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS) || localStorage.getItem('venturelens_saved_reports');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return { ...allDemoReports, ...parsed };
      }
    }
  } catch (e) {
    console.error('Failed reading reports from localStorage:', e);
  }
  return allDemoReports;
}

export function saveReportsToStorage(reports: Record<string, FullBusinessReport>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed saving reports to localStorage:', e);
  }
}

export function getStoredActiveReportId(): string {
  if (typeof window === 'undefined') return 'demo-water-hyd-1';
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) || localStorage.getItem('venturelens_active_report_id') || 'demo-water-hyd-1';
  } catch {
    return 'demo-water-hyd-1';
  }
}

export function setStoredActiveReportId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE, id);
  } catch (e) {
    console.error('Failed setting active report id:', e);
  }
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch {
    return null;
  }
  // Default demo user session
  return {
    id: 'usr_demo_founder',
    email: 'founder@startupsheild.ai',
    name: 'Rohit Sharma (Founder)',
    savedBusinessCount: 3
  };
}

export function setStoredUser(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_USER);
  } else {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }
}

/**
 * Creates a brand new business feasibility report dynamically from extracted idea draft parameters.
 */
export function createReportFromDraft(draft: {
  businessType: string;
  industry: string;
  location: { city: string; state: string; country: string; tier: 'Tier 1' | 'Tier 2' | 'Tier 3' };
  budget: number;
  targetCustomers: string[];
  productOrService: string;
  businessModel: 'B2C' | 'B2B' | 'D2C' | 'B2B2C';
  rawInput: string;
}): FullBusinessReport {
  const newId = 'idea-' + Date.now();
  const budget = draft.budget;

  // Calibrate startup costs based on budget
  const equipRatio = 0.55;
  const depositRatio = 0.15;
  const complianceRatio = 0.08;
  const rawRatio = 0.08;
  const reserveRatio = 0.14;

  const startupCosts: StartupCostItem[] = [
    {
      id: `sc-${newId}-1`,
      category: 'Equipment & Machinery',
      name: `${draft.businessType} Core Machinery & Hardware Setup`,
      amount: Math.round(budget * equipRatio),
      isEditable: true,
      classification: 'ESTIMATE',
      sourceNote: `Calibrated baseline for ${draft.businessType} equipment in ${draft.location.city}`
    },
    {
      id: `sc-${newId}-2`,
      category: 'Premises & Deposit',
      name: 'Commercial Space Lease Deposit & Fitout Advance',
      amount: Math.round(budget * depositRatio),
      isEditable: true,
      classification: 'USER INPUT',
      sourceNote: `Standard commercial lease deposit in ${draft.location.city}`
    },
    {
      id: `sc-${newId}-3`,
      category: 'Licenses & Compliance',
      name: 'Statutory Licensing, Trade Registration & FSSAI / GST',
      amount: Math.max(15000, Math.round(budget * complianceRatio)),
      isEditable: true,
      classification: 'VERIFIED DATA',
      sourceNote: 'Government portal statutory registration and legal fee guidelines'
    },
    {
      id: `sc-${newId}-4`,
      category: 'Raw Materials & Inventory',
      name: 'Initial Commercial Inventory & Consumables',
      amount: Math.round(budget * rawRatio),
      isEditable: true,
      classification: 'ESTIMATE',
      sourceNote: 'Initial 30-day operating stock'
    },
    {
      id: `sc-${newId}-5`,
      category: 'Working Capital Reserve',
      name: 'Operating Cash Buffer (First 60 Days)',
      amount: Math.round(budget * reserveRatio),
      isEditable: true,
      classification: 'ESTIMATE',
      sourceNote: 'Prudent working capital reserve before revenue stabilizes'
    }
  ];

  // Calibrated operating assumptions based on business model and budget
  const isB2B = draft.businessModel === 'B2B';
  const unitPrice = isB2B ? 25 : 120;
  const varCost = isB2B ? 11 : 42;
  const dailyUnits = isB2B ? 300 : 45;

  const assumptions: FinancialAssumptions = {
    sellingPricePerUnit: unitPrice,
    unitsSoldPerDay: dailyUnits,
    operatingDaysPerMonth: 26,
    variableCostPerUnit: varCost,
    monthlyRent: Math.round(budget * 0.035),
    monthlyStaffCost: Math.round(budget * 0.075),
    monthlyMarketingCost: Math.round(budget * 0.015),
    monthlyUtilitiesAndMisc: Math.round(budget * 0.025),
    customerGrowthMonthlyPct: 8,
    taxRatePct: 18
  };

  const financials = calculateFinancials(startupCosts, assumptions, budget);
  const scenarios = generateThreeScenarios(startupCosts, assumptions, budget);
  const feasibility = evaluateFeasibility(financials, budget, draft.businessType);

  const idea: BusinessIdea = {
    id: newId,
    title: `${draft.businessType} in ${draft.location.city}`,
    description: `Feasibility analysis and financial deployment plan for ${draft.productOrService} in ${draft.location.city}.`,
    rawInput: draft.rawInput,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    businessType: draft.businessType,
    industry: draft.industry,
    location: draft.location,
    budget,
    targetCustomers: draft.targetCustomers,
    productOrService: draft.productOrService,
    businessModel: draft.businessModel,
    status: 'completed'
  };

  return {
    idea,
    feasibility,
    startupCosts,
    financialAssumptions: assumptions,
    calculatedFinancials: financials,
    scenarios,
    marketAnalysis: {
      ...packagedWaterReport.marketAnalysis,
      marketSizeDesc: `Estimated ₹800–1,200 Cr market for ${draft.businessType} in ${draft.location.city} urban district.`,
      customerSegments: draft.targetCustomers.map((cust, idx) => ({
        name: cust,
        sharePct: idx === 0 ? 50 : Math.round(50 / (draft.targetCustomers.length - 1)),
        painPoints: 'Quality inconsistency, delayed fulfillment, and lack of specialized modern service.',
        willingnessToPay: 'Standard market rates with expectation of premium service.',
        acquisitionChannel: idx % 2 === 0 ? 'Direct B2B Sales & Route Distribution' : 'Digital Ads & Local Google Search'
      }))
    },
    competitors: (() => {
      const isRetail = draft.businessType.toLowerCase().includes('supermarket') || 
                       draft.businessType.toLowerCase().includes('dmart') || 
                       draft.businessType.toLowerCase().includes('grocery') || 
                       draft.businessType.toLowerCase().includes('retail') ||
                       draft.businessType.toLowerCase().includes('mart') ||
                       draft.businessType.toLowerCase().includes('store');
      
      if (isRetail) {
        return [
          {
            id: 'dyn-dmart-1',
            name: `DMart Hypermarket (${draft.location.city} Sector Unit)`,
            location: `${draft.location.city} Main Arterial Corridor`,
            distanceKm: 2.8,
            category: 'National Value Hypermarket',
            priceRange: 'Budget' as const,
            customerSegment: 'Value-conscious families & bulk monthly grocery shoppers',
            rating: 4.5,
            reviewCount: 3850,
            estimatedMonthlyRevenue: 7500000,
            estimatedAnnualRevenue: 90000000,
            operatingCostMonthly: 6375000,
            estimatedMonthlyProfit: 1125000,
            profitMarginPct: 15.0,
            rushHours: ['10:30 AM – 1:00 PM (Morning Groceries)', '6:00 PM – 9:30 PM (Evening Supermarket Rush)'],
            peakDays: ['Friday', 'Saturday', 'Sunday', '1st–5th of Month (Salary Rush)'],
            peakSalesSurge: '+210% checkout footfall spike during weekend evenings and salary week',
            costBenefitNotes: 'Huge purchasing leverage and rock-bottom prices, but suffers from 20+ minute billing queues and parking congestion. A localized express mart wins on quick 5-minute checkout and doorstep quick-commerce.',
            marketShareEstPct: 42,
            strengths: ['Unbeatable bulk pricing', 'Deep staple FMCG inventory', 'Massive brand pull'],
            weaknesses: ['Severe billing queue congestion', 'Lack of neighborhood home-delivery convenience'],
            source: 'Retail Trade Analytics Q1 2026',
            isDemoData: true
          },
          {
            id: 'dyn-dmart-2',
            name: `Reliance Smart Point (${draft.location.city} Branch)`,
            location: `${draft.location.city} Residential Cluster`,
            distanceKm: 1.4,
            category: 'Corporate Mini-Hypermarket',
            priceRange: 'Mid' as const,
            customerSegment: 'Urban apartment dwellers & daily replenishment buyers',
            rating: 4.2,
            reviewCount: 1420,
            estimatedMonthlyRevenue: 3400000,
            estimatedAnnualRevenue: 40800000,
            operatingCostMonthly: 2856000,
            estimatedMonthlyProfit: 544000,
            profitMarginPct: 16.0,
            rushHours: ['11:00 AM – 1:30 PM (Midday Top-up)', '5:30 PM – 9:00 PM (Commuter Ingress)'],
            peakDays: ['Saturday', 'Sunday', 'Wednesday (Midweek promo)'],
            peakSalesSurge: '+140% footfall during evening return-commute slots',
            costBenefitNotes: 'Corporate chain backed by app deliveries, but high employee turnover leads to inconsistent shelf stock. Lean founder-managed store provides personalized credit & curated local items.',
            marketShareEstPct: 25,
            strengths: ['Convenient neighborhood footprint', 'Jio ecosystem tie-ups'],
            weaknesses: ['Inconsistent fresh produce quality', 'Impersonal customer service'],
            source: 'Retail Field Survey',
            isDemoData: true
          },
          {
            id: 'dyn-dmart-3',
            name: `Local Independent Supermart (${draft.location.city})`,
            location: `${draft.location.city} Market Street`,
            distanceKm: 0.8,
            category: 'Regional Independent Retailer',
            priceRange: 'Mid' as const,
            customerSegment: 'Walking-distance local neighborhood households',
            rating: 4.0,
            reviewCount: 680,
            estimatedMonthlyRevenue: 1950000,
            estimatedAnnualRevenue: 23400000,
            operatingCostMonthly: 1618500,
            estimatedMonthlyProfit: 331500,
            profitMarginPct: 17.0,
            rushHours: ['8:30 AM – 10:30 AM (Morning Essentials)', '6:30 PM – 9:30 PM (Dinner Preparation)'],
            peakDays: ['Saturday', 'Sunday'],
            peakSalesSurge: '+115% surge during post-work hours and Sunday mornings',
            costBenefitNotes: 'Close to community, but lacks modern digital POS loyalty, clean aisles, and cold-storage dairy presentation.',
            marketShareEstPct: 18,
            strengths: ['Neighborhood WhatsApp ordering', 'Local language familiarity'],
            weaknesses: ['Poor inventory replenishment software', 'Cluttered aisle layout'],
            source: 'Local Merchant Registry',
            isDemoData: true
          }
        ];
      }

      return packagedWaterReport.competitors.map((c, i) => ({
        ...c,
        id: `dyn-comp-${i}`,
        name: `${c.name} (${draft.location.city} Unit)`,
        location: `${draft.location.city} Commercial Zone`
      }));
    })(),
    risks: packagedWaterReport.risks,
    compliance: packagedWaterReport.compliance,
    roadmap: packagedWaterReport.roadmap,
    localityIntelligence: getLocalityIntelligence(draft.businessType, draft.location.city, `${draft.location.city} Commercial Catchment`),
    categoryProfile: getCategoryProfile(draft.businessType),
    locationComparison: getLocationComparisonOptions(draft.businessType, draft.location.city),
    sourcesAndAssumptions: packagedWaterReport.sourcesAndAssumptions
  };
}
