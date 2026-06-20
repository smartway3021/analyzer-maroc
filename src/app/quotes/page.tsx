'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Download, FileText, Printer, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

interface QuoteItem {
  id: string
  produit: string
  description: string
  quantite: number
  unite: string
  prix_unitaire: number
}

export default function QuotesPage() {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newItem, setNewItem] = useState({
    produit: '',
    description: '',
    quantite: 1,
    unite: 'U',
    prix_unitaire: 0,
  })

  const addItem = () => {
    if (!newItem.produit || newItem.prix_unitaire <= 0) {
      toast.error('Produit et prix requis')
      return
    }
    setItems([
      ...items,
      { ...newItem, id: crypto.randomUUID() },
    ])
    setNewItem({ produit: '', description: '', quantite: 1, unite: 'U', prix_unitaire: 0 })
    setShowForm(false)
    toast.success('Article ajouté')
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const totalHT = items.reduce((sum, i) => sum + i.quantite * i.prix_unitaire, 0)
  const tva = totalHT * 0.2
  const totalTTC = totalHT + tva

  const generatePDF = async () => {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
    const doc = await PDFDocument.create()
    const page = doc.addPage([595.28, 841.89])
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

    let y = 780
    page.drawText('DEVIS', { x: 50, y, size: 24, font: fontBold })
    y -= 20
    page.drawText(`Date: ${new Date().toLocaleDateString('fr-MA')}`, { x: 50, y, size: 10, font })

    y -= 30
    page.drawText('Désignation', { x: 50, y, size: 10, font: fontBold })
    page.drawText('Qté', { x: 300, y, size: 10, font: fontBold })
    page.drawText('PU', { x: 370, y, size: 10, font: fontBold })
    page.drawText('Total', { x: 470, y, size: 10, font: fontBold })

    y -= 15
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) })

    for (const item of items) {
      y -= 20
      page.drawText(item.produit, { x: 50, y, size: 9, font })
      page.drawText(`${item.quantite}`, { x: 300, y, size: 9, font })
      page.drawText(`${item.prix_unitaire.toFixed(2)}`, { x: 370, y, size: 9, font })
      page.drawText(`${(item.quantite * item.prix_unitaire).toFixed(2)}`, { x: 470, y, size: 9, font })
    }

    y -= 30
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) })
    y -= 20
    page.drawText(`Total HT: ${totalHT.toFixed(2)} MAD`, { x: 400, y, size: 10, font: fontBold })
    y -= 15
    page.drawText(`TVA (20%): ${tva.toFixed(2)} MAD`, { x: 400, y, size: 10, font })
    y -= 15
    page.drawText(`Total TTC: ${totalTTC.toFixed(2)} MAD`, { x: 400, y, size: 12, font: fontBold, color: rgb(0.2, 0.4, 0.8) })

    const pdfBytes = await doc.save()
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'devis.pdf'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('PDF téléchargé')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Devis</h1>
            <p className="text-muted-foreground">Créez et gérez vos devis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generatePDF} disabled={items.length === 0} className="gap-2">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Ajouter
            </Button>
          </div>
        </div>

        {showForm && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Produit</Label>
                  <Input
                    placeholder="Nom"
                    value={newItem.produit}
                    onChange={(e) => setNewItem({ ...newItem, produit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Optionnel"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qté</Label>
                  <Input
                    type="number"
                    value={newItem.quantite}
                    onChange={(e) => setNewItem({ ...newItem, quantite: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prix unitaire (MAD)</Label>
                  <Input
                    type="number"
                    value={newItem.prix_unitaire}
                    onChange={(e) => setNewItem({ ...newItem, prix_unitaire: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={addItem}>Ajouter</Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">PU (MAD)</TableHead>
                  <TableHead className="text-right">Total (MAD)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucun article. Cliquez sur "Ajouter" pour commencer.
                    </TableCell>
                  </TableRow>
                )}
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.produit}</TableCell>
                    <TableCell className="text-muted-foreground">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantite} {item.unite}</TableCell>
                    <TableCell className="text-right">{item.prix_unitaire.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {(item.quantite * item.prix_unitaire).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {items.length > 0 && (
          <Card className="ml-auto max-w-xs">
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total HT</span>
                <span className="font-medium">{totalHT.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">TVA (20%)</span>
                <span>{tva.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total TTC</span>
                <span className="text-primary">{totalTTC.toFixed(2)} MAD</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
