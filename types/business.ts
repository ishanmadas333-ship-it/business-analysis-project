export type EvidenceDataType = 
  | 'VERIFIED' 
  | 'OBSERVED' 
  | 'CALCULATED' 
  | 'ESTIMATE' 
  | 'USER_INPUT' 
  | 'AI_ASSUMPTION' 
  | 'DEMO';

export type ClassificationType = 
  | 'VERIFIED DATA' 
  | 'USER INPUT' 
  | 'ESTIMATE' 
  | 'AI ASSUMPTION'
  | 'VERIFIED'
  | 'OBSERVED'
  | 'CALCULATED'
  | 'DEMO';

export type FeasibilityLevel = 'Low' | 'Moderate' | 'High';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvidencePoint<T = any> {
  id?: string;
  label?: string;
  value: T;
  dataType: EvidenceDataType;
  source: string;
  sourceUrl?: string;
  collectedAt: string;
  confidence: ConfidenceLevel;
  confidenceReason?: string;
  calculationFormula?: string;
  underlyingAssumptions?: string[];
  isOutdated?: boolean;
}

export interface LocationInfo {
  city: string;
  state: string;
  country: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  neighborhood?: string;
  coordinates?: { lat: number; lng: number };
}

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  rawInput: string;
  createdAt: string;
  updatedAt: string;
  businessType: string;
  industry: string;
  location: LocationInfo;
  budget: number; // in INR
  targetCustomers: string[];
  productOrService: string;
  businessModel: 'B2C' | 'B2B' | 'D2C' | 'B2B2C';
  status: 'draft' | 'analyzing' | 'completed';
}

export interface StartupCostItem {
  id: string;
  category: 
    | 'Equipment & Machinery'
    | 'Premises & Deposit'
    | 'Licenses & Compliance'
    | 'Raw Materials & Inventory'
    | 'Branding & Packaging'
    | 'Marketing & Launch'
    | 'Staff Recruitment & Training'
    | 'Technology & POS'
    | 'Working Capital Reserve'
    | 'Transportation & Logistics'
    | 'Contingency / Miscellaneous';
  name: string;
  amount: number;
  isEditable: boolean;
  classification: ClassificationType;
  evidence?: EvidencePoint<number>;
  sourceNote?: string;
}

export interface FinancialAssumptions {
  sellingPricePerUnit: number;
  unitsSoldPerDay: number;
  operatingDaysPerMonth: number;
  variableCostPerUnit: number;
  monthlyRent: number;
  monthlyStaffCost: number;
  monthlyMarketingCost: number;
  monthlyUtilitiesAndMisc: number;
  customerGrowthMonthlyPct: number;
  taxRatePct: number;
}

export interface CalculatedFinancials {
  totalStartupCost: number;
  monthlyUnits: number;
  monthlyRevenue: number;
  monthlyVariableCost: number;
  monthlyFixedCost: number;
  monthlyTotalCost: number;
  grossProfit: number;
  grossMarginPct: number;
  operatingProfit: number; // EBITDA
  operatingMarginPct: number;
  netProfit: number;
  netMarginPct: number;
  annualRevenue: number;
  annualOperatingProfit: number;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
  breakEvenUnitsMonthly: number;
  breakEvenRevenueMonthly: number;
  breakEvenMonths: number | null; // null if not break-even reachable
  workingCapitalAdequacy: 'Sufficient' | 'Tight' | 'Deficit';
  runwayMonthsWithBudget: number;
  auditTraces?: Record<string, EvidencePoint<number | string>>;
}

export interface ScenarioBreakdown {
  name: 'Conservative' | 'Expected' | 'Growth';
  description: string;
  assumptions: FinancialAssumptions;
  financials: CalculatedFinancials;
}

export interface FeasibilityIndicator {
  dimension: string;
  level: FeasibilityLevel;
  score: number; // 0 - 100
  rationale: string;
  ruleExplanation: string;
}

export interface FeasibilityScorecard {
  marketOpportunity: FeasibilityIndicator;
  financialFeasibility: FeasibilityIndicator;
  competitionIntensity: FeasibilityIndicator;
  operationalComplexity: FeasibilityIndicator;
  regulatoryComplexity: FeasibilityIndicator;
  riskExposure: FeasibilityIndicator;
  overallScore: number;
  verdictSummary: string;
  confidenceScore: number;
}

export interface CustomerSegment {
  name: string;
  sharePct: number;
  painPoints: string;
  willingnessToPay: string;
  acquisitionChannel: string;
}

export interface DemandIndicator {
  indicator: string;
  signal: 'positive' | 'neutral' | 'negative';
  details: string;
  metric?: string;
  evidence?: EvidencePoint<string>;
}

export interface MarketAnalysisData {
  marketSizeDesc: string;
  cagr: string;
  customerSegments: CustomerSegment[];
  demandIndicators: DemandIndicator[];
  seasonalDemand: Array<{ month: string; demandIndex: number }>;
  marketTrends: string[];
  localConsiderations: string[];
  dataSourceClassification: ClassificationType;
  citation: {
    source: string;
    date: string;
    referenceUrl?: string;
  };
}

export interface CompetitorItem {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  category: string;
  priceRange: 'Budget' | 'Mid' | 'Premium';
  customerSegment: string;
  rating: number;
  reviewCount?: number;
  estimatedMonthlyRevenue?: number;
  estimatedAnnualRevenue?: number;
  estimatedMonthlyProfit?: number;
  profitMarginPct?: number;
  operatingCostMonthly?: number;
  rushHours?: string[];
  peakDays?: string[];
  peakSalesSurge?: string;
  costBenefitNotes?: string;
  marketShareEstPct: number;
  strengths: string[];
  weaknesses: string[];
  source: string;
  sourceUrl?: string;
  collectedAt?: string;
  isDemoData: boolean;
  confidence?: ConfidenceLevel;
}

