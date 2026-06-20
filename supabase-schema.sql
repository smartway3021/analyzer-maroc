-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can view own company" ON companies;
DROP POLICY IF EXISTS "Users can insert own company" ON companies;
DROP POLICY IF EXISTS "Users can update own company" ON companies;
DROP POLICY IF EXISTS "Users can delete own company" ON companies;
DROP POLICY IF EXISTS "Users can view own tenders" ON tenders;
DROP POLICY IF EXISTS "Users can insert own tenders" ON tenders;
DROP POLICY IF EXISTS "Users can update own tenders" ON tenders;
DROP POLICY IF EXISTS "Users can delete own tenders" ON tenders;
DROP POLICY IF EXISTS "Users can view own analysis" ON tender_analysis;
DROP POLICY IF EXISTS "Users can insert own analysis" ON tender_analysis;
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can insert own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can view own quote items" ON quote_items;
DROP POLICY IF EXISTS "Users can insert own quote items" ON quote_items;
DROP POLICY IF EXISTS "Users can delete own quote items" ON quote_items;
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON documents;
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Authenticated users can view competitors" ON competitors;
DROP POLICY IF EXISTS "Authenticated users can insert competitors" ON competitors;

-- Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profiles
CREATE TABLE IF NOT EXISTS users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'free' CHECK (role IN ('free', 'pro', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  rc TEXT,
  if_ TEXT,
  ice TEXT,
  cnss TEXT,
  patente TEXT,
  responsable TEXT,
  signature_url TEXT,
  cachet_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenders
CREATE TABLE IF NOT EXISTS tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reference TEXT,
  source_url TEXT,
  source_type TEXT DEFAULT 'url' CHECK (source_type IN ('url', 'pdf', 'docx', 'manual')),
  organism TEXT,
  category TEXT,
  subcategory TEXT,
  region TEXT,
  budget NUMERIC,
  deadline TIMESTAMPTZ,
  caution TEXT,
  type_marche TEXT,
  secteur TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'analyzed', 'quoted', 'submitted', 'won', 'lost')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tender analysis
CREATE TABLE IF NOT EXISTS tender_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text TEXT,
  reference TEXT,
  objet TEXT,
  organisme TEXT,
  categorie TEXT,
  sous_categorie TEXT,
  region TEXT,
  budget NUMERIC,
  date_limite TEXT,
  caution TEXT,
  type_marche TEXT,
  secteur TEXT,
  produits TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  quantites JSONB DEFAULT '[]',
  documents_demandes TEXT[] DEFAULT '{}',
  criteres_techniques TEXT[] DEFAULT '{}',
  criteres_financiers TEXT[] DEFAULT '{}',
  risques TEXT[] DEFAULT '{}',
  score_opportunite INTEGER DEFAULT 0,
  difficulte TEXT,
  complexite TEXT,
  rentabilite_estimee TEXT,
  concurrence_niveau TEXT,
  probabilite_succes TEXT,
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  reference TEXT,
  total_ht NUMERIC DEFAULT 0,
  total_ttc NUMERIC DEFAULT 0,
  tva NUMERIC DEFAULT 20,
  valid_until TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'sent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote items
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  produit TEXT NOT NULL,
  description TEXT,
  quantite NUMERIC NOT NULL DEFAULT 1,
  unite TEXT DEFAULT 'U',
  prix_unitaire NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC GENERATED ALWAYS AS (quantite * prix_unitaire) STORED
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('lettre_soumission', 'declaration_honneur', 'memoire_technique', 'bordereau_prix', 'devis', 'checklist')),
  file_url TEXT,
  format TEXT DEFAULT 'pdf' CHECK (format IN ('pdf', 'docx')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitors
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  market TEXT,
  amount NUMERIC,
  date TEXT,
  category TEXT,
  organisme TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  analyses_used INTEGER DEFAULT 0,
  analyses_limit INTEGER DEFAULT 5,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own company" ON companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own company" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own company" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own company" ON companies FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own tenders" ON tenders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tenders" ON tenders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tenders" ON tenders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tenders" ON tenders FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own analysis" ON tender_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analysis" ON tender_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes" ON quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON quotes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own quote items" ON quote_items FOR SELECT USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can insert own quote items" ON quote_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can delete own quote items" ON quote_items FOR DELETE USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can view competitors" ON competitors FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert competitors" ON competitors FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('company-signatures', 'company-signatures', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('tender-documents', 'tender-documents', true) ON CONFLICT (id) DO NOTHING;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  INSERT INTO public.subscriptions (user_id, plan, analyses_limit)
  VALUES (NEW.id, 'free', 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenders_user_id ON tenders(user_id);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_created_at ON tenders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tender_analysis_tender_id ON tender_analysis(tender_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_competitors_category ON competitors(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
