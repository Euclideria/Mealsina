import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface Notification {
  id: number
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface NotificationsResponse {
  items: Notification[]
  total: number
  unread_count: number
}

// Hooks
export function useNotifications(unread_only?: boolean) {
  return useQuery({
    queryKey: ['notifications', unread_only],
    queryFn: () =>
      apiClient.get<NotificationsResponse>('/notifications', {
        params: { unread_only },
      }),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.put('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] })
    },
  })
}

// GET /api/v1/notifications/count
export function useNotificationsCount() {
  return useQuery({
    queryKey: ['notifications-count'],
    queryFn: () =>
      apiClient.get<{ total: number; unread: number }>('/notifications/count'),
  })
}