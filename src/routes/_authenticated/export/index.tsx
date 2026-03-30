import { createFileRoute } from '@tanstack/react-router'
import { useSystemStatus } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_authenticated/export/')({
  component: ExportPage,
})

function ExportPage() {
  const { data: status, isLoading } = useSystemStatus()

  const handleExportAll = () => {
    window.open('http://89.167.112.85:8000/api/v1/system/export/all', '_blank')
  }

  const handleExportGarmin = () => {
    window.open('http://89.167.112.85:8000/api/v1/system/export/garmin', '_blank')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Export de données</h1>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Statut du système</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : status ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Base de données</p>
                <p className="font-medium">{status.database}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Garmin</p>
                <p className="font-medium">
                  {status.garmin?.connected ? `Connecté (${status.garmin.last_sync})` : 'Déconnecté'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ChromaDB</p>
                <p className="font-medium">{status.chromadb}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduler</p>
                <p className="font-medium">
                  {status.scheduler?.enabled ? `Actif (prochain: ${status.scheduler.next_run})` : 'Inactif'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Statut non disponible</p>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exporter toutes les données</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Télécharge un fichier ZIP contenant toutes vos données.
            </p>
            <Button onClick={handleExportAll}>Exporter en ZIP</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exporter les données Garmin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Télécharge vos données Garmin au format CSV.
            </p>
            <Button variant="outline" onClick={handleExportGarmin}>
              Exporter CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}