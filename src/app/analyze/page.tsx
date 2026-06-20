'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Link2,
  Upload,
  Loader2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
  Shield,
  Download,
  ArrowRight,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
import { analyzeTender } from '@/lib/ai'

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [manualText, setManualText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('url')

  const handleUrlAnalyze = async () => {
    if (!url) return
    setAnalyzing(true)
    try {
      const analysis = await analyzeTender(url)
      setResult(analysis)
      toast.success('Analyse terminée')
    } catch (err) {
      toast.error('Erreur lors de l\'analyse')
    }
    setAnalyzing(false)
  }

  const handleTextAnalyze = async () => {
    if (!manualText) return
    setAnalyzing(true)
    try {
      const analysis = await analyzeTender(manualText)
      setResult(analysis)
      toast.success('Analyse terminée')
    } catch (err) {
      toast.error('Erreur lors de l\'analyse')
    }
    setAnalyzing(false)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    onDrop: async (files) => {
      toast.info('Fichier reçu, analyse en cours...')
      setAnalyzing(true)
      setTimeout(() => {
        setAnalyzing(false)
        toast.success('Analyse terminée (simulation)')
      }, 2000)
    },
  })

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-500'
    if (score >= 40) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-emerald-500'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analyser un marché</h1>
          <p className="text-muted-foreground">
            Importez un appel d'offres pour l'analyser avec l'intelligence artificielle
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Source du marché</CardTitle>
              <CardDescription>
                Collez un lien ou importez un document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="url" className="gap-1.5">
                    <Link2 className="w-3.5 h-3.5" /> URL
                  </TabsTrigger>
                  <TabsTrigger value="file" className="gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Fichier
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Texte
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Lien de l'appel d'offres</Label>
                    <Input
                      placeholder="https://marche-public.ma/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full gap-2"
                    onClick={handleUrlAnalyze}
                    disabled={analyzing || !url}
                  >
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {analyzing ? 'Analyse en cours...' : 'Analyser'}
                  </Button>
                </TabsContent>

                <TabsContent value="file" className="space-y-4 pt-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Déposez le fichier' : 'Glissez-déposez un fichier'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF ou DOCX
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Coller le texte du marché</Label>
                    <Textarea
                      placeholder="Copiez le texte de l'appel d'offres ici..."
                      className="min-h-[200px]"
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full gap-2"
                    onClick={handleTextAnalyze}
                    disabled={analyzing || !manualText}
                  >
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {analyzing ? 'Analyse en cours...' : 'Analyser'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Score d'opportunité</p>
                      <p className={`text-3xl font-bold ${getScoreColor(result.scoreOpportunite)}`}>
                        {result.scoreOpportunite}%
                      </p>
                    </div>
                    <div className="w-20 h-20 relative">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="oklch(0.9 0 0)"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={getScoreBg(result.scoreOpportunite)}
                          strokeWidth="3"
                          strokeDasharray={`${result.scoreOpportunite}, 100`}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Difficulté', value: result.difficulte || 'Moyenne' },
                      { label: 'Complexité', value: result.complexite || 'Moyenne' },
                      { label: 'Rentabilité', value: result.rentabiliteEstimee || 'Élevée' },
                      { label: 'Concurrence', value: result.concurrenceNiveau || 'Moyenne' },
                    ].map((item) => (
                      <div key={item.label} className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full gap-2" onClick={() => window.location.href = '/quotes'}>
                Créer un devis <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations du marché</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Référence</p>
                    <p className="text-sm font-medium">{result.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Organisme</p>
                    <p className="text-sm font-medium">{result.organisme}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Catégorie</p>
                    <p className="text-sm font-medium">{result.categorie}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Région</p>
                    <p className="text-sm font-medium">{result.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium">
                      {result.budget ? `${result.budget.toLocaleString()} MAD` : 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date limite</p>
                    <p className="text-sm font-medium">{result.dateLimite}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Objet</p>
                  <p className="text-sm font-medium">{result.objet}</p>
                </div>

                <Separator className="my-4" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Produits
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.produits?.map((p: string) => (
                        <Badge key={p} variant="secondary">{p}</Badge>
                      ))}
                    </div>

                    {result.quantites?.length > 0 && (
                      <>
                        <p className="text-sm font-medium mt-4 mb-2">Quantités</p>
                        <div className="space-y-1">
                          {result.quantites.map((q: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm p-1.5 rounded bg-muted/50">
                              <span>{q.produit}</span>
                              <span className="font-medium">{q.quantite}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Services
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.services?.map((s: string) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Critères techniques
                    </p>
                    <ul className="space-y-1">
                      {result.criteresTechniques?.map((c: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-500" />
                      Critères financiers
                    </p>
                    <ul className="space-y-1">
                      {result.criteresFinanciers?.map((c: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {result.risques?.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Risques identifiés
                      </p>
                      <ul className="space-y-1">
                        {result.risques.map((r: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2 text-red-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {result.documentsDemandes?.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-primary" />
                        Documents demandés
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.documentsDemandes.map((d: string) => (
                          <Badge key={d} variant="outline">{d}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}


