import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTreatments, useTreatmentCompliance, useLogDose, useCreateTreatment, useAITreatmentSuggestion } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/treatments/')({
  component: TreatmentsPage,
})

function TreatmentsPage() {
  const { data: treatments, isLoading } = useTreatments(true)
  const { data: compliance } = useTreatmentCompliance(30)
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<number | null>(null)
  const logDoseMutation = useLogDose(selectedTreatmentId!)
  const createTreatmentMutation = useCreateTreatment()
  const aiSuggestionMutation = useAITreatmentSuggestion()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [form, setForm] = useState<{ name: string; dose: string; frequency: 'daily' | 'weekly' | 'as_needed'; timing: 'morning' | 'afternoon' | 'evening' | 'bedtime'; notes: string }>({ name: '', dose: '', frequency: 'daily', timing: 'morning', notes: '' })
  const [aiForm, setAiForm] = useState({ context: '', goal: '' })

  const handleLogDose = (treatmentId: number, taken: boolean) => {
    setSelectedTreatmentId(treatmentId)
    logDoseMutation.mutate({ taken, time: new Date().toTimeString().slice(0,5) })
  }

  const handleCreate = () => {
    createTreatmentMutation.mutate(form, { onSuccess: () => setIsAddOpen(false) })
  }

  const handleAISuggestion = () => {
    aiSuggestionMutation.mutate(aiForm, { onSuccess: () => {} })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Traitements & Suppléments</h1>
        <div className="flex gap-2">
          <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Suggestion IA</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Générer une suggestion de traitement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Contexte (symptômes, valeurs)</Label>
                  <Input value={aiForm.context} onChange={(e) => setAiForm({ ...aiForm, context: e.target.value })} placeholder="Ex: Ferritine 18 ng/mL" />
                </div>
                <div>
                  <Label>Objectif</Label>
                  <Input value={aiForm.goal} onChange={(e) => setAiForm({ ...aiForm, goal: e.target.value })} placeholder="Ex: Augmenter ferritine à 50" />
                </div>
                <Button onClick={handleAISuggestion} disabled={aiSuggestionMutation.isPending}>
                  {aiSuggestionMutation.isPending ? 'Génération...' : 'Générer'}
                </Button>
                {aiSuggestionMutation.data && (
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="font-bold">{aiSuggestionMutation.data.name} - {aiSuggestionMutation.data.dose}</p>
                    <p className="text-sm">{aiSuggestionMutation.data.reasoning}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter un traitement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau traitement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label>Nom</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Dose</Label><Input value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} /></div>
                <div>
                  <Label>Fréquence</Label>
                  <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v as 'daily' | 'weekly' | 'as_needed' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="as_needed">Au besoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Horaire</Label>
                  <Select value={form.timing} onValueChange={(v) => setForm({ ...form, timing: v as 'morning' | 'afternoon' | 'evening' | 'bedtime' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matin</SelectItem>
                      <SelectItem value="afternoon">Après-midi</SelectItem>
                      <SelectItem value="evening">Soir</SelectItem>
                      <SelectItem value="bedtime">Au coucher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} disabled={createTreatmentMutation.isPending}>
                  {createTreatmentMutation.isPending ? 'Ajout...' : 'Ajouter'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Treatments */}
      <Card>
        <CardHeader>
          <CardTitle>Traitements actifs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : treatments?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatments.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.dose}</TableCell>
                    <TableCell className="capitalize">{t.frequency}</TableCell>
                    <TableCell className="capitalize">{t.timing || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === 'active' ? 'default' : 'secondary'}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleLogDose(t.id, true)}>
                        Pris
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Aucun traitement actif</p>
          )}
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Observance (30 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          {compliance ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compliance.map((c) => (
                <div key={c.treatment_id} className="p-4 rounded-lg bg-muted">
                  <p className="font-medium">{c.treatment_name}</p>
                  <p className="text-2xl font-bold mt-2">{c.compliance_rate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">
                    {c.taken_doses} / {c.total_doses} prises
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée d'observance</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}