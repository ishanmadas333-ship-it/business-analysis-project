# Startup Sheild — See Your Business Before You Build It

**Startup Sheild** is a production-quality, AI-powered Business Feasibility and Decision Support Platform that analyzes a user's business idea, location, budget, market, competition, financial requirements, risks, and scenarios before investing capital.

---

## 1. System Architecture

```
startup-sheild/
├── app/
│   ├── page.tsx                     # Startup landing page with natural language prompt box & sample chips
│   ├── layout.tsx                   # Brand layout with Inter font and complete SEO metadata
│   ├── globals.css                  # Tailwind styles, sleek scrollbar & print stylesheet
│   ├── analyze/
│   │   └── page.tsx                 # Parameter extraction, confirmation & 6-step progress interface
│   ├── dashboard/
│   │   └── page.tsx                 # Main Feasibility Dashboard with 12 modules
│   └── api/
│       ├── analyze/route.ts         # Business idea extraction API endpoint
│       └── chat/route.ts            # Simulation-connected AI Business Assistant API
│
├── components/
│   ├── ui/
│   │   ├── Logo.tsx                 # Precision lens + upward growth arrow SVG
│   │   └── Badge.tsx                # Classification badges (VERIFIED DATA, USER INPUT, ESTIMATE, AI ASSUMPTION)
│   ├── dashboard/
│   │   ├── Sidebar.tsx              # 12-item navigation sidebar
│   │   ├── TopNav.tsx               # Active business switcher, AI trigger, profile badge
│   │   ├── MetricCard.tsx           # Stat cards with explicit "Estimated" badges
│   │   ├── FeasibilityScorecard.tsx # 6-dimensional rules-based feasibility indicators
│   │   ├── KeyAssumptionsCard.tsx   # Model baseline assumptions with modal editor
│   │   ├── CompetitorTable.tsx      # Filterable local competitors + spatial radar map
│   │   ├── RiskMatrix.tsx           # 7 risk categories with reasons & mitigations
│   │   ├── ComplianceChecklist.tsx  # Statutory licenses, lead times, fees & disclaimer
│   │   ├── RoadmapTimeline.tsx      # Interactive 90-day checklist with readiness tracker
│   │   ├── SourcesAndAssumptionsTable.tsx # Audit trail with data provenance classification
│   │   ├── MarketAnalysisSection.tsx# Sizing, customer segments, seasonal demand index
│   │   └── BusinessReportModal.tsx  # Printable formal 17-section feasibility memorandum
│   ├── charts/
│   │   ├── BreakEvenChart.tsx       # Line chart: Revenue line, Total Cost, Fixed Cost, Break-even dot
│   │   ├── RevenueExpensesChart.tsx # 12-month cash flow & profit ramp-up trajectory
│   │   ├── CostBreakdownPie.tsx     # Startup capital allocation donut chart
│   │   └── ScenarioComparisonChart.tsx # Conservative vs Expected vs Growth bar chart & table
│   ├── financial/
│   │   ├── StartupCostEditor.tsx    # CapEx schedule with line-item editor & budget tracking
│   │   ├── UnitEconomicsCard.tsx    # Unit economics, selling price, variable cost, CM ratio
│   │   └── PLStatementTable.tsx     # Pro Forma GAAP Profit & Loss statement
│   ├── simulator/
│   │   └── WhatIfSimulator.tsx      # 8 interactive sliders with Current vs Modified scenario diff
│   └── ai/
│       └── AIAssistantDrawer.tsx    # Context-aware assistant that updates simulation live
│
├── lib/
│   ├── calculations/
│   │   └── financialEngine.ts       # 100% deterministic TypeScript calculation formulas
│   ├── demo/
│   │   ├── packagedWaterDemo.ts     # Packaged Drinking Water in Hyderabad (₹5 Lakh)
│   │   └── allDemos.ts              # Artisan Café (₹10L) & EV Charging (₹15L) presets
│   ├── ai/
│   │   └── aiService.ts             # Modular AI layer (Gemini/OpenAI + intelligent heuristic)
│   ├── market/
│   │   └── marketDataService.ts     # Market demand curves & demographic models
│   ├── competitors/
│   │   └── competitorService.ts     # Competitor filtering and spatial calculations
│   ├── compliance/
│   │   └── complianceService.ts     # Statutory compliance rules & legal disclaimers
│   └── database/
│       ├── schema.sql               # PostgreSQL / Supabase SQL schema with RLS policies
│       └── store.ts                 # LocalStorage persistence & multi-idea management
│
└── types/
    └── business.ts                  # Complete TypeScript definitions
```

