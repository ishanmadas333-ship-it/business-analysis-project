import { FullBusinessReport } from '@/types/business';
import { packagedWaterReport } from './packagedWaterDemo';
import { calculateFinancials, generateThreeScenarios, evaluateFeasibility } from '@/lib/calculations/financialEngine';

// Specialty Cafe in Jubilee Hills / Gachibowli, Hyderabad (₹10 Lakh)
const cafeStartupCosts = [
  { id: 'c-1', category: 'Equipment & Machinery' as const, name: 'Commercial 2-Group Espresso Machine & Grinder', amount: 280000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'c-2', category: 'Equipment & Machinery' as const, name: 'Under-counter Commercial Refrigerator & Ice Maker', amount: 95000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'c-3', category: 'Premises & Deposit' as const, name: 'Rental Security Deposit (650 sq.ft High-Footfall)', amount: 200000, isEditable: true, classification: 'USER INPUT' as const },
  { id: 'c-4', category: 'Branding & Packaging' as const, name: 'Interior Fitout, Counter Woodwork & Ambient Lighting', amount: 220000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'c-5', category: 'Licenses & Compliance' as const, name: 'FSSAI, GHMC Trade License, Fire NOC & Music License', amount: 35000, isEditable: true, classification: 'VERIFIED DATA' as const },
  { id: 'c-6', category: 'Technology & POS' as const, name: 'Touchscreen POS, KOT Printer & High-Speed Guest Wi-Fi', amount: 28000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'c-7', category: 'Raw Materials & Inventory' as const, name: 'Specialty Arabica Beans, Syrups, Milk, Cups & Bakery', amount: 45000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'c-8', category: 'Working Capital Reserve' as const, name: 'Contingency Cash Buffer (First 60 Days)', amount: 97000, isEditable: true, classification: 'ESTIMATE' as const }
];

const cafeAssumptions = {
  sellingPricePerUnit: 185, // Average order value / cup
  unitsSoldPerDay: 75,      // cups/day
  operatingDaysPerMonth: 30,
  variableCostPerUnit: 48,  // Milk, specialty beans, syrup, paper cup/lid
  monthlyRent: 45000,
  monthlyStaffCost: 52000,  // 2 Baristas + 1 Helper
  monthlyMarketingCost: 12000,
  monthlyUtilitiesAndMisc: 18000,
  customerGrowthMonthlyPct: 10,
  taxRatePct: 5 // Composition GST for standalone restaurant/cafe
};

const cafeBudget = 1000000;
const cafeFin = calculateFinancials(cafeStartupCosts, cafeAssumptions, cafeBudget);
const cafeScenarios = generateThreeScenarios(cafeStartupCosts, cafeAssumptions, cafeBudget);
const cafeFeasibility = evaluateFeasibility(cafeFin, cafeBudget, 'Artisan Café');

