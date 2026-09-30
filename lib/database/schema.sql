-- ==============================================================================
-- Startup Sheild Database Schema
-- Production PostgreSQL / Supabase Schema with Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles / Users Table (linked with Supabase Auth or custom auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  preferred_currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Business Ideas Table
CREATE TABLE IF NOT EXISTS public.business_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  raw_input TEXT NOT NULL,
  business_type TEXT NOT NULL,
  industry TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  tier TEXT DEFAULT 'Tier 1',
  budget NUMERIC(15, 2) NOT NULL DEFAULT 500000.00,
  target_customers TEXT[],
  product_or_service TEXT,
  business_model TEXT DEFAULT 'B2C',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Startup Costs Table
CREATE TABLE IF NOT EXISTS public.startup_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.business_ideas(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  is_editable BOOLEAN DEFAULT true,
  classification TEXT DEFAULT 'ESTIMATE',
  source_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Financial Assumptions Table
CREATE TABLE IF NOT EXISTS public.financial_assumptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.business_ideas(id) ON DELETE CASCADE UNIQUE,
  selling_price_per_unit NUMERIC(10, 2) NOT NULL,
  units_sold_per_day INTEGER NOT NULL,
  operating_days_per_month INTEGER NOT NULL DEFAULT 26,
  variable_cost_per_unit NUMERIC(10, 2) NOT NULL,
  monthly_rent NUMERIC(12, 2) NOT NULL,
  monthly_staff_cost NUMERIC(12, 2) NOT NULL,
  monthly_marketing_cost NUMERIC(12, 2) NOT NULL,
  monthly_utilities_and_misc NUMERIC(12, 2) NOT NULL,
  customer_growth_monthly_pct NUMERIC(5, 2) DEFAULT 8.0,
  tax_rate_pct NUMERIC(5, 2) DEFAULT 18.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Financial Scenarios Table
CREATE TABLE IF NOT EXISTS public.financial_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.business_ideas(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL, -- 'Conservative', 'Expected', 'Growth'
  description TEXT,
  monthly_revenue NUMERIC(15, 2) NOT NULL,
  monthly_fixed_cost NUMERIC(15, 2) NOT NULL,
  monthly_variable_cost NUMERIC(15, 2) NOT NULL,
  operating_profit NUMERIC(15, 2) NOT NULL,
  break_even_units INTEGER,
  break_even_months NUMERIC(6, 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Competitors Table
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.business_ideas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  distance_km NUMERIC(5, 1),
  category TEXT,
  price_range TEXT,
  customer_segment TEXT,
  rating NUMERIC(2, 1),
  market_share_est_pct NUMERIC(5, 1),
  strengths TEXT[],
  weaknesses TEXT[],
  source TEXT,
  is_demo_data BOOLEAN DEFAULT true
);

-- 8. Risks Table
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.business_ideas(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  risk TEXT NOT NULL,
  impact TEXT NOT NULL,
  probability TEXT NOT NULL,
  reason TEXT NOT NULL,
  mitigation TEXT NOT NULL
);

-- 9. Compliance Items Table
CREATE TABLE IF NOT EXISTS public.compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.business_ideas(id) ON DELETE CASCADE,
  requirement TEXT NOT NULL,
  purpose TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  estimated_time_days INTEGER,
  estimated_cost_inr NUMERIC(10, 2),
  status TEXT NOT NULL,
  official_source TEXT,
  last_verified_date TEXT
);

-- 10. Generated Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.business_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_json JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures each user only accesses their own business analyses and reports.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can manage own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = user_id);

-- Business Ideas: Users can only view, insert, update, delete their own ideas
CREATE POLICY "Users can manage own business ideas"
  ON public.business_ideas
  FOR ALL
  USING (auth.uid() = user_id);

-- Startup Costs: Cascaded access via idea ownership
CREATE POLICY "Users can manage costs of their ideas"
  ON public.startup_costs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_ideas
      WHERE public.business_ideas.id = startup_costs.idea_id
      AND public.business_ideas.user_id = auth.uid()
    )
  );

-- Financial Assumptions: Cascaded access
CREATE POLICY "Users can manage assumptions of their ideas"
  ON public.financial_assumptions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_ideas
      WHERE public.business_ideas.id = financial_assumptions.idea_id
      AND public.business_ideas.user_id = auth.uid()
    )
  );

-- Reports: User isolation
CREATE POLICY "Users can view own reports"
  ON public.reports
  FOR ALL
  USING (auth.uid() = user_id);
