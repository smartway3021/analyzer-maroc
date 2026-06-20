'use client'

import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Gratuit',
      price: '0',
      desc: 'Pour découvrir la plateforme',
      features: ['5 analyses/mois', 'Export PDF basique', 'Dashboard', 'Support email'],
    },
    {
      name: 'Pro',
      price: '299',
      desc: 'Pour les PME actives',
      features: [
        'Analyses illimitées',
        'Tous les documents (PDF, DOCX)',
        'Génération devis IA',
        'Import URL et fichiers',
        'Support prioritaire',
        'Stockage documents',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: '599',
      desc: 'Pour les soumissionnaires intensifs',
      features: [
        'Tout le plan Pro',
        'Intelligence concurrentielle',
        'Exports avancés',
        'Assistant IA complet',
        'API accessible',
        'Comptes multiples',
        'Formation dédiée',
      ],
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
          <p className="mt-2 text-muted-foreground">
            Choisissez le plan adapté à votre activité
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Le plus populaire
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1 text-sm">MAD/mois</span>
                </div>
                <CardDescription className="mt-2">{plan.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.name === 'Gratuit' ? 'Commencer' : `Passer à ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
