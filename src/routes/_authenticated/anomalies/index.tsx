import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAnomalies, useAcknowledgeAnomaly, useResolveAnomaly } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_authenticated/anomalies/')({
  component: AnomaliesPage,
})

function AnomaliesPage() {
  const { data: anomalies, isLoading } = useAnomalies({ status: 'active' })
  const acknowledgeMutation = useAcknowledgeAnomaly()
  const resolveMutation = useResolveAnomaly()
  const [resolvingId, setResolvingId] = useState<number | null>(null)
  const [resolution, setResolution] = useState('')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }

  const handleAcknowledge = (id: number) => {
    acknowledgeMutation.mutate(id)
  }

  const handleResolve = () => {
    if (resolvingId) {
      resolveMutation.mutate({ id: resolvingId, resolution }, { onSuccess: () => { setResolvingId(null); setResolution('') } })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Anomalies & Alertes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Anomalies actives</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : anomalies?.items?.length ? (
            <div className="space-y-4">
              {anomalies.items.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(anomaly.severity)}`} />
                    <div>
                      <p className="font-medium">{anomaly.message}</p>
                      <p className="text-sm text-muted-foreground">
                        Détecté le {new Date(anomaly.detected_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}>
                      {anomaly.severity}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleAcknowledge(anomaly.id)} disabled={acknowledgeMutation.isPending}>
                      Acquitter
                    </Button>
                    <Dialog open={resolvingId === anomaly.id} onOpenChange={(open) => { if (!open) setResolvingId(null); else setResolvingId(anomaly.id) }}>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm">Résoudre</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Résoudre l'anomalie</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Résolution</Label>
                            <Input value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Ex: Traitement commencé" />
                          </div>
                          <Button onClick={handleResolve} disabled={resolveMutation.isPending || !resolution}>
                            {resolveMutation.isPending ? 'Envoi...' : 'Confirmer'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune anomalie active</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}