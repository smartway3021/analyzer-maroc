'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileSearch, Brain, FileText, Shield, BarChart3, CheckCircle, Search } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileSearch className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">AI Tender Maroc</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Essai gratuit</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-background/50 text-sm mb-6">
                <Brain className="w-4 h-4 text-primary" />
                Analyse IA pour les marchés marocains
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
                Analysez les appels d'offres avec{' '}
                <span className="text-primary">l'intelligence artificielle</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Gagnez du temps et maximisez vos chances de remporter les marchés publics au Maroc.
                Notre IA analyse, comprend et vous aide à préparer vos soumissions en quelques minutes.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Commencer gratuitement
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Voir la démo
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Sans inscription
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> IA gratuite
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Sans carte
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Comment ça marche</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Trois étapes simples pour analyser et répondre aux appels d'offres
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileSearch,
                  title: 'Importez votre marché',
                  desc: 'Collez un lien URL ou déposez un fichier PDF/Word. Notre système extrait automatiquement le contenu.',
                },
                {
                  icon: Brain,
                  title: 'Analyse IA automatique',
                  desc: 'L\'intelligence artificielle analyse le document, identifie les produits, services, critères et risques.',
                },
                {
                  icon: FileText,
                  title: 'Générez vos documents',
                  desc: 'Créez devis, lettres de soumission et documents administratifs prêts à soumettre.',
                },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeIn}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="gradient-card rounded-xl p-8 border text-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-primary mb-2">Étape {i + 1}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Fonctionnalités</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Tout ce dont vous avez besoin pour gagner des marchés publics
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Brain, title: 'Analyse IA', desc: 'Compréhension intelligente du besoin réel' },
                { icon: BarChart3, title: 'Score d\'opportunité', desc: 'Évaluez vos chances de succès' },
                { icon: FileText, title: 'Génération documents', desc: 'PDF et DOCX en un clic' },
                { icon: Shield, title: 'Conformité', desc: 'Documents aux normes marocaines' },
                { icon: Search, title: 'Veille concurrentielle', desc: 'Analyse des marchés similaires' },
                { icon: CheckCircle, title: 'Checklist complète', desc: 'Ne rien oublier dans votre soumission' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeIn}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="rounded-xl p-6 border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Choisissez le plan adapté à votre entreprise
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: 'Gratuit',
                  price: '0',
                  desc: 'Pour découvrir la plateforme',
                  features: ['5 analyses/mois', 'Export PDF', 'Dashboard basique', 'Support email'],
                },
                {
                  name: 'Pro',
                  price: '299',
                  desc: 'Pour les PME actives',
                  features: ['Analyses illimitées', 'Tous les documents', 'Génération devis IA', 'Import par lien URL', 'Support prioritaire'],
                  popular: true,
                },
                {
                  name: 'Premium',
                  price: '599',
                  desc: 'Pour les soumissionnaires intensifs',
                  features: ['Tout le plan Pro', 'Intelligence concurrentielle', 'Exports avancés', 'Assistant IA complet', 'API accessible', 'Comptes multiples'],
                },
              ].map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeIn}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`rounded-xl p-8 border ${
                    plan.popular
                      ? 'border-primary shadow-lg shadow-primary/10 relative'
                      : 'bg-card'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Le plus populaire
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">MAD/mois</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.name === 'Gratuit' ? 'Essayer gratuitement' : 'Choisir ce plan'}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Prêt à transformer votre façon de répondre aux appels d'offres ?
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Rejoignez les entreprises marocaines qui utilisent déjà AI Tender Analyzer pour gagner plus de marchés.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-sm">
              <div>
                <div className="flex items-center gap-2 font-semibold mb-4">
                  <FileSearch className="w-4 h-4 text-primary" />
                  AI Tender Maroc
                </div>
                <p className="text-muted-foreground">
                  Analyse intelligente d'appels d'offres marocains.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-3">Produit</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Fonctionnalités</li>
                  <li>Pricing</li>
                  <li>API</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Entreprise</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>À propos</li>
                  <li>Blog</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Légal</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>CGU</li>
                  <li>Confidentialité</li>
                  <li>Mentions légales</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AI Tender Analyzer Maroc. Tous droits réservés.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
