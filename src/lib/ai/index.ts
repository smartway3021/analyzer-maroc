export { createAIProvider, defaultConfig } from './provider'
export type { AIProviderConfig, AIProvider, AIResponse, AIMessage } from './types'
export const analyzeTender = async (text: string) => {
  const { createAIProvider, defaultConfig } = await import('./provider')
  const provider = createAIProvider(defaultConfig)
  return provider.analyze(text)
}