export const cafeReport: FullBusinessReport = {
  idea: {
    id: 'demo-cafe-hyd-2',
    title: 'Artisan Specialty Coffee & Work Café',
    description: 'Compact specialty pour-over and espresso bar offering quiet work-friendly seating and artisanal bakery items in Hyderabad tech corridor.',
    rawInput: 'I want to start a specialty café in Hyderabad with ₹10 lakh focusing on young professionals, remote workers and specialty coffee lovers.',
    createdAt: '2026-03-30T10:00:00Z',
    updatedAt: '2026-03-30T10:00:00Z',
    businessType: 'Specialty Café',
    industry: 'Food & Beverage / Hospitality',
    location: { city: 'Hyderabad', state: 'Telangana', country: 'India', tier: 'Tier 1' },
    budget: cafeBudget,
    targetCustomers: ['Remote Tech Professionals', 'College Students', 'Coffee Connoisseurs', 'Freelancers'],
    productOrService: 'Single-Origin Brews, Artisan Espresso, Croissants, and Work Desk Passes',
    businessModel: 'B2C',
    status: 'completed'
  },
  feasibility: cafeFeasibility,
  startupCosts: cafeStartupCosts,
  financialAssumptions: cafeAssumptions,
  calculatedFinancials: cafeFin,
  scenarios: cafeScenarios,
  marketAnalysis: {
    marketSizeDesc: 'Rapidly expanding Indian third-wave coffee market growing at 19% CAGR, driven by Gen-Z and millennial taste evolution.',
    cagr: '19.4% (2024–2029)',
    dataSourceClassification: 'ESTIMATE',
    citation: { source: 'India Specialty Coffee Association Research', date: 'January 2026' },
    customerSegments: [
      { name: 'Remote Tech Workers', sharePct: 50, painPoints: 'Noisy homes, poor Wi-Fi, need good coffee & reliable power sockets.', willingnessToPay: '₹200-350 per ticket', acquisitionChannel: 'Instagram reels, Google Maps Local SEO' },
      { name: 'Social Catchups & Dates', sharePct: 35, painPoints: 'Generic franchise cafes lack aesthetic atmosphere.', willingnessToPay: '₹300-500 ticket', acquisitionChannel: 'Aesthetic interior ambiance & influencer reviews' },
      { name: 'Grab-and-Go Morning Commuters', sharePct: 15, painPoints: 'Slow service queues.', willingnessToPay: '₹140-180 ticket', acquisitionChannel: 'Quick takeaway counter on arterial road' }
    ],
    demandIndicators: [
      { indicator: 'Hybrid Work Culture in HITEC City', signal: 'positive', details: 'Mid-week remote work schedules drive sustained afternoon cafe table occupancy.', metric: '72% weekday occupancy' },
      { indicator: 'Specialty Coffee Awareness', signal: 'positive', details: 'Surge in preference for light/medium roasts over dark chicory blends.', metric: '+42% YoY' }
    ],
    seasonalDemand: [
      { month: 'Jan', demandIndex: 110 }, { month: 'Feb', demandIndex: 115 }, { month: 'Mar', demandIndex: 95 },
      { month: 'Apr', demandIndex: 85 }, { month: 'May', demandIndex: 80 }, { month: 'Jun', demandIndex: 90 },
      { month: 'Jul', demandIndex: 105 }, { month: 'Aug', demandIndex: 100 }, { month: 'Sep', demandIndex: 105 },
      { month: 'Oct', demandIndex: 115 }, { month: 'Nov', demandIndex: 125 }, { month: 'Dec', demandIndex: 135 }
    ],
    marketTrends: ['Rise of oat/almond milk customization', 'Emphasis on origin transparency (Araku, Coorg estates)'],
    localConsiderations: ['Jubilee Hills/Madhapur footfall is dense on weekends, but steep commercial rents require rigorous seat-turnover management.']
  },
  competitors: [
    {
      id: 'cc-1',
      name: 'Third Wave Coffee (Franchise Outlet)',
      location: 'Jubilee Hills Rd 36',
      distanceKm: 1.2,
      category: 'VC-funded Chain',
      priceRange: 'Premium',
      customerSegment: 'Upper-middle class youth',
      rating: 4.5,
      reviewCount: 2180,
      estimatedMonthlyRevenue: 1850000,
      estimatedAnnualRevenue: 22200000,
      operatingCostMonthly: 1443000,
      estimatedMonthlyProfit: 407000,
      profitMarginPct: 22.0,
      rushHours: ['8:30 AM – 11:00 AM (Morning Work Rush)', '4:30 PM – 8:30 PM (Evening Catchups)'],
      peakDays: ['Friday', 'Saturday', 'Sunday'],
      peakSalesSurge: '+180% footfall surge during weekend evenings and remote-worker afternoon slots',
      costBenefitNotes: 'High brand recall and app loyalty, but exorbitant prime street rent (₹1.8L/mo). A boutique specialty kiosk can capture higher net margin with lower fixed capex.',
      marketShareEstPct: 40,
      strengths: ['Heavy app loyalty program', 'Prime real estate'],
      weaknesses: ['High prices', 'Commercialized crowded environment'],
      source: 'Zomato/Google Maps',
      isDemoData: true
    },
    {
      id: 'cc-2',
      name: 'Roastery Coffee House',
      location: 'Banjara Hills',
      distanceKm: 3.5,
      category: 'Legacy Artisan Icon',
      priceRange: 'Premium',
      customerSegment: 'Coffee purists & foodies',
      rating: 4.7,
      reviewCount: 3840,
      estimatedMonthlyRevenue: 3100000,
      estimatedAnnualRevenue: 37200000,
      operatingCostMonthly: 2356000,
      estimatedMonthlyProfit: 744000,
      profitMarginPct: 24.0,
      rushHours: ['11:30 AM – 2:30 PM (Brunch Surge)', '5:00 PM – 9:30 PM (Evening Dining & Coffee)'],
      peakDays: ['Saturday', 'Sunday'],
      peakSalesSurge: '+220% table occupancy with 45+ min wait times on weekends',
      costBenefitNotes: 'Enjoys premier dining AOV (₹650 per table). Overflow waiting crowds on weekends can be targeted by adjacent boutique café concepts.',
      marketShareEstPct: 30,
      strengths: ['Iconic heritage bungalow setting', 'Signature cascara brew'],
      weaknesses: ['Long weekend wait times (45+ mins)'],
      source: 'Local Dining Reviews',
      isDemoData: true
    }
  ],
  risks: [
    { id: 'cr-1', category: 'Financial Risk', risk: 'High Fixed Rent Overhead', impact: 'High', probability: 'High', reason: 'Prime retail real estate requires ₹45,000+ monthly commitment regardless of footfall.', mitigation: 'Negotiate revenue-share lease structure or pick high-density second-tier lane.' },
    { id: 'cr-2', category: 'Operational Risk', risk: 'Trained Barista Attrition', impact: 'Moderate', probability: 'High', reason: 'Skilled baristas frequently get poached by large chains.', mitigation: 'Provide skill certification incentives and performance revenue bonuses.' }
  ],
  compliance: [
    { id: 'ccmp-1', requirement: 'FSSAI State Food License', purpose: 'Mandatory food service hygiene and kitchen compliance', issuingAuthority: 'FSSAI Telangana', estimatedTimeDays: 20, estimatedCostInr: 5000, status: 'Mandatory Before Launch', officialSource: 'https://foscos.fssai.gov.in', lastVerifiedDate: 'Jan 2026' },
    { id: 'ccmp-2', requirement: 'GHMC Health & Trade License', purpose: 'Municipal health hygiene license', issuingAuthority: 'GHMC', estimatedTimeDays: 15, estimatedCostInr: 6500, status: 'Mandatory Before Launch', officialSource: 'GHMC Portal', lastVerifiedDate: 'Jan 2026' }
  ],
  roadmap: packagedWaterReport.roadmap,
  sourcesAndAssumptions: [
    { item: 'Commercial Espresso Machine', value: '₹2,80,000', classification: 'ESTIMATE', rationale: 'Nuova Simonelli Appia Life 2-Group quotation from verified dealer.' },
    { item: 'Average Ticket Price', value: '₹185', classification: 'ESTIMATE', rationale: 'Blended average of cappuccino, cold brew, and companion croissant.' }
  ]
};

