import { createFileRoute } from '@tanstack/react-router'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/notifications/')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications(false)
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()

  const handleMarkRead = (id: number) => {
    markReadMutation.mutate(id)
  }

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {(notifications?.unread_count ?? 0) > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {notifications?.unread_count !== undefined && (
        <p className="text-sm text-muted-foreground">
          {notifications.unread_count} notification(s) non lue(s)
        </p>
      )}

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : notifications?.items?.length ? (
            <div className="space-y-4">
              {notifications.items.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.read ? 'opacity-60' : 'bg-muted'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={markReadMutation.isPending}
                      >
                        Marquer lu
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune notification</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}