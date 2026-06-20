'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, TrendingUp, BarChart3 } from 'lucide-react'

const competitorsData = [
  { company: 'BTP Maroc SARL', market: 'Construction', amount: 2500000, date: '2024-05', category: 'Travaux' },
  { company: 'Matériaux Plus SA', market: 'Fournitures', amount: 890000, date: '2024-04', category: 'Fournitures' },
  { company: 'Nettoyage Pro', market: 'Services', amount: 450000, date: '2024-03', category: 'Services' },
  { company: 'Construxion Moderne', market: 'Construction', amount: 3200000, date: '2024-02', category: 'Travaux' },
]

export default function CompetitorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Intelligence concurrentielle</h1>
          <p className="text-muted-foreground">
            Analyse des marchés similaires et des concurrents
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{competitorsData.length}</p>
              <p className="text-sm text-muted-foreground">Concurrents identifiés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold">2.5M MAD</p>
              <p className="text-sm text-muted-foreground">Montant moyen des marchés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold">Construction</p>
              <p className="text-sm text-muted-foreground">Secteur le plus actif</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Marchés similaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {competitorsData.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{c.company}</p>
                    <p className="text-xs text-muted-foreground">{c.market} · {c.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{c.category}</Badge>
                    <span className="text-sm font-medium">{c.amount.toLocaleString()} MAD</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
