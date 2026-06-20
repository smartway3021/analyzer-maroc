import { AIProviderConfig, AIProvider, AIResponse, AIMessage } from './types'
import { SYSTEM_PROMPT } from './prompts'

class OllamaProvider implements AIProvider {
  private config: AIProviderConfig

  constructor(config: AIProviderConfig) {
    this.config = config
  }

  async chat(messages: AIMessage[]): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.message?.content || ''
  }

  async analyze(tenderText: string): Promise<AIResponse> {
    const content = await this.chat([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyse cet appel d'offres marocain et retourne UNIQUEMENT le JSON:\n\n${tenderText}`,
      },
    ])

    return this.parseResponse(content)
  }

  private parseResponse(raw: string): AIResponse {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      reference: parsed.reference || '',
      objet: parsed.objet || '',
      organisme: parsed.organisme || '',
      categorie: parsed.categorie || '',
      sousCategorie: parsed.sousCategorie || '',
      region: parsed.region || '',
      budget: parsed.budget || null,
      dateLimite: parsed.dateLimite || '',
      caution: parsed.caution || '',
      typeMarche: parsed.typeMarche || '',
      secteur: parsed.secteur || '',
      produits: parsed.produits || [],
      services: parsed.services || [],
      quantites: parsed.quantites || [],
      documentsDemandes: parsed.documentsDemandes || [],
      criteresTechniques: parsed.criteresTechniques || [],
      criteresFinanciers: parsed.criteresFinanciers || [],
      risques: parsed.risques || [],
      scoreOpportunite: parsed.scoreOpportunite || 0,
    }
  }
}

class MistralProvider implements AIProvider {
  private config: AIProviderConfig

  constructor(config: AIProviderConfig) {
    this.config = config
  }

  async chat(messages: AIMessage[]): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`Mistral error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  async analyze(tenderText: string): Promise<AIResponse> {
    const content = await this.chat([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyse cet appel d'offres marocain:\n\n${tenderText}`,
      },
    ])

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    return JSON.parse(jsonMatch[0])
  }
}

class QwenProvider implements AIProvider {
  private config: AIProviderConfig

  constructor(config: AIProviderConfig) {
    this.config = config
  }

  async chat(messages: AIMessage[]): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`Qwen error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  async analyze(tenderText: string): Promise<AIResponse> {
    const content = await this.chat([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyse cet appel d'offres marocain et retourne le JSON:\n\n${tenderText}`,
      },
    ])

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    return JSON.parse(jsonMatch[0])
  }
}

class HuggingFaceProvider implements AIProvider {
  private config: AIProviderConfig

  constructor(config: AIProviderConfig) {
    this.config = config
  }

  async chat(messages: AIMessage[]): Promise<string> {
    const model = this.config.model || 'mistralai/Mistral-7B-Instruct-v0.3'
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey
            ? { Authorization: `Bearer ${this.config.apiKey}` }
            : {}),
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 2000,
          temperature: 0.1,
        }),
      }
    )

    if (response.status === 503) {
      await new Promise((r) => setTimeout(r, 5000))
      return this.chat(messages)
    }

    if (!response.ok) {
      throw new Error(`HuggingFace error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  async analyze(tenderText: string): Promise<AIResponse> {
    const content = await this.chat([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyse cet appel d'offres marocain et retourne UNIQUEMENT le JSON valide sans aucun texte avant ou après:\n\n${tenderText}`,
      },
    ])

    return this.parseResponse(content)
  }

  private parseResponse(raw: string): AIResponse {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in HuggingFace response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      reference: parsed.reference || '',
      objet: parsed.objet || '',
      organisme: parsed.organisme || '',
      categorie: parsed.categorie || '',
      sousCategorie: parsed.sousCategorie || '',
      region: parsed.region || '',
      budget: parsed.budget || null,
      dateLimite: parsed.dateLimite || '',
      caution: parsed.caution || '',
      typeMarche: parsed.typeMarche || '',
      secteur: parsed.secteur || '',
      produits: parsed.produits || [],
      services: parsed.services || [],
      quantites: parsed.quantites || [],
      documentsDemandes: parsed.documentsDemandes || [],
      criteresTechniques: parsed.criteresTechniques || [],
      criteresFinanciers: parsed.criteresFinanciers || [],
      risques: parsed.risques || [],
      scoreOpportunite: parsed.scoreOpportunite || 0,
    }
  }
}

class SimulationProvider implements AIProvider {
  async chat(_messages: AIMessage[]): Promise<string> {
    return 'Simulation mode'
  }

  async analyze(_tenderText: string): Promise<AIResponse> {
    await new Promise((r) => setTimeout(r, 1500))

    return {
      reference: 'AO-' + Math.floor(Math.random() * 1000) + '-' + new Date().getFullYear(),
      objet: 'Fourniture de matériaux de construction pour projet de développement communal',
      organisme: 'Commune Urbaine de Casablanca',
      categorie: 'Fournitures',
      sousCategorie: 'Matériaux de construction',
      region: 'Casablanca-Settat',
      budget: 2500000,
      dateLimite: new Date(Date.now() + 21 * 86400000).toLocaleDateString('fr-MA'),
      caution: '50 000 MAD',
      typeMarche: 'Appel d\'offres ouvert',
      secteur: 'BTP et Construction',
      produits: [
        'Ciment CPJ 45',
        'Sable de rivière',
        'Gravier concassé',
        'Fer à béton 12mm',
        'Briques pleines',
        'Carreaux de ciment',
      ],
      services: ['Livraison sur site', 'Stockage temporaire'],
      quantites: [
        { produit: 'Ciment CPJ 45', quantite: '500 tonnes' },
        { produit: 'Sable de rivière', quantite: '800 m³' },
        { produit: 'Gravier concassé', quantite: '600 m³' },
        { produit: 'Fer à béton 12mm', quantite: '120 tonnes' },
        { produit: 'Briques pleines', quantite: '50 000 unités' },
      ],
      documentsDemandes: [
        'Certificat de qualification',
        'Attestation de capacité financière',
        'Déclaration sur l\'honneur',
        'Caution provisoire',
        'Agrément technique',
      ],
      criteresTechniques: [
        'Expérience dans des projets similaires',
        'Capacité de production minimale de 1000 tonnes/mois',
        'Certification ISO 9001',
        'Délai de livraison maximum 30 jours',
      ],
      criteresFinanciers: [
        'Prix global le plus bas pondéré à 60%',
        'Capacité financière minimale de 2M MAD',
        'Chiffre d\'affaires minimal de 5M MAD sur 3 ans',
      ],
      risques: [
        'Délai serré de livraison',
        'Concurrence élevée (plus de 10 soumissionnaires attendus)',
        'Variabilité des prix des matières premières',
        'Exigences administratives complexes',
      ],
      scoreOpportunite: 72,
    }
  }
}

export function createAIProvider(config: AIProviderConfig): AIProvider {
  try {
    switch (config.provider) {
      case 'simulation':
        return new SimulationProvider()
      case 'ollama':
        return new OllamaProvider(config)
      case 'llama':
        return new OllamaProvider({ ...config, provider: 'ollama' })
      case 'mistral':
        return new MistralProvider(config)
      case 'qwen':
        return new QwenProvider(config)
      case 'huggingface':
        return new HuggingFaceProvider(config)
      default:
        return new HuggingFaceProvider(config)
    }
  } catch {
    return new SimulationProvider()
  }
}

export const defaultConfig: AIProviderConfig = {
  provider: (process.env.AI_PROVIDER as AIProviderConfig['provider']) || 'huggingface',
  baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3',
  apiKey: process.env.HF_API_KEY,
}