export interface RiskAnalysisItem {
  id: string;
  category: 
    | 'Market Risk'
    | 'Competition Risk'
    | 'Financial Risk'
    | 'Operational Risk'
    | 'Supply Chain Risk'
    | 'Regulatory Risk'
    | 'Customer Acquisition Risk';
  risk: string;
  impact: FeasibilityLevel;
  probability: FeasibilityLevel;
  reason: string;
  mitigation: string;
  observedEvidence?: string;
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  purpose: string;
  issuingAuthority: string;
  estimatedTimeDays: number;
  estimatedCostInr: number;
  status: 'Mandatory Before Launch' | 'Recommended' | 'Post-Incorporation';
  officialSource: string;
  lastVerifiedDate: string;
  isOutdated?: boolean;
}

export interface RoadmapTask {
  id: string;
  text: string;
  completed: boolean;
  department: 'Strategy' | 'Legal' | 'Operations' | 'Marketing' | 'Tech';
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  focus: string;
  tasks: RoadmapTask[];
}

export interface NearbyInstitution {
  id: string;
  name: string;
  type: 
    | 'College / University' 
    | 'Tech Park / Office' 
    | 'Hospital / Clinic' 
    | 'Gym' 
    | 'Hostel / PG' 
    | 'Metro Station / Bus Terminal' 
    | 'Shopping Mall';
  distanceKm: number;
  estimatedFootfallOrCapacity: string;
  address: string;
  source: string;
  collectedAt: string;
}

export interface LocalityEvidenceOpportunity {
  id: string;
  title: string;
  observedFact: string;
  explanation: string;
  confidence: ConfidenceLevel;
}

export interface LocalityEvidenceRisk {
  id: string;
  title: string;
  observedFact: string;
  explanation: string;
  severity: FeasibilityLevel;
}

export interface LocalityIntelligence {
  coordinates: { lat: number; lng: number };
  neighborhood: string;
  residentialCommercialMix: {
    residentialPct: number;
    commercialPct: number;
    studentPct: number;
  };
  footfallCategory: 'High' | 'Moderate' | 'Low';
  accessibility: {
    metroDistanceKm: number;
    busStopDistanceKm: number;
    highwayAccess: string;
  };
  nearbyInstitutions: NearbyInstitution[];
  categoryIndicators: Array<{
    name: string;
    observedValue: string;
    signal: 'positive' | 'neutral' | 'caution';
    rationale: string;
  }>;
  peakActivityHours: string;
  overallLocalityConfidence: {
    level: ConfidenceLevel;
    reason: string;
  };
  evidenceOpportunities: LocalityEvidenceOpportunity[];
  evidenceRisks: LocalityEvidenceRisk[];
  collectedAt: string;
  isSimulatedDemo: boolean;
}

export interface BusinessCategoryProfile {
  categoryKey: 'CAFE' | 'GYM' | 'PHARMACY' | 'PG_HOSTEL' | 'EV_CHARGING' | 'PACKAGED_WATER' | 'SUPERMARKET';
  categoryName: string;
  keyEvidenceMetrics: string[];
  targetFootfallBenchmark: string;
  primaryDemandDrivers: string[];
  typicalCapExRangeINR: { min: number; max: number };
  operationalNuances: string;
}

export interface LocationComparisonOption {
  id: string;
  locationName: string;
  competitorCount: number;
  nearbyCollegesOrOffices: number;
  rentEstimateINR: number;
  demandRating: 'Low' | 'Medium' | 'High';
  footfallCategory: 'Low' | 'Moderate' | 'High';
  keyTradeOff: string;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  collectedAt: string;
}

export interface FullBusinessReport {
  idea: BusinessIdea;
  feasibility: FeasibilityScorecard;
  startupCosts: StartupCostItem[];
  financialAssumptions: FinancialAssumptions;
  calculatedFinancials: CalculatedFinancials;
  scenarios: {
    conservative: ScenarioBreakdown;
    expected: ScenarioBreakdown;
    growth: ScenarioBreakdown;
  };
  marketAnalysis: MarketAnalysisData;
  competitors: CompetitorItem[];
  risks: RiskAnalysisItem[];
  compliance: ComplianceItem[];
  roadmap: RoadmapPhase[];
  localityIntelligence?: LocalityIntelligence;
  categoryProfile?: BusinessCategoryProfile;
  locationComparison?: LocationComparisonOption[];
  sourcesAndAssumptions: Array<{
    item: string;
    value: string;
    classification: ClassificationType;
    rationale: string;
    sourceRef?: string;
    collectedAt?: string;
    confidence?: ConfidenceLevel;
    confidenceReason?: string;
    calculationFormula?: string;
    underlyingAssumptions?: string[];
    isOutdated?: boolean;
  }>;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  evidenceReferences?: Array<{
    metric: string;
    classification: EvidenceDataType;
    source: string;
    formula?: string;
  }>;
  appliedAction?: {
    type: 'UPDATE_SIMULATION' | 'SWITCH_SCENARIO' | 'COST_REDUCTION';
    description: string;
    modifiedAssumptions?: Partial<FinancialAssumptions>;
    modifiedBudget?: number;
  };
}
