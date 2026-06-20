'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Building2, Upload, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'

export default function CompanyPage() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    rc: '',
    if_: '',
    ice: '',
    cnss: '',
    patente: '',
    responsable: '',
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Informations sauvegardées')
    setSaving(false)
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    onDrop: () => toast.success('Logo téléchargé'),
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mon entreprise</h1>
          <p className="text-muted-foreground">
            Informations utilisées dans vos documents et devis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Logo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors max-w-xs"
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Télécharger le logo</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations légales</CardTitle>
            <CardDescription>
              RC, IF, ICE, CNSS, Patente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Raison sociale *</Label>
              <Input
                placeholder="Nom de l'entreprise"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input
                  placeholder="Adresse"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  placeholder="Ville"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  placeholder="+212 6XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="contact@entreprise.ma"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>RC</Label>
                <Input
                  placeholder="Registre de commerce"
                  value={form.rc}
                  onChange={(e) => updateField('rc', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>IF</Label>
                <Input
                  placeholder="Identifiant fiscal"
                  value={form.if_}
                  onChange={(e) => updateField('if_', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ICE *</Label>
                <Input
                  placeholder="ICE (15 chiffres)"
                  maxLength={15}
                  value={form.ice}
                  onChange={(e) => updateField('ice', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>CNSS</Label>
                <Input
                  placeholder="CNSS"
                  value={form.cnss}
                  onChange={(e) => updateField('cnss', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patente</Label>
                <Input
                  placeholder="Patente"
                  value={form.patente}
                  onChange={(e) => updateField('patente', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Responsable</Label>
                <Input
                  placeholder="Nom du responsable"
                  value={form.responsable}
                  onChange={(e) => updateField('responsable', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Signature & Cachet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input {...getInputProps()} />
                <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Signature</p>
              </div>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input {...getInputProps()} />
                <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Cachet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </DashboardLayout>
  )
}
