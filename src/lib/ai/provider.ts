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

export function createAIProvider(config: AIProviderConfig): AIProvider {
  switch (config.provider) {
    case 'ollama':
      return new OllamaProvider(config)
    case 'mistral':
      return new MistralProvider(config)
    case 'qwen':
      return new QwenProvider(config)
    case 'llama':
      return new OllamaProvider({ ...config, provider: 'ollama' })
    default:
      return new OllamaProvider(config)
  }
}

export const defaultConfig: AIProviderConfig = {
  provider: (process.env.AI_PROVIDER as AIProviderConfig['provider']) || 'ollama',
  baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3.2',
}
