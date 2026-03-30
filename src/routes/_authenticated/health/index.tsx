import { createFileRoute } from '@tanstack/react-router'
import { useGarminStatus, useGarminLatest, useSyncGarmin, useSchedulerStatus, useEnableScheduler, useDisableScheduler, useHealthMetrics } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_authenticated/health/')({
  component: HealthPage,
})

function HealthPage() {
  const { data: garminStatus, isLoading: statusLoading } = useGarminStatus()
  const { data: garminLatest, isLoading: latestLoading } = useGarminLatest()
  const { data: schedulerStatus, isLoading: schedulerLoading } = useSchedulerStatus()
  const { data: healthMetrics, isLoading: metricsLoading } = useHealthMetrics({ days: 7 })
  const syncMutation = useSyncGarmin()
  const enableMutation = useEnableScheduler()
  const disableMutation = useDisableScheduler()

  const handleSync = () => {
    syncMutation.mutate()
  }

  const handleSchedulerToggle = (enabled: boolean) => {
    if (enabled) {
      enableMutation.mutate()
    } else {
      disableMutation.mutate()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Santé & Garmin</h1>
        <Button onClick={handleSync} disabled={syncMutation.isPending}>
          {syncMutation.isPending ? 'Synchronisation...' : 'Synchroniser Garmin'}
        </Button>
      </div>

      {/* Garmin Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Statut Garmin
            {statusLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : garminStatus?.status === 'connected' ? (
              <Badge variant="default" className="bg-green-500">Connecté</Badge>
            ) : (
              <Badge variant="destructive">Déconnecté</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statusLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Dernière sync</p>
                <p className="font-medium">
                  {garminStatus?.last_sync
                    ? new Date(garminStatus.last_sync).toLocaleString('fr-FR')
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jours disponibles</p>
                <p className="font-medium">{garminStatus?.days_available ?? '-'} jours</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Metrics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières métriques</CardTitle>
        </CardHeader>
        <CardContent>
          {latestLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : garminLatest ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{garminLatest.steps}</p>
                <p className="text-sm text-muted-foreground">Pas</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{garminLatest.sleep_score}</p>
                <p className="text-sm text-muted-foreground">Sommeil</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{garminLatest.resting_heart_rate}</p>
                <p className="text-sm text-muted-foreground">FC Repos</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{garminLatest.stress_level}</p>
                <p className="text-sm text-muted-foreground">Stress</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{garminLatest.recovery}</p>
                <p className="text-sm text-muted-foreground">Récupération</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>

      {/* Scheduler Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Synchronisation automatique</CardTitle>
        </CardHeader>
        <CardContent>
          {schedulerLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <div className="flex items-center gap-4">
              <Switch
                checked={schedulerStatus?.enabled ?? false}
                onCheckedChange={handleSchedulerToggle}
              />
              <span className="text-sm text-muted-foreground">
                {schedulerStatus?.enabled
                  ? `Planifié: ${schedulerStatus.schedule}`
                  : 'Désactivé'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Metrics History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique (7 jours)</CardTitle>
        </CardHeader>
        <CardContent>
          {metricsLoading ? (
            <Skeleton className="h-32" />
          ) : healthMetrics?.items?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left">Date</th>
                    <th className="pb-2 text-right">Pas</th>
                    <th className="pb-2 text-right">Sommeil</th>
                    <th className="pb-2 text-right">FC Repos</th>
                    <th className="pb-2 text-right">Stress</th>
                    <th className="pb-2 text-right">Récup.</th>
                  </tr>
                </thead>
                <tbody>
                  {healthMetrics.items.map((metric) => (
                    <tr key={metric.date} className="border-b">
                      <td className="py-2">{new Date(metric.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2 text-right">{metric.steps.toLocaleString()}</td>
                      <td className="py-2 text-right">{metric.sleep_score}</td>
                      <td className="py-2 text-right">{metric.resting_heart_rate}</td>
                      <td className="py-2 text-right">{metric.stress_level}</td>
                      <td className="py-2 text-right">{metric.recovery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée historique</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}