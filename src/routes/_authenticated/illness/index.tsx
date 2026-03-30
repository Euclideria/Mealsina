import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useIllnesses, useQuickSickLog, useCreateIllness } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_authenticated/illness/')({
  component: IllnessPage,
})

function IllnessPage() {
  const { data: illnesses, isLoading } = useIllnesses('all')
  const quickSickMutation = useQuickSickLog()
  const createIllnessMutation = useCreateIllness()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', start_date: '', symptoms: '', notes: '' })

  const handleQuickSick = (feeling: 'sick' | 'healthy') => {
    quickSickMutation.mutate({ feeling })
  }

  const handleCreate = () => {
    createIllnessMutation.mutate(
      { name: form.name, start_date: form.start_date, symptoms: form.symptoms.split(',').map(s => s.trim()) },
      { onSuccess: () => setIsAddOpen(false) }
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Maladies & Symptômes</h1>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter une maladie</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle maladie</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label>Nom</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Date de début</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                <div><Label>Symptômes (séparés par virgule)</Label><Input value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder="fievre, fatigue, toux" /></div>
                <Button onClick={handleCreate} disabled={createIllnessMutation.isPending}>
                  {createIllnessMutation.isPending ? 'Ajout...' : 'Ajouter'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="destructive" onClick={() => handleQuickSick('sick')} disabled={quickSickMutation.isPending}>
          Je suis malade
        </Button>
        <Button onClick={() => handleQuickSick('healthy')} disabled={quickSickMutation.isPending}>
          Je vais bien
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des maladies</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : illnesses?.length ? (
            <div className="space-y-4">
              {illnesses.map((illness) => (
                <div key={illness.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{illness.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Du {new Date(illness.start_date).toLocaleDateString('fr-FR')}
                        {illness.end_date && ` au ${new Date(illness.end_date).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                    <Badge variant={illness.status === 'active' ? 'default' : 'secondary'}>
                      {illness.status === 'active' ? 'Actif' : 'Résolu'}
                    </Badge>
                  </div>
                  {illness.symptoms?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {illness.symptoms.map((symptom, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune maladie enregistrée</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}