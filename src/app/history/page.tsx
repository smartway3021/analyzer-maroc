'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, FileText, ExternalLink } from 'lucide-react'

const historyData = [
  { id: '1', title: 'Fourniture matériaux construction', ref: 'RFQ-2024-128', date: '15/06/2024', status: 'analyzed', score: 85 },
  { id: '2', title: 'Entretien espaces verts', ref: 'AO-2024-045', date: '14/06/2024', status: 'quoted', score: 62 },
  { id: '3', title: 'Travaux rénovation école', ref: 'MDP-2024-089', date: '12/06/2024', status: 'submitted', score: 73 },
  { id: '4', title: 'Services nettoyage industriel', ref: 'RFQ-2024-156', date: '10/06/2024', status: 'won', score: 91 },
  { id: '5', title: 'Fourniture équipements informatiques', ref: 'AO-2024-234', date: '08/06/2024', status: 'lost', score: 45 },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  analyzed: { label: 'Analysé', color: 'bg-blue-100 text-blue-700' },
  quoted: { label: 'Devis créé', color: 'bg-amber-100 text-amber-700' },
  submitted: { label: 'Soumis', color: 'bg-purple-100 text-purple-700' },
  won: { label: 'Gagné', color: 'bg-emerald-100 text-emerald-700' },
  lost: { label: 'Perdu', color: 'bg-red-100 text-red-700' },
}

export default function HistoryPage() {
  const [search, setSearch] = useState('')

  const filtered = historyData.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.ref.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Historique</h1>
          <p className="text-muted-foreground">
            Tous vos marchés analysés
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.ref} · {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusLabels[item.status].color}>
                      {statusLabels[item.status].label}
                    </Badge>
                    <span className={`text-sm font-medium ${
                      item.score >= 70 ? 'text-emerald-600' : item.score >= 40 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {item.score}%
                    </span>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
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
