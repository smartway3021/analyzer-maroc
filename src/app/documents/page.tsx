'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, File, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const documentTypes = [
  {
    id: 'lettre_soumission',
    label: 'Lettre de soumission',
    desc: 'Lettre d\'accompagnement de votre offre',
    icon: FileText,
  },
  {
    id: 'declaration_honneur',
    label: 'Déclaration sur l\'honneur',
    desc: 'Attestation de conformité',
    icon: FileText,
  },
  {
    id: 'memoire_technique',
    label: 'Mémoire technique',
    desc: 'Présentation détaillée de votre offre technique',
    icon: FileText,
  },
  {
    id: 'bordereau_prix',
    label: 'Bordereau des prix',
    desc: 'Détail des prix unitaires',
    icon: File,
  },
  {
    id: 'checklist',
    label: 'Checklist administrative',
    desc: 'Liste des documents à fournir',
    icon: FileText,
  },
]

export default function DocumentsPage() {
  const [generating, setGenerating] = useState<string | null>(null)

  const generateDoc = async (type: string) => {
    setGenerating(type)
    await new Promise((r) => setTimeout(r, 1500))

    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx')
    const { saveAs } = await import('file-saver')

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'AI Tender Analyzer Maroc', bold: true, size: 32 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Document: ${documentTypes.find(d => d.id === type)?.label}`, size: 24 })],
          }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [new TextRun({ text: 'Généré automatiquement par AI Tender Analyzer Maroc', size: 20 })],
          }),
          new Paragraph({ children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString('fr-MA')}`, size: 20 })] }),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${type}.docx`)

    setGenerating(null)
    toast.success('Document généré')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Générez les documents nécessaires à votre soumission
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <doc.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">{doc.label}</CardTitle>
                <CardDescription>{doc.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => generateDoc(doc.id)}
                    disabled={generating === doc.id}
                  >
                    {generating === doc.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    DOCX
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                    toast.info('Export PDF - À implémenter')
                  }}>
                    <FileText className="w-3.5 h-3.5" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