// EV Charging Station in Bengaluru (₹15 Lakh)
const evStartupCosts = [
  { id: 'ev-1', category: 'Equipment & Machinery' as const, name: '60kW Dual-Gun DC Fast Charger (CCS2)', amount: 750000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'ev-2', category: 'Equipment & Machinery' as const, name: '22kW AC Type-2 Dual Charger', amount: 140000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'ev-3', category: 'Premises & Deposit' as const, name: 'Commercial Land Lease Deposit & Civil Canopy Bay', amount: 250000, isEditable: true, classification: 'USER INPUT' as const },
  { id: 'ev-4', category: 'Technology & POS' as const, name: 'BESCOM 100kVA Transformer, Metering & Grid Connection', amount: 180000, isEditable: true, classification: 'VERIFIED DATA' as const },
  { id: 'ev-5', category: 'Technology & POS' as const, name: 'OCPP 1.6J Cloud CMS Software & RFID / QR Payment Integration', amount: 35000, isEditable: true, classification: 'ESTIMATE' as const },
  { id: 'ev-6', category: 'Working Capital Reserve' as const, name: 'Electricity Security Deposit & Operating Liquidity Buffer', amount: 145000, isEditable: true, classification: 'ESTIMATE' as const }
];

const evAssumptions = {
  sellingPricePerUnit: 21.00, // ₹ per kWh billed to EV owner
  unitsSoldPerDay: 240,       // kWh dispensed per day (across 8-10 fast charges)
  operatingDaysPerMonth: 30,
  variableCostPerUnit: 9.50,  // BESCOM commercial EV tariff / kWh + transmission losses
  monthlyRent: 22000,         // Revenue share / parking bay rental
  monthlyStaffCost: 15000,    // Part-time security & customer attendant
  monthlyMarketingCost: 6000, // Listing on PlugShare, Google Maps, Statiq network
  monthlyUtilitiesAndMisc: 11000, // Cloud CMS subscription, maintenance SLA, lighting
  customerGrowthMonthlyPct: 12,
  taxRatePct: 18
};

