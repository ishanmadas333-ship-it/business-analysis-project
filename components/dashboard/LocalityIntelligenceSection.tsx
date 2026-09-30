'use client';

import React, { useState } from 'react';
import { 
  LocalityIntelligence, 
  BusinessCategoryProfile, 
  LocationComparisonOption 
} from '@/types/business';
import { ClassificationBadge, ConfidenceBadge, DataFreshnessBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/calculations/financialEngine';
import { 
  MapPin, 
  Building2, 
  Navigation, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  School, 
  Train, 
  Layers, 
  SplitSquareVertical, 
  CheckCircle2,
  Info
} from 'lucide-react';

interface LocalityIntelligenceSectionProps {
  locality: LocalityIntelligence;
  categoryProfile?: BusinessCategoryProfile;
  locationComparison?: LocationComparisonOption[];
  businessType: string;
  city: string;
}

export function LocalityIntelligenceSection({
  locality,
  categoryProfile,
  locationComparison = [],
  businessType,
  city
}: LocalityIntelligenceSectionProps) {
  const [selectedCompLoc, setSelectedCompLoc] = useState<string>('loc-a');

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* 1. Visible Demo Mode Disclosure Banner (Requirement 7) */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/80 text-purple-200 flex items-start gap-3">
        <div className="p-1 rounded bg-purple-900/60 mt-0.5">
          <Info className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-xs leading-relaxed">
          <span className="font-bold uppercase tracking-wider text-purple-300 block mb-0.5">
            DEMO MODE — Locality & Geospatial Simulation Notice
          </span>
          <p>
            Locality and POI cluster information shown here is simulated for hackathon demonstration based on geographic coordinates (Lat: {locality.coordinates.lat}, Lng: {locality.coordinates.lng}). Production deployment connects to verified external Places and Mapping APIs. Never label demo data as verified.
          </p>
        </div>
      </div>

      {/* 2. Top Header & Confidence Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Locality Intelligence Pipeline</span>
              </span>
              <ClassificationBadge type="OBSERVED" size="sm" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Micro-Market & Catchment Radius Analysis: {locality.neighborhood}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Geospatial catchment radius mapping for {businessType} in {city}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <ConfidenceBadge
              level={locality.overallLocalityConfidence.level}
              reason={locality.overallLocalityConfidence.reason}
            />
            <DataFreshnessBadge collectedAt={locality.collectedAt} />
          </div>
        </div>

        {/* Catchment Demographics & Transit Profile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Residential vs Commercial Catchment Mix
            </span>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {locality.residentialCommercialMix.commercialPct}% Commercial / {locality.residentialCommercialMix.residentialPct}% Residential / {locality.residentialCommercialMix.studentPct}% Student
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div style={{ width: `${locality.residentialCommercialMix.commercialPct}%` }} className="bg-blue-500 h-full" title="Commercial" />
              <div style={{ width: `${locality.residentialCommercialMix.residentialPct}%` }} className="bg-emerald-500 h-full" title="Residential" />
              <div style={{ width: `${locality.residentialCommercialMix.studentPct}%` }} className="bg-purple-500 h-full" title="Students" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Public Transit & Arterial Accessibility
            </span>
            <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Metro: {locality.accessibility.metroDistanceKm}km | Bus: {locality.accessibility.busStopDistanceKm}km
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
              {locality.accessibility.highwayAccess}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Observed Peak Catchment Activity
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
              {locality.peakActivityHours}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
              High footfall velocity zone
            </span>
          </div>
        </div>

        {/* Configurable BusinessCategoryProfile (Requirement 10) */}
        {categoryProfile && (
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 mb-6">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200 dark:border-emerald-800/40">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sector Category Benchmark: {categoryProfile.categoryName}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                CapEx Benchmark: {formatINR(categoryProfile.typicalCapExRangeINR.min, { compact: true })} – {formatINR(categoryProfile.typicalCapExRangeINR.max, { compact: true })}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
              <strong>Operational Nuance: </strong>{categoryProfile.operationalNuances}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {categoryProfile.keyEvidenceMetrics.map((met, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {met}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. Observed POIs & Institution Clusters (Requirement 9) */}
        <div className="mb-6">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-slate-400" />
            <span>Nearby Observed Institutions & Footfall Generators (Geospatial Radius)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {locality.nearbyInstitutions.map((inst) => (
              <div
                key={inst.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {inst.type}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {inst.distanceKm} km away
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white mt-1 mb-1 leading-snug">
                    {inst.name}
                  </h5>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mb-2">
                    {inst.estimatedFootfallOrCapacity}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60 text-[10px] text-slate-400 flex justify-between">
                  <span>Source: {inst.source}</span>
                  <DataFreshnessBadge collectedAt={inst.collectedAt} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Evidence-Driven Opportunities & Risks (Requirements 11 & 12) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Evidence Opportunities */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-3 pb-2 border-b border-emerald-200 dark:border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Evidence-Backed Opportunities (Tied to Observed Facts)</span>
            </div>
            <div className="space-y-3">
              {locality.evidenceOpportunities.map(opp => (
                <div key={opp.id} className="text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {opp.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <strong>Observed Fact: </strong>{opp.observedFact}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    {opp.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Risks */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/20 dark:bg-rose-950/20">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold mb-3 pb-2 border-b border-rose-200 dark:border-rose-800/40">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Evidence-Backed Risks & Localized Hurdles</span>
            </div>
            <div className="space-y-3">
              {locality.evidenceRisks.map(rk => (
                <div key={rk.id} className="text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {rk.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <strong>Observed Fact: </strong>{rk.observedFact}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    {rk.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Location Comparison Tool (Requirement 13) */}
      {locationComparison.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Multi-Site Feasibility Evaluator
              </span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-blue-500" />
                <span>Locality Comparison & Evidence-Backed Trade-offs</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Compare micro-market catchment trade-offs without opaque scores. The entrepreneur evaluates the trade-off.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locationComparison.map(loc => (
              <div
                key={loc.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex flex-col justify-between"
              >
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-2">
                    {loc.locationName}
                  </h5>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Direct Competitors:</span>
                      <strong className="font-bold text-slate-900 dark:text-white">{loc.competitorCount}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Nearby Colleges / Offices:</span>
                      <strong className="font-bold text-slate-900 dark:text-white">{loc.nearbyCollegesOrOffices}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Estimated Lease Rent:</span>
                      <strong className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(loc.rentEstimateINR)}/mo</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Footfall Density:</span>
                      <strong className="font-bold text-slate-900 dark:text-white">{loc.footfallCategory}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Underlying Trade-Off:</span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {loc.keyTradeOff}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <ConfidenceBadge level={loc.confidence} reason={loc.confidenceReason} />
                  <span>{loc.collectedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
