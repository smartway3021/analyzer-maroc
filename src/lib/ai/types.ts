export interface AIProviderConfig {
  provider: 'ollama' | 'llama' | 'mistral' | 'qwen' | 'huggingface' | 'simulation'
  baseUrl: string
  model: string
  apiKey?: string
}

export interface AIProvider {
  analyze(tenderText: string): Promise<AIResponse>
  chat(messages: AIMessage[]): Promise<string>
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  reference: string
  objet: string
  organisme: string
  categorie: string
  sousCategorie: string
  region: string
  budget: number | null
  dateLimite: string
  caution: string
  typeMarche: string
  secteur: string
  produits: string[]
  services: string[]
  quantites: { produit: string; quantite: string }[]
  documentsDemandes: string[]
  criteresTechniques: string[]
  criteresFinanciers: string[]
  risques: string[]
  scoreOpportunite: number
}
