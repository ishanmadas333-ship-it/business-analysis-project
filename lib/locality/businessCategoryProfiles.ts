import { BusinessCategoryProfile } from '@/types/business';

export const BUSINESS_CATEGORY_PROFILES: Record<string, BusinessCategoryProfile> = {
  CAFE: {
    categoryKey: 'CAFE',
    categoryName: 'Café & Beverage Bar',
    keyEvidenceMetrics: [
      'Student Population within 1.5km',
      'Corporate Office Desks & Co-working Nodes',
      'Pedestrian Evening Footfall Velocity',
      'Nearby Competing Cafés & Chain Franchises',
      'Average Order Value (AOV) Tolerance',
      'Peak Afternoon/Evening Table Turnover Rate'
    ],
    targetFootfallBenchmark: '600–1,200 pedestrians/hr during 4:00 PM – 9:00 PM',
    primaryDemandDrivers: [
      'Colleges & coaching institutes within walking radius',
      'Remote tech workers requiring stable Wi-Fi and power outlets',
      'Social date & catchup dining ambiance preference'
    ],
    typicalCapExRangeINR: { min: 700000, max: 2000000 },
    operationalNuances: 'High sensitivity to interior fitout acoustics, barista consistency, and seat duration vs revenue per hour.'
  },
  GYM: {
    categoryKey: 'GYM',
    categoryName: 'Fitness Center & Gym',
    keyEvidenceMetrics: [
      'Residential Apartment Density within 2km',
      'Young Adult Demographic (18–35 yrs)',
      'Existing Gyms & Price Points in Micro-market',
      'Annual Membership vs Monthly Dropout Rates',
      'Morning Peak (6:00–9:30 AM) vs Evening Peak (5:30–9:30 PM)',
      'Floor Plate Size & Commercial Weight-Bearing Capacity'
    ],
    targetFootfallBenchmark: '150–250 check-ins daily across split morning/evening shifts',
    primaryDemandDrivers: [
      'High-density residential gated societies within 10-min drive',
      'Disposable income for annual wellness memberships',
      'Trainer quality & certified strength equipment availability'
    ],
    typicalCapExRangeINR: { min: 1200000, max: 3500000 },
    operationalNuances: 'CapEx heavy in imported biomechanical equipment; operating cash flow relies on advance 6–12 month renewals.'
  },
  PHARMACY: {
    categoryKey: 'PHARMACY',
    categoryName: 'Retail Pharmacy & Wellness Store',
    keyEvidenceMetrics: [
      'Hospitals, Nursing Homes & Polyclinics within 800m',
      'Practicing Doctors & Prescribers in Area',
      'Residential Senior Citizen Population Share',
      'Existing Medical Stores & 24/7 Availability',
      'Cold Chain Storage & Drug License Readiness'
    ],
    targetFootfallBenchmark: '120–200 daily walk-in prescription fills',
    primaryDemandDrivers: [
      'Proximity to outpatient departments (OPDs) and diagnostic labs',
      'Neighborhood chronic medication refill subscriptions (diabetic/cardiac)',
      'Fast doorstep delivery for geriatric residents'
    ],
    typicalCapExRangeINR: { min: 500000, max: 1500000 },
    operationalNuances: 'Strict statutory pharmacist presence (Pharmacy Act 1948), inventory expiration management, and high distributor credit discipline.'
  },
  PG_HOSTEL: {
    categoryKey: 'PG_HOSTEL',
    categoryName: 'Paying Guest (PG) & Student Hostel',
    keyEvidenceMetrics: [
      'Colleges, Universities & Tech Parks within 2.5km',
      'Outstation Student & Entry-level Tech Influx',
      'Existing PG Bed Density & Monthly Pricing (Single/Double/Triple)',
      'Average Bed Occupancy Rate in Micro-market',
      'Included Amenities: High-speed Wi-Fi, Food Mess, Laundry, Power Backup'
    ],
    targetFootfallBenchmark: '88–95% steady-state annual bed occupancy',
    primaryDemandDrivers: [
      'Academic semester admissions (June–August) and IT campus batch onboarding',
      'Safe, hygienic accommodation with round-the-clock security',
      'Affordable monthly rent (₹7,500–₹14,000/bed including food)'
    ],
    typicalCapExRangeINR: { min: 800000, max: 2500000 },
    operationalNuances: 'Food catering quality consistency, utility electricity billing sub-metering, and municipal building bye-law compliance.'
  },
  EV_CHARGING: {
    categoryKey: 'EV_CHARGING',
    categoryName: 'Commercial EV Fast Charging Hub',
    keyEvidenceMetrics: [
      'Electric Vehicle Fleet (Cab Aggregators, 3W Logistics) Density',
      'Arterial Highway & Tech Corridor Traffic Volume',
      'Transformer Capacity & 100kVA+ Commercial Sanctioned Load',
      'Dedicated Drive-through Parking Bay Availability',
      'Existing DC Fast Charging Plugs in 5km Radius'
    ],
    targetFootfallBenchmark: '12–25 DC fast charges per dispenser gun daily',
    primaryDemandDrivers: [
      'Fleet aggregator shift changeover windows (2:00 PM – 4:00 PM and midnight)',
      'Subsidized commercial EV input tariff from state distribution companies (DISCOMs)',
      'Driver waiting amenities: clean restrooms, drinking water, café snacks'
    ],
    typicalCapExRangeINR: { min: 1400000, max: 4000000 },
    operationalNuances: 'Grid sanction approval lead times (30–60 days), OCPP 1.6J CMS cloud reliability, and high fault-tolerance electrical earthing.'
  },
  PACKAGED_WATER: {
    categoryKey: 'PACKAGED_WATER',
    categoryName: 'Packaged Drinking Water & B2B Bottling',
    keyEvidenceMetrics: [
      'Retail Kirana Density within 10km Radius',
      'B2B Commercial Accounts (Gyms, Corporate Offices, Caterers)',
      'Groundwater TDS & Raw Borewell Source Viability',
      'Three-Phase Industrial Power Availability (15HP+)',
      'BIS ISI 14543 & FSSAI Statutory Licensing Feasibility',
      'Local Delivery Route Turnaround & Mini-truck Access'
    ],
    targetFootfallBenchmark: '800–1,500 units daily distribution throughput',
    primaryDemandDrivers: [
      'High urban consumer distrust in municipal tap water TDS',
      'Commercial office return-to-work and gym hydration demands',
      'Summer seasonal temperature spikes (+40°C in Deccan/Northern belts)'
    ],
    typicalCapExRangeINR: { min: 450000, max: 1500000 },
    operationalNuances: 'Strict mandatory in-house microbiological laboratory test audits, bottle preform polymer commodity price exposure, and retail payment credit cycles.'
  },
  SUPERMARKET: {
    categoryKey: 'SUPERMARKET',
    categoryName: 'Supermarket & FMCG Retail (DMart Model)',
    keyEvidenceMetrics: [
      'Residential Household Catchment within 3km Radius',
      'Average Monthly Grocery Basket Size (AOV ₹1,200–₹2,500)',
      'Peak Hour Rush Windows (10:30 AM–1:00 PM & 6:00 PM–9:30 PM)',
      'Weekend Footfall Multiplier (2.2x Weekday Average)',
      'Supplier Credit Terms & FMCG Inventory Turnover (14–21 Days)',
      'Ample Two-Wheeler & Car Parking Ingress'
    ],
    targetFootfallBenchmark: '1,400–3,200 daily footfall transactions; peak surge on Saturdays/Sundays',
    primaryDemandDrivers: [
      'High-density residential middle-class families seeking monthly value savings',
      'Weekend grocery restocking and seasonal festival purchases',
      'Month-start salary disbursement shopping cycles (1st to 7th)'
    ],
    typicalCapExRangeINR: { min: 1500000, max: 4500000 },
    operationalNuances: 'High volume, low margin (12–16% gross margin) model requiring rapid stock turns, POS barcode scanning speed during peak evening rush, and strict inventory shrinkage controls.'
  }
};