const evBudget = 1500000;
const evFin = calculateFinancials(evStartupCosts, evAssumptions, evBudget);
const evScenarios = generateThreeScenarios(evStartupCosts, evAssumptions, evBudget);
const evFeasibility = evaluateFeasibility(evFin, evBudget, 'EV Charging Station');

export const evChargingReport: FullBusinessReport = {
  idea: {
    id: 'demo-ev-blr-3',
    title: 'Dual-Gun 60kW DC Fast EV Charging Hub',
    description: 'Commercial high-power EV charging station located near tech parks and highway corridors in Outer Ring Road / Whitefield, Bengaluru.',
    rawInput: 'I want to start a commercial EV charging station in Bengaluru with ₹15 lakh targeting cab aggregators, private EV owners and delivery fleets.',
    createdAt: '2026-03-30T10:00:00Z',
    updatedAt: '2026-03-30T10:00:00Z',
    businessType: 'EV Charging Infrastructure',
    industry: 'CleanTech / Energy & Mobility',
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', tier: 'Tier 1' },
    budget: evBudget,
    targetCustomers: ['Commercial EV Cabs (BluSmart, Uber)', 'Private EV Commuters', 'Last-Mile Delivery Fleets'],
    productOrService: 'High-speed 60kW DC Fast Charging & 22kW AC Destination Charging',
    businessModel: 'B2C',
    status: 'completed'
  },
  feasibility: evFeasibility,
  startupCosts: evStartupCosts,
  financialAssumptions: evAssumptions,
  calculatedFinancials: evFin,
  scenarios: evScenarios,
  marketAnalysis: {
    marketSizeDesc: 'Bengaluru leads India in EV registration density with over 350,000 active electric 2W/4W vehicles in 2026.',
    cagr: '31.5% (2024–2030)',
    dataSourceClassification: 'VERIFIED DATA',
    citation: { source: 'Karnataka EV Policy Assessment & Vahan Dashboard 2026', date: 'February 2026' },
    customerSegments: [
      { name: 'Commercial Fleets (BluSmart, Uber)', sharePct: 55, painPoints: 'Long charging queues during peak shifts; high downtime cost.', willingnessToPay: '₹19-21/kWh for rapid DC top-up', acquisitionChannel: 'Corporate fleet B2B charging contracts' },
      { name: 'Private 4W EV Owners (Nexon, ZS EV)', sharePct: 35, painPoints: 'Range anxiety, broken chargers, bad app UX.', willingnessToPay: '₹22-25/kWh with clean lounge waiting bay', acquisitionChannel: 'PlugShare & Statiq network listings' },
      { name: 'Electric Delivery 3W (Zypp, Euler)', sharePct: 10, painPoints: 'Night-time bulk slow charge availability.', willingnessToPay: '₹16-18/kWh off-peak overnight', acquisitionChannel: 'Logistics hub tie-ups' }
    ],
    demandIndicators: [
      { indicator: 'Bengaluru EV Penetration', signal: 'positive', details: '18% of newly registered commercial 4W vehicles are fully electric.', metric: '18% fleet share' },
      { indicator: 'BESCOM Concessional EV Tariff', signal: 'positive', details: 'Government subsidizes EV commercial charging input electricity at ~₹7.50-₹9.50/unit.', metric: 'Subsidized Input' }
    ],
    seasonalDemand: [
      { month: 'Jan', demandIndex: 100 }, { month: 'Feb', demandIndex: 100 }, { month: 'Mar', demandIndex: 105 },
      { month: 'Apr', demandIndex: 110 }, { month: 'May', demandIndex: 110 }, { month: 'Jun', demandIndex: 100 },
      { month: 'Jul', demandIndex: 98 }, { month: 'Aug', demandIndex: 98 }, { month: 'Sep', demandIndex: 102 },
      { month: 'Oct', demandIndex: 105 }, { month: 'Nov', demandIndex: 105 }, { month: 'Dec', demandIndex: 108 }
    ],
    marketTrends: ['Integration of solar rooftop generation to slash grid electricity costs', 'Shift toward CCS2 high-amperage liquid-cooled connectors'],
    localConsiderations: ['BESCOM grid sanctioning timeline takes 30-45 days; dedicated commercial earthing pit is mandatory.']
  },
  competitors: [
    {
      id: 'evc-1',
      name: 'Jio-bp pulse Station',
      location: 'Bellandur ORR',
      distanceKm: 2.1,
      category: 'National Oil Major EV Arm',
      priceRange: 'Mid',
      customerSegment: 'Mass EV drivers',
      rating: 4.2,
      reviewCount: 640,
      estimatedMonthlyRevenue: 780000,
      estimatedAnnualRevenue: 9360000,
      operatingCostMonthly: 561600,
      estimatedMonthlyProfit: 218400,
      profitMarginPct: 28.0,
      rushHours: ['2:00 PM – 4:00 PM (Fleet Driver Shift Change)', '10:30 PM – 2:00 AM (Night Fleet Charge)'],
      peakDays: ['Monday', 'Thursday', 'Friday'],
      peakSalesSurge: '+135% fast-charger utilization during fleet shift transitions',
      costBenefitNotes: 'Leverages petrol pump real estate. Independent hubs can win on dedicated driver lounge amenities and zero ICE car parking blockage.',
      marketShareEstPct: 35,
      strengths: ['Prime petrol pump footfall', 'Reliable power backup'],
      weaknesses: ['Frequent ICE car parking encroachment (ICE-ing)'],
      source: 'PlugShare App',
      isDemoData: true
    },
    {
      id: 'evc-2',
      name: 'Tata Power EZ Charge',
      location: 'Whitefield Main Rd',
      distanceKm: 3.4,
      category: 'Automotive Pioneer',
      priceRange: 'Premium',
      customerSegment: 'Tata EV fleet drivers',
      rating: 4.0,
      reviewCount: 890,
      estimatedMonthlyRevenue: 920000,
      estimatedAnnualRevenue: 11040000,
      operatingCostMonthly: 680800,
      estimatedMonthlyProfit: 239200,
      profitMarginPct: 26.0,
      rushHours: ['6:00 PM – 9:30 PM (Commuter Highway Top-up)', '11:00 AM – 1:30 PM (Corporate Midday Top-up)'],
      peakDays: ['Friday', 'Saturday', 'Sunday'],
      peakSalesSurge: '+160% weekend getaway highway charging queue',
      costBenefitNotes: 'Integrated into vehicle telematics, but app payment gateway drop-offs yield frustrated drivers seeking reliable plug-and-charge alternative.',
      marketShareEstPct: 30,
      strengths: ['Integrated in Tata vehicle dashboards'],
      weaknesses: ['App payment gateway timeouts reported'],
      source: 'Public EV forums',
      isDemoData: true
    }
  ],
  risks: [
    { id: 'evr-1', category: 'Operational Risk', risk: 'Grid Transformer Tripping or Voltage Fluctuations', impact: 'High', probability: 'Moderate', reason: 'Sudden 60kW load draw can trip local substation breakers if dedicated feeder isn’t secured.', mitigation: 'Install industrial surge protector and automatic changeover relay with BESCOM sanction.' }
  ],
  compliance: [
    { id: 'evcmp-1', requirement: 'CEA Central Electricity Authority Safety Certification', purpose: 'Mandatory electrical safety inspection for high-voltage DC chargers', issuingAuthority: 'Chief Electrical Inspector to Government (CEIG) Karnataka', estimatedTimeDays: 30, estimatedCostInr: 12000, status: 'Mandatory Before Launch', officialSource: 'https://cea.nic.in', lastVerifiedDate: 'Jan 2026' }
  ],
  roadmap: packagedWaterReport.roadmap,
  sourcesAndAssumptions: [
    { item: '60kW Dual DC Fast Charger Cost', value: '₹7,50,000', classification: 'ESTIMATE', rationale: 'Quoted by Exicom / Delta Electronics OEM dealer in Bengaluru.' },
    { item: 'BESCOM Tariff Rate', value: '₹9.50 / kWh', classification: 'VERIFIED DATA', rationale: 'Official Karnataka Electricity Regulatory Commission (KERC) EV charging tariff schedule.' }
  ]
};

export const allDemoReports: Record<string, FullBusinessReport> = {
  'packaged-water': packagedWaterReport,
  'specialty-cafe': cafeReport,
  'ev-charging': evChargingReport
};