---

## 2. Core Methodologies & Formulas

1. **Deterministic Calculations (Zero Arithmetic Hallucination)**:
   - Monthly Units: $\text{Units Sold Per Day} \times \text{Operating Days Per Month}$
   - Monthly Revenue: $\text{Monthly Units} \times \text{Selling Price Per Unit}$
   - Variable Cost: $\text{Monthly Units} \times \text{Variable Cost Per Unit}$
   - Fixed Costs: $\text{Rent} + \text{Staff Payroll} + \text{Marketing} + \text{Utilities \& Admin}$
   - Contribution Margin: $\text{Selling Price} - \text{Variable Cost Per Unit}$
   - Break-Even Units: $\frac{\text{Monthly Fixed Costs}}{\text{Contribution Margin}}$
   - Break-Even Revenue: $\text{Break-Even Units} \times \text{Selling Price}$
   - Break-Even Capital Payback: $\frac{\text{Total Startup CapEx}}{\text{Monthly Operating Profit}}$

2. **Data Provenance Classification**:
   - `VERIFIED DATA`: Government fee portals, statutory acts, utility tariffs.
   - `USER INPUT`: Parameters supplied directly by founder.
   - `ESTIMATE`: Deterministically computed projections.
   - `AI ASSUMPTION`: Extracted hypothesis requiring field validation.

3. **Multi-Scenario Sensitivity**:
   - **Conservative**: $-25\%$ sales volume, $+12\%$ variable cost, $+5\%$ rent, slower ramp-up.
   - **Expected**: Baseline steady-state operations.
   - **Growth**: $+40\%$ sales volume, $-10\%$ variable cost (economies of scale), $+25\%$ marketing.

---

## 3. 5-Minute Hackathon Demo Script

1. **Open Landing Page** (`http://localhost:3000`):
   - Notice the startup tagline: *"See Your Business Before You Build It"*.
   - View the 5 prompt chips below the input box.
2. **Execute Natural Language Input**:
   - Click chip *"Start a packaged water business with ₹5 lakh"* (or type custom idea).
   - Click **"Analyze My Business Idea"**.
3. **Verify Extraction Screen** (`/analyze`):
   - Review extracted: Business (Packaged Drinking Water), Location (Hyderabad, Telangana), Budget (₹5,00,000), Model (B2B).
   - Click **"Start Business Analysis"** and observe the realistic 6-step progress checklist.
4. **Explore Dashboard** (`/dashboard`):
   - Review the 6 Overview cards with "Estimated" badges.
   - Inspect the **Feasibility Scorecard** with transparent rules-based scoring.
   - Click **"Change assumptions"** in the Baseline Assumptions card to edit values.
   - Observe the **Break-Even Curve** and **12-Month Trajectory Area Chart**.
5. **Interactive What-If Simulation**:
   - Adjust the budget slider from ₹5,00,000 to ₹3,00,000.
   - Observe the live side-by-side comparison with color-coded delta metrics.
6. **Trigger Simulation-Connected AI Assistant**:
   - Click **"Ask AI Assistant"** in the top navigation.
   - Send: *"What if sales decrease by 30%?"* or *"I only have ₹3 lakh."*
   - Watch the assistant mathematically adjust the simulation and update the model live.
7. **Interactive 90-Day Launch Roadmap**:
   - Click **"90-Day Launch Plan"** in the sidebar.
   - Check off a milestone task to see the launch readiness meter update with confetti.
8. **Export Feasibility Memorandum**:
   - Click **"Generate Business Report"** to open the formal 17-section feasibility document.
   - Click **"Print / Export to PDF"** to test native print stylesheet rendering.
