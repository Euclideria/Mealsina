import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface Preferences {
  theme: string
  language: string
  units: string
  notifications_enabled: boolean
  auto_approve_actions: boolean
  default_days_range: number
}

export type UpdatePreferencesPayload = Partial<Preferences>

// Hooks
export function usePreferences() {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: () => apiClient.get<Preferences>('/preferences'),
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePreferencesPayload) =>
      apiClient.put<Preferences>('/preferences', data),
    onSuccess: (data) => {
      queryClient.setQueryData(['preferences'], data)
    },
  })
}

// Types for auto-approve
export interface AutoApproveStatus {
  auto_approve_meals: boolean
  auto_approve_treatments: boolean
  auto_approve_goals: boolean
}

// GET /api/v1/preferences/auto-approve
export function useAutoApproveStatus() {
  return useQuery({
    queryKey: ['auto-approve'],
    queryFn: () => apiClient.get<AutoApproveStatus>('/preferences/auto-approve'),
  })
}

// POST /api/v1/preferences/auto-approve/{action_type}
export function useToggleAutoApprove() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { action_type: string; enabled: boolean }) =>
      apiClient.post<AutoApproveStatus>(
        `/preferences/auto-approve/${data.action_type}`,
        { enabled: data.enabled }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-approve'] })
    },
  })
}