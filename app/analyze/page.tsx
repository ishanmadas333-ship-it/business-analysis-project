'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './wizard.css';
import { extractBusinessRequirements } from '@/lib/ai/aiService';
import { createReportFromDraft, saveReportsToStorage, setStoredActiveReportId, getInitialReports } from '@/lib/database/store';
import { calculateFinancials, evaluateFeasibility } from '@/lib/calculations/financialEngine';
import { getCategoryProfile } from '@/lib/locality/businessCategoryProfiles';
import { getLocalityIntelligence } from '@/lib/locality/localityIntelligenceService';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Clock, Star } from 'lucide-react';

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || 'I want to start a packaged drinking-water business in Hyderabad with ₹5 lakh. I want to sell to shops, gyms, offices and events.';

  // Step state
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 7;

  // Step 1: Business Idea
  const [businessName, setBusinessName] = useState('Packaged Drinking Water');
  const [category, setCategory] = useState('Food & Beverage');
  const [businessModel, setBusinessModel] = useState<'B2B' | 'B2C' | 'D2C' | 'Marketplace' | 'SaaS'>('B2B');
  const [description, setDescription] = useState('Production and 20L / 1L distribution of purified drinking water to retail stores, offices, and gyms.');

  // Step 2: Location Intelligence
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [targetArea, setTargetArea] = useState('Urban');
  const [customerType, setCustomerType] = useState('Businesses');
  const [selectedDemandOption, setSelectedDemandOption] = useState<'high' | 'growing' | 'rural'>('high');

  // Step 3: Financial Model
  const [investment, setInvestment] = useState(500000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(254800);
  const [monthlyExpenses, setMonthlyExpenses] = useState(186650);
  const [profitMargin, setProfitMargin] = useState(26.7);
  const [riskTolerance, setRiskTolerance] = useState(50);

  // Step 6: Calculated Feasibility Score
  const [feasibilityScore, setFeasibilityScore] = useState(78);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Background Particles
  const [particles, setParticles] = useState<Array<{ id: number; left: string; duration: string; delay: string; opacity: number }>>([]);

  // Generate particles
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 45; i++) {
      list.push({
        id: i,
        left: Math.random() * 100 + '%',
        duration: 8 + Math.random() * 12 + 's',
        delay: Math.random() * 10 + 's',
        opacity: Math.random() * 0.5
      });
    }
    setParticles(list);
  }, []);

  // Pre-fill from NLP extraction when prompt is provided
  useEffect(() => {
    let isMounted = true;
    async function runExtraction() {
      if (!initialPrompt) return;
      try {
        const extracted = await extractBusinessRequirements(initialPrompt);
        if (isMounted && extracted) {
          if (extracted.businessType) setBusinessName(extracted.businessType);
          if (extracted.industry) setCategory(extracted.industry);
          if (extracted.location?.city) setCity(extracted.location.city);
          if (extracted.location?.state) setState(extracted.location.state);
          if (extracted.budget) setInvestment(extracted.budget);
          if (extracted.productOrService) setDescription(extracted.productOrService);
          if (extracted.businessModel) {
            setBusinessModel(extracted.businessModel as any);
          }

          // Initial deterministic financial calibration
          const budgetVal = extracted.budget || 500000;
          const estRev = Math.round(budgetVal * 0.51);
          const estExp = Math.round(estRev * 0.73);
          const estMargin = Number((((estRev - estExp) / estRev) * 100).toFixed(1));
          setMonthlyRevenue(estRev);
          setMonthlyExpenses(estExp);
          setProfitMargin(estMargin);
        }
      } catch (e) {
        console.error('NLP prefill failed:', e);
      }
    }
    runExtraction();
    return () => {
      isMounted = false;
    };
  }, [initialPrompt]);

  // Dynamically calculate unit economics & feasibility score when inputs change
  useEffect(() => {
    const rev = monthlyRevenue || 200000;
    const exp = monthlyExpenses || 150000;
    const profit = rev - exp;
    const margin = rev > 0 ? Number(((profit / rev) * 100).toFixed(1)) : 0;
    setProfitMargin(margin);

    // Compute feasibility score using deterministic heuristics
    let baseScore = 65;
    if (margin > 20) baseScore += 10;
    else if (margin > 10) baseScore += 5;
    else if (margin <= 0) baseScore -= 15;

    if (investment >= 300000 && investment <= 1500000) baseScore += 6;
    if (selectedDemandOption === 'high') baseScore += 5;
    if (selectedDemandOption === 'growing') baseScore += 3;

    const clamped = Math.min(94, Math.max(45, baseScore));
    setFeasibilityScore(clamped);
  }, [investment, monthlyRevenue, monthlyExpenses, selectedDemandOption]);

  // Animate score counter on Step 6
  useEffect(() => {
    if (currentStep === 5) {
      let current = 0;
      setAnimatedScore(0);
      const timer = setInterval(() => {
        current += 2;
        if (current >= feasibilityScore) {
          current = feasibilityScore;
          setAnimatedScore(current);
          clearInterval(timer);
        } else {
          setAnimatedScore(current);
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [currentStep, feasibilityScore]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      }
      if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  // Finish Analysis & Save to Backend Store
  const handleFinish = () => {
    const draft = {
      businessType: businessName || 'Independent Business Venture',
      industry: category || 'Commercial Enterprise',
      location: {
        city: city || 'Hyderabad',
        state: state || 'Telangana',
        country: 'India',
        tier: 'Tier 1' as const,
        neighborhood: targetArea === 'Urban' ? 'Central Commercial Zone' : 'Industrial Area'
      },
      budget: Number(investment) || 500000,
      targetCustomers: [customerType || 'Businesses', 'Local Consumers'],
      productOrService: description || 'Commercial enterprise operations',
      businessModel: (businessModel === 'B2B' || businessModel === 'B2C' || businessModel === 'D2C' ? businessModel : 'B2B') as any,
      rawInput: initialPrompt
    };

    // Backend report generation
    const newReport = createReportFromDraft(draft);

    // Save report in persistent store
    const existingReports = getInitialReports();
    const nextReports = { ...existingReports, [newReport.idea.id]: newReport };
    saveReportsToStorage(nextReports);
    setStoredActiveReportId(newReport.idea.id);

    // Navigate to full live dashboard
    router.push(`/dashboard?id=${newReport.idea.id}`);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinish();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Progress percentage
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const stepLabels = ['Business', 'Location', 'Financials', 'Market', 'Risk', 'AI Result', 'Launch'];

  return (
    <div className="wizard-root">
      {/* Background Particles */}
      <div className="wizard-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="wizard-particle"
            style={{
              left: p.left,
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: p.opacity
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="wizard-header">
        <Link href="/" className="wizard-logo">
          <div className="wizard-logo-icon">🛡</div>
          <div>
            <h2>Startup Shield</h2>
            <span>AI Business Feasibility Platform</span>
          </div>
        </Link>

        <div className="wizard-header-right">
          <div className="wizard-status">
            <div className="wizard-status-dot" />
            AI Engine Online
          </div>
          <div className="wizard-avatar">SS</div>
        </div>
      </header>

      {/* Main Container */}
      <main className="wizard-main">
        {/* Intro */}
        <section className="wizard-intro">
          <div className="wizard-badge">✦ AI-POWERED BUSINESS ANALYSIS</div>
          <h1>
            Build your business with <span className="wizard-gradient">confidence.</span>
          </h1>
          <p>
            Complete each step and let Startup Shield analyze your idea, market, finances and risks.
          </p>
        </section>

        {/* Progress Bar */}
        <div className="wizard-progress-wrapper">
          <div className="wizard-progress-top">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div className="wizard-progress">
            <div className="wizard-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="wizard-steps">
          {stepLabels.map((lbl, idx) => (
            <div
              key={idx}
              className={`wizard-step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(idx)}
            >
              <div className="wizard-step-circle">{idx < currentStep ? '✓' : idx + 1}</div>
              <span>{lbl}</span>
            </div>
          ))}
        </div>

        {/* STEP CARD CONTAINER */}
        <div className="wizard-card">
          {/* STEP 1: BUSINESS IDEA */}
          <div className={`wizard-step-page ${currentStep === 0 ? 'active' : ''}`}>
            <div className="wizard-page-title">
              <small>Step 01 · Business Idea</small>
              <h2>Tell us about your business</h2>
              <p>Start with the basic information about the business you want to build.</p>
            </div>

            <div className="wizard-form-grid">
              <div className="wizard-field full">
                <label>Business Name / Venture Title</label>
                <input
                  type="text"
                  className="wizard-input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Example: Packaged Drinking Water"
                />
              </div>

              <div className="wizard-field">
                <label>Business Category</label>
                <select
                  className="wizard-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>

              <div className="wizard-field">
                <label>Business Model</label>
                <select
                  className="wizard-select"
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value as any)}
                >
                  <option value="B2B">B2B (Business to Business)</option>
                  <option value="B2C">B2C (Consumer Retail)</option>
                  <option value="D2C">D2C (Direct to Consumer)</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="SaaS">SaaS / Digital</option>
                </select>
              </div>

              <div className="wizard-field full">
                <label>Describe your business idea & product</label>
                <textarea
                  className="wizard-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what you want to sell, who your customers are and what problem you solve..."
                />
              </div>
            </div>
          </div>

          {/* STEP 2: LOCATION INTELLIGENCE */}
          <div className={`wizard-step-page ${currentStep === 1 ? 'active' : ''}`}>
            <div className="wizard-page-title">
              <small>Step 02 · Location Intelligence</small>
              <h2>Where will you operate?</h2>
              <p>Local market conditions can significantly affect business feasibility.</p>
            </div>

            <div className="wizard-form-grid">
              <div className="wizard-field">
                <label>Target City</label>
                <input
                  type="text"
                  className="wizard-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="wizard-field">
                <label>State / Province</label>
                <input
                  type="text"
                  className="wizard-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="wizard-field">
                <label>Target Area Type</label>
                <select
                  className="wizard-select"
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                >
                  <option value="Urban">Urban Commercial</option>
                  <option value="Semi Urban">Semi Urban / Suburban</option>
                  <option value="Rural">Rural / Industrial Outskirts</option>
                </select>
              </div>

              <div className="wizard-field">
                <label>Primary Customer Focus</label>
                <select
                  className="wizard-select"
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                >
                  <option value="Businesses">B2B Offices, Shops & Gyms</option>
                  <option value="Local Consumers">Local Residents & Walk-ins</option>
                  <option value="Institutions">Institutions & Colleges</option>
                  <option value="Mixed">Mixed Omnichannel</option>
                </select>
              </div>
            </div>

            <div className="wizard-options">
              <div
                className={`wizard-option ${selectedDemandOption === 'high' ? 'selected' : ''}`}
                onClick={() => setSelectedDemandOption('high')}
              >
                <div className="wizard-option-icon">🏙️</div>
                <h3>High Demand Area</h3>
                <p>Dense population, tech parks, colleges, and high customer velocity.</p>
              </div>

              <div
                className={`wizard-option ${selectedDemandOption === 'growing' ? 'selected' : ''}`}
                onClick={() => setSelectedDemandOption('growing')}
              >
                <div className="wizard-option-icon">🏘️</div>
                <h3>Growing Area</h3>
                <p>Developing corridor with lower rental costs and future upside.</p>
              </div>

              <div
                className={`wizard-option ${selectedDemandOption === 'rural' ? 'selected' : ''}`}
                onClick={() => setSelectedDemandOption('rural')}
              >
                <div className="wizard-option-icon">🌾</div>
                <h3>Industrial / Outskirts</h3>
                <p>Low production lease cost with wholesale vehicular distribution routes.</p>
              </div>
            </div>
          </div>

          {/* STEP 3: FINANCIAL MODEL */}
          <div className={`wizard-step-page ${currentStep === 2 ? 'active' : ''}`}>
            <div className="wizard-page-title">
              <small>Step 03 · Financial Model</small>
              <h2>Set your investment capacity</h2>
              <p>Provide basic financial assumptions for deterministic feasibility calculations.</p>
            </div>

            <div className="wizard-form-grid">
              <div className="wizard-field">
                <label>Total Allocated Capital (₹)</label>
                <input
                  type="number"
                  className="wizard-input"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value) || 0)}
                />
              </div>

              <div className="wizard-field">
                <label>Expected Monthly Revenue (₹)</label>
                <input
                  type="number"
                  className="wizard-input"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value) || 0)}
                />
              </div>

              <div className="wizard-field">
                <label>Estimated Monthly Operating Costs (₹)</label>
                <input
                  type="number"
                  className="wizard-input"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value) || 0)}
                />
              </div>

              <div className="wizard-field">
                <label>Calculated Operating EBITDA Margin (%)</label>
                <input
                  type="number"
                  className="wizard-input"
                  value={profitMargin}
                  readOnly
                  title="Computed automatically by the financial engine"
                />
              </div>
            </div>

            <div className="wizard-slider-box">
              <div className="wizard-slider-header">
                <span>Founder Risk Tolerance Profile</span>
                <span className="wizard-slider-value">{riskTolerance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(Number(e.target.value))}
                className="wizard-range"
              />
            </div>
          </div>

          {/* STEP 4: MARKET ANALYSIS */}
          <div className={`wizard-step-page ${currentStep === 3 ? 'active' : ''}`}>
            <div className="wizard-page-title">
              <small>Step 04 · Market Analysis</small>
              <h2>Analyze your market opportunity</h2>
              <p>Startup Shield evaluates the important market dimensions for {businessName}.</p>
            </div>

            <div className="wizard-analysis-grid">
              <div className="wizard-analysis-card">
                <div className="wizard-analysis-icon">📈</div>
                <h3>Demand Potential</h3>
                <p>Strong recurring demand with high daily consumption rate across urban {city}.</p>
              </div>

              <div className="wizard-analysis-card">
                <div className="wizard-analysis-icon">👥</div>
                <h3>Customer Segments</h3>
                <p>Local commercial establishments, retail kiranas, gyms, and corporate offices.</p>
              </div>

              <div className="wizard-analysis-card">
                <div className="wizard-analysis-icon">🏪</div>
                <h3>Competition Density</h3>
                <p>Moderate fragmentation: 4-5 regional suppliers in a 5km radius.</p>
              </div>

              <div className="wizard-analysis-card">
                <div className="wizard-analysis-icon">💰</div>
                <h3>Pricing Power</h3>
                <p>Blended wholesale pricing benchmarked at ₹12–₹28 per packaged unit.</p>
              </div>

              <div className="wizard-analysis-card">
                <div className="wizard-analysis-icon">📍</div>
                <h3>Local Catchment</h3>
                <p>Benefited by high-density transit nodes, educational institutions, and tech SEZs.</p>
              </div>

              <div className="wizard-analysis-card">
                <div className="wizard-analysis-icon">🚀</div>
                <h3>Growth Trajectory</h3>
                <p>Expandable into catering contracts and 20L commercial dispenser delivery routes.</p>
              </div>
            </div>

            {/* COMPETITOR REVENUE & RUSH HOUR INTELLIGENCE (DMART / LOCALITY BENCHMARKS) */}
            <div className="wizard-benchmarks-box">
              <div className="wizard-benchmarks-header">
                <div className="wizard-benchmarks-title">
                  <h4>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Competitor Revenue & Rush Hour Benchmarks</span>
                  </h4>
                  <p>Calibrated income, rating, and peak sales rush hours for {city} competitors (like DMart model).</p>
                </div>
                <span className="wizard-benchmark-badge">Market Intelligence</span>
              </div>

              <div className="wizard-benchmark-grid">
                <div className="wizard-comp-card">
                  <div className="wizard-comp-top">
                    <div>
                      <div className="wizard-comp-name">
                        {category.toLowerCase().includes('retail') || businessName.toLowerCase().includes('mart')
                          ? `DMart Hypermarket (${city} Regional Hub)`
                          : `Tier-1 Market Leader (${city} Hub)`}
                      </div>
                      <span className="text-[10px] text-slate-400">Prime Commercial Catchment · 2.5km</span>
                    </div>
                    <div className="wizard-comp-rating">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>4.5</span>
                      <span className="text-[9px] text-amber-300 font-normal">(3.8k)</span>
                    </div>
                  </div>

                  <div className="wizard-comp-income">
                    <div className="wizard-income-stat">
                      <span>Est. Monthly Income</span>
                      <strong>₹45.0 L – ₹75.0 L</strong>
                    </div>
                    <div className="wizard-income-stat">
                      <span>Est. Annual Run-rate</span>
                      <strong>₹5.4 Cr – ₹9.0 Cr</strong>
                    </div>
                    <div className="wizard-income-stat">
                      <span>Net Profit Margin</span>
                      <strong>15% – 18%</strong>
                    </div>
                  </div>

                  <div className="wizard-comp-rush">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span><strong>Rush Hours:</strong> 10:30 AM–1:00 PM & 6:00 PM–9:30 PM</span>
                  </div>

                  <div className="wizard-comp-surge">
                    ⚡ <strong>Peak Surge:</strong> +180% to +210% checkout volume on Fri–Sun and Salary Week (1st–5th)
                  </div>

                  <p className="wizard-comp-notes">
                    <strong>Cost-Benefit Arbitrage:</strong> Established operators suffer from long checkout queues (20+ min wait) and heavy commercial lease overhead. Your startup can capture peak-hour spillover with express 5-minute checkout or targeted route distribution.
                  </p>
                </div>

                <div className="wizard-comp-card">
                  <div className="wizard-comp-top">
                    <div>
                      <div className="wizard-comp-name">
                        Regional Modern Competitor / Certified Operator
                      </div>
                      <span className="text-[10px] text-slate-400">Neighborhood Commercial Node · 1.2km</span>
                    </div>
                    <div className="wizard-comp-rating">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>4.2</span>
                      <span className="text-[9px] text-amber-300 font-normal">(920)</span>
                    </div>
                  </div>

                  <div className="wizard-comp-income">
                    <div className="wizard-income-stat">
                      <span>Est. Monthly Income</span>
                      <strong>₹18.5 L – ₹32.0 L</strong>
                    </div>
                    <div className="wizard-income-stat">
                      <span>Est. Annual Run-rate</span>
                      <strong>₹2.2 Cr – ₹3.8 Cr</strong>
                    </div>
                    <div className="wizard-income-stat">
                      <span>Net Profit Margin</span>
                      <strong>16% – 20%</strong>
                    </div>
                  </div>

                  <div className="wizard-comp-rush">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span><strong>Rush Hours:</strong> 11:30 AM–2:00 PM & 5:30 PM–8:30 PM</span>
                  </div>

                  <div className="wizard-comp-surge">
                    ⚡ <strong>Peak Surge:</strong> +140% customer intake during evening return-commute and weekend mornings
                  </div>

                  <p className="wizard-comp-notes">
                    <strong>Cost-Benefit Arbitrage:</strong> Inflexible corporate ordering contracts leave local gyms, boutique offices, and independent shops underserved. A localized agile provider wins with personalized service and 25% retailer margins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 5: RISK ANALYSIS */}
          <div className={`wizard-step-page ${currentStep === 4 ? 'active' : ''}`}>
            <div className="wizard-page-title">
              <small>Step 05 · Risk Analysis</small>
              <h2>Understand your business risks</h2>
              <p>Review the major factors that could affect your investment before committing.</p>
            </div>

            <div className="wizard-risk-list">
              <div className="wizard-risk">
                <div className="wizard-risk-info">
                  <div className="wizard-risk-icon">💰</div>
                  <div>
                    <h3>Financial Exposure Risk</h3>
                    <p>Initial CapEx recovery and working capital adequacy during first 90 days.</p>
                  </div>
                </div>
                <span className="wizard-risk-level wizard-risk-medium">MEDIUM</span>
              </div>

              <div className="wizard-risk">
                <div className="wizard-risk-info">
                  <div className="wizard-risk-icon">🏪</div>
                  <div>
                    <h3>Competition & Price War Risk</h3>
                    <p>Incumbents with existing distributor relationships in the local neighborhood.</p>
                  </div>
                </div>
                <span className="wizard-risk-level wizard-risk-medium">MEDIUM</span>
              </div>

              <div className="wizard-risk">
                <div className="wizard-risk-info">
                  <div className="wizard-risk-icon">📉</div>
                  <div>
                    <h3>Demand Fluctuation Risk</h3>
                    <p>Seasonal consumption variations between summer peaks and monsoon dips.</p>
                  </div>
                </div>
                <span className="wizard-risk-level wizard-risk-low">LOW</span>
              </div>

              <div className="wizard-risk">
                <div className="wizard-risk-info">
                  <div className="wizard-risk-icon">⚖️</div>
                  <div>
                    <h3>Regulatory & Statutory Compliance</h3>
                    <p>FSSAI registration, municipal trade licenses, and BIS certifications.</p>
                  </div>
                </div>
                <span className="wizard-risk-level wizard-risk-medium">MEDIUM</span>
              </div>
            </div>
          </div>

          {/* STEP 6: AI FEASIBILITY RESULT */}
          <div className={`wizard-step-page ${currentStep === 5 ? 'active' : ''}`}>
            <div className="wizard-page-title">
              <small>Step 06 · AI Feasibility Result</small>
              <h2>Your Startup Shield analysis</h2>
              <p>Review the calculated feasibility score and financial signals before proceeding.</p>
            </div>

            <div className="wizard-result">
              <div
                className="wizard-score-ring"
                style={{
                  background: `conic-gradient(#00dfa0 0deg, #00dfa0 ${Math.round(animatedScore * 3.6)}deg, #162337 ${Math.round(animatedScore * 3.6)}deg)`
                }}
              >
                <div className="wizard-score-inner">
                  <div className="wizard-score">{animatedScore}</div>
                  <span>FEASIBILITY SCORE</span>
                </div>
              </div>

              <h2>
                {feasibilityScore >= 75
                  ? 'Business shows strong potential'
                  : 'Business shows moderate potential'}
              </h2>

              <p>
                Based on deterministic unit economics, <strong>₹{investment.toLocaleString('en-IN')}</strong> startup capital, and an estimated EBITDA margin of <strong>{profitMargin}%</strong> in {city}, the business demonstrates a viable pathway to profitability with an estimated break-even period of 7 to 9 months.
              </p>
            </div>
          </div>

          {/* STEP 7: LAUNCH STRATEGY */}
          <div className={`wizard-step-page ${currentStep === 6 ? 'active' : ''}`}>
            <div className="wizard-page-title">
              <small>Step 07 · Launch Strategy</small>
              <h2>Your 90-day launch roadmap</h2>
              <p>Move from analysis to execution with a structured operational schedule.</p>
            </div>

            <div className="wizard-timeline">
              <div className="wizard-timeline-item">
                <h3>Days 1–15 · Validation & Catchment Field Survey</h3>
                <p>Interview 20–30 local retail shopkeepers and commercial accounts; verify power and water connections.</p>
              </div>

              <div className="wizard-timeline-item">
                <h3>Days 16–30 · Procurement, Statutory Licensing & Fitout</h3>
                <p>Finalize machinery supplier quotations, initiate FSSAI/BIS portal applications, and secure lease deposit.</p>
              </div>

              <div className="wizard-timeline-item">
                <h3>Days 31–60 · Trial Production & B2B Pilot Delivery</h3>
                <p>Execute test batch production, onboard first 15 retail distributors, and establish cash collections cycle.</p>
              </div>

              <div className="wizard-timeline-item">
                <h3>Days 61–90 · Scale Operations & Reach Break-Even</h3>
                <p>Expand delivery radius across neighboring zones, optimize route fuel costs, and achieve monthly break-even.</p>
              </div>
            </div>
          </div>

          {/* ACTIONS: BACK / NEXT / FINISH */}
          <div className="wizard-actions">
            <button
              type="button"
              className="wizard-btn wizard-btn-back"
              onClick={previousStep}
              style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
            >
              ← Back
            </button>

            <button
              type="button"
              className={`wizard-btn ${currentStep === totalSteps - 1 ? 'wizard-btn-finish' : 'wizard-btn-next'}`}
              onClick={nextStep}
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Analysis Complete — Open Full Dashboard →</span>
                </>
              ) : (
                <>
                  <span>Continue →</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="wizard-footer">
          Startup Shield © 2026 · AI Business Feasibility Platform
        </div>
      </main>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Startup Shield analysis engine...</div>}>
      <WizardContent />
    </Suspense>
  );
}
