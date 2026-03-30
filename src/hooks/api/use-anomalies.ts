import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface Anomaly {
  id: number
  type: string
  severity: 'low' | 'medium' | 'high'
  message: string
  status: 'active' | 'acknowledged' | 'resolved'
  detected_at: string
  acknowledged_at?: string
  resolved_at?: string
  resolution?: string
}

export interface AnomaliesResponse {
  items: Anomaly[]
  total: number
}

export interface ResolveAnomalyPayload {
  resolution: string
}

// Hooks
export function useAnomalies(params?: {
  status?: 'all' | 'active' | 'acknowledged' | 'resolved'
  days?: number
}) {
  return useQuery({
    queryKey: ['anomalies', params],
    queryFn: () =>
      apiClient.get<AnomaliesResponse>('/anomalies', { params }),
  })
}

export function useAcknowledgeAnomaly() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.post(`/anomalies/${id}/acknowledge`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies'] })
    },
  })
}

export function useResolveAnomaly() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: number; resolution: string }) =>
      apiClient.put(`/anomalies/${data.id}/resolve`, { resolution: data.resolution }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies'] })
    },
  })
}

// GET /api/v1/anomalies/latest
export function useLatestAnomalies(limit?: number) {
  return useQuery({
    queryKey: ['latest-anomalies', limit],
    queryFn: () =>
      apiClient.get<Anomaly[]>('/anomalies/latest', { params: { limit } }),
  })
}