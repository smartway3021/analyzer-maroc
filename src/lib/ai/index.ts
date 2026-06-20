import { AIProviderConfig, AIResponse } from './types'

export const analyzeTender = async (text: string): Promise<AIResponse> => {
  const { createAIProvider, defaultConfig } = await import('./provider')

  const providers: AIProviderConfig[] = [
    defaultConfig,
    { ...defaultConfig, provider: 'simulation' },
  ]

  for (const config of providers) {
    try {
      const provider = createAIProvider(config)
      const result = await provider.analyze(text)
      return result
    } catch (err) {
      if (config.provider === 'simulation') throw err
    }
  }

  throw new Error('Tous les providers AI ont échoué')
}
