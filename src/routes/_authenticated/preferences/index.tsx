import { createFileRoute } from '@tanstack/react-router'
import { usePreferences, useUpdatePreferences } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_authenticated/preferences/')({
  component: PreferencesPage,
})

function PreferencesPage() {
  const { data: preferences, isLoading } = usePreferences()
  const updateMutation = useUpdatePreferences()

  const handleToggle = (key: string, value: boolean) => {
    updateMutation.mutate({ [key]: value })
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Préférences</h1>
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Préférences</h1>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Activer les notifications</Label>
            <Switch
              id="notifications"
              checked={preferences?.notifications_enabled ?? false}
              onCheckedChange={(checked) => handleToggle('notifications_enabled', checked)}
              disabled={updateMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IA & Automation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto_approve">Auto-approuver les actions de l'IA</Label>
            <Switch
              id="auto_approve"
              checked={preferences?.auto_approve_actions ?? false}
              onCheckedChange={(checked) => handleToggle('auto_approve_actions', checked)}
              disabled={updateMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Affichage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Thème</Label>
            <span className="text-muted-foreground capitalize">{preferences?.theme ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Langue</Label>
            <span className="text-muted-foreground">{preferences?.language ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Unités</Label>
            <span className="text-muted-foreground">{preferences?.units ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Plage de jours par défaut</Label>
            <span className="text-muted-foreground">{preferences?.default_days_range ?? '-'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}