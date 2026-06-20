export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'free' | 'pro' | 'premium';
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;
  user_id: string;
  name: string;
  logo_url?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  rc?: string;
  if_: string;
  ice: string;
  cnss?: string;
  patente?: string;
  responsable?: string;
  signature_url?: string;
  cachet_url?: string;
  created_at: string;
  updated_at: string;
};

export type Tender = {
  id: string;
  user_id: string;
  title: string;
  reference: string;
  source_url?: string;
  source_type: 'url' | 'pdf' | 'docx' | 'manual';
  organism: string;
  category: string;
  subcategory?: string;
  region: string;
  budget?: number;
  deadline: string;
  caution?: string;
  type_marche: string;
  secteur: string;
  status: 'draft' | 'analyzed' | 'quoted' | 'submitted' | 'won' | 'lost';
  created_at: string;
  updated_at: string;
};

export type TenderAnalysis = {
  id: string;
  tender_id: string;
  user_id: string;
  raw_text: string;
  reference: string;
  objet: string;
  organisme: string;
  categorie: string;
  sousCategorie?: string;
  region: string;
  budget?: number;
  dateLimite: string;
  caution?: string;
  typeMarche: string;
  secteur: string;
  produits: string[];
  services: string[];
  quantites: { produit: string; quantite: string }[];
  documentsDemandes: string[];
  criteresTechniques: string[];
  criteresFinanciers: string[];
  risques: string[];
  scoreOpportunite: number;
  difficulte?: string;
  complexite?: string;
  rentabiliteEstimee?: string;
  concurrenceNiveau?: string;
  probabiliteSucces?: string;
  ai_model: string;
  created_at: string;
};

export type Quote = {
  id: string;
  tender_id: string;
  user_id: string;
  company_id: string;
  reference: string;
  items: QuoteItem[];
  total_ht?: number;
  total_ttc?: number;
  tva?: number;
  valid_until?: string;
  status: 'draft' | 'finalized' | 'sent';
  created_at: string;
  updated_at: string;
};

export type QuoteItem = {
  id: string;
  quote_id: string;
  produit: string;
  description: string;
  quantite: number;
  unite: string;
  prix_unitaire: number;
  total: number;
};

export type Document = {
  id: string;
  tender_id: string;
  user_id: string;
  name: string;
  type: 'lettre_soumission' | 'declaration_honneur' | 'memoire_technique' | 'bordereau_prix' | 'devis' | 'checklist';
  file_url?: string;
  format: 'pdf' | 'docx';
  status: 'draft' | 'generated';
  created_at: string;
};

export type Competitor = {
  id: string;
  company_name: string;
  market: string;
  amount?: number;
  date: string;
  category: string;
  organisme?: string;
  created_at: string;
};

export type SubscriptionPlan = 'free' | 'pro' | 'premium';

export type Subscription = {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  analyses_used: number;
  analyses_limit: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'expired' | 'canceled';
  created_at: string;
  updated_at: string;
};

export type AnalysisResult = {
  reference: string;
  objet: string;
  organisme: string;
  categorie: string;
  sousCategorie: string;
  region: string;
  budget: number | null;
  dateLimite: string;
  caution: string;
  typeMarche: string;
  secteur: string;
  produits: string[];
  services: string[];
  quantites: { produit: string; quantite: string }[];
  documentsDemandes: string[];
  criteresTechniques: string[];
  criteresFinanciers: string[];
  risques: string[];
  scoreOpportunite: number;
};