export function getCategoryProfile(businessType: string): BusinessCategoryProfile {
  const norm = businessType.toLowerCase();
  if (norm.includes('cafe') || norm.includes('café') || norm.includes('coffee')) {
    return BUSINESS_CATEGORY_PROFILES.CAFE;
  }
  if (norm.includes('gym') || norm.includes('fitness') || norm.includes('crossfit')) {
    return BUSINESS_CATEGORY_PROFILES.GYM;
  }
  if (norm.includes('pharmacy') || norm.includes('medical') || norm.includes('chemist')) {
    return BUSINESS_CATEGORY_PROFILES.PHARMACY;
  }
  if (norm.includes('pg') || norm.includes('hostel') || norm.includes('co-living') || norm.includes('coliving')) {
    return BUSINESS_CATEGORY_PROFILES.PG_HOSTEL;
  }
  if (norm.includes('ev') || norm.includes('charging') || norm.includes('charger')) {
    return BUSINESS_CATEGORY_PROFILES.EV_CHARGING;
  }
  if (norm.includes('supermarket') || norm.includes('dmart') || norm.includes('grocery') || norm.includes('retail') || norm.includes('mart') || norm.includes('store')) {
    return BUSINESS_CATEGORY_PROFILES.SUPERMARKET;
  }
  return BUSINESS_CATEGORY_PROFILES.PACKAGED_WATER;
}
