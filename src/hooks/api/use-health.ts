import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface HealthMetric {
  date: string
  steps: number
  resting_heart_rate: number
  sleep_score: number
  stress_level: number
  recovery: number
  total_sleep_minutes?: number
  deep_sleep_minutes?: number
  hrv?: number
}

export interface HealthMetricsResponse {
  items: HealthMetric[]
  total: number
}

export interface GarminStatus {
  last_sync: string
  status: 'connected' | 'disconnected'
  days_available: number
}

export interface GarminLatest {
  date: string
  steps: number
  sleep_score: number
  resting_heart_rate: number
  stress_level: number
  recovery: number
}

export interface SchedulerStatus {
  enabled: boolean
  schedule: string
}

// Hooks
export function useHealthMetrics(params?: {
  days?: number
  start_date?: string
  end_date?: string
}) {
  return useQuery({
    queryKey: ['health-metrics', params],
    queryFn: () =>
      apiClient.get<HealthMetricsResponse>('/health', { params }),
  })
}

export function useGarminLatest() {
  return useQuery({
    queryKey: ['garmin-latest'],
    queryFn: () => apiClient.get<GarminLatest>('/health/garmin/latest'),
  })
}

export function useGarminStatus() {
  return useQuery({
    queryKey: ['garmin-status'],
    queryFn: () => apiClient.get<GarminStatus>('/health/garmin/status'),
  })
}

export function useSyncGarmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiClient.post<{ status: string; days_synced: number }>(
        '/health/garmin/sync'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garmin-status'] })
      queryClient.invalidateQueries({ queryKey: ['garmin-latest'] })
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] })
    },
  })
}

export function useSchedulerStatus() {
  return useQuery({
    queryKey: ['scheduler-status'],
    queryFn: () =>
      apiClient.get<SchedulerStatus>('/health/scheduler/status'),
  })
}

export function useEnableScheduler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiClient.post<{ enabled: boolean }>('/health/scheduler/enable'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduler-status'] })
    },
  })
}

export function useDisableScheduler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiClient.post<{ enabled: boolean }>('/health/scheduler/disable'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduler-status'] })
    },
  })
}

// Types for missing endpoints
export interface GarminSyncLog {
  id: number
  sync_date: string
  status: 'success' | 'failed'
  metrics_count: number
  error_message: string | null
  created_at: string
}

export interface GarminDataStats {
  total_days: number
  first_sync: string
  last_sync: string
  avg_steps: number
  avg_sleep_score: number
  avg_stress_level: number
  total_workouts: number
}

// GET /api/v1/health/garmin/sync-logs
export function useGarminSyncLogs(limit?: number) {
  return useQuery({
    queryKey: ['garmin-sync-logs', limit],
    queryFn: () =>
      apiClient.get<GarminSyncLog[]>('/health/garmin/sync-logs', {
        params: { limit },
      }),
  })
}

// GET /api/v1/health/garmin/data/stats
export function useGarminDataStats() {
  return useQuery({
    queryKey: ['garmin-data-stats'],
    queryFn: () => apiClient.get<GarminDataStats>('/health/garmin/data/stats'),
  })
}

// POST /api/v1/health/scheduler/trigger-morning-ai
export function useTriggerMorningAI() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiClient.post<{ status: string; message: string }>(
        '/health/scheduler/trigger-morning-ai'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}