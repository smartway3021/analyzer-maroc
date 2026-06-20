'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, FileText, TrendingUp, Target, ArrowUp, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { name: 'Jan', analyses: 4, opportunites: 2 },
  { name: 'Fév', analyses: 7, opportunites: 4 },
  { name: 'Mar', analyses: 5, opportunites: 3 },
  { name: 'Avr', analyses: 9, opportunites: 6 },
  { name: 'Mai', analyses: 12, opportunites: 8 },
  { name: 'Juin', analyses: 8, opportunites: 5 },
]

const recentAnalyses = [
  { title: 'Fourniture matériaux construction', reference: 'RFQ-2024-128', date: '2024-06-15', score: 85 },
  { title: 'Entretien espaces verts', reference: 'AO-2024-045', date: '2024-06-14', score: 62 },
  { title: 'Travaux rénovation école', reference: 'MDP-2024-089', date: '2024-06-12', score: 73 },
  { title: 'Services nettoyage industriel', reference: 'RFQ-2024-156', date: '2024-06-10', score: 91 },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, label: 'Marchés analysés', value: '24', change: '+12%', trend: 'up' },
            { icon: Target, label: 'Opportunités', value: '8', change: '+5%', trend: 'up' },
            { icon: FileText, label: 'Documents générés', value: '36', change: '+18%', trend: 'up' },
            { icon: TrendingUp, label: 'Taux succès', value: '67%', change: '+3%', trend: 'up' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <kpi.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {kpi.change}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analyse mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.22 260)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="oklch(0.55 0.22 260)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} />
                    <YAxis fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="analyses"
                      stroke="oklch(0.55 0.22 260)"
                      fill="url(#colorAnalyses)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="opportunites"
                      stroke="oklch(0.6 0.2 280)"
                      fill="oklch(0.6 0.2 280 / 0.1)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analyses récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((item, i) => (
                  <motion.div
                    key={item.reference}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.reference} · {item.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                        item.score >= 60 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.score}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
