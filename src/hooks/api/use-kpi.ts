import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface KPIValue {
  value: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

export interface CurrentKPIs {
  sleep: KPIValue | null
  recovery: KPIValue | null
  activity: KPIValue | null
  stress: KPIValue | null
  masculinity: KPIValue | null
  beauty: KPIValue | null
}

export interface CheckIn {
  id: number
  date: string
  mood: number
  energy: number
  sleep_quality: number
  stress_level: number
  notes?: string
}

export interface SubmitCheckInPayload {
  mood: number
  energy: number
  sleep_quality: number
  stress_level: number
  notes?: string
}

export interface KPIHistoryItem {
  date: string
  sleep?: number
  recovery?: number
  stress?: number
}

export interface KPIHistoryResponse {
  items: KPIHistoryItem[]
  total: number
}

export interface KPITrendsResponse {
  metric: string
  current: number
  average: number
  min: number
  max: number
  trend: string
  data: Array<{ date: string; value: number }>
}

// Hooks
export function useCurrentKPIs() {
  return useQuery({
    queryKey: ['current-kpis'],
    queryFn: () => apiClient.get<CurrentKPIs>('/kpi'),
  })
}

export function useSubmitCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubmitCheckInPayload) =>
      apiClient.post<CheckIn>('/kpi/check-in', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-kpis'] })
      queryClient.invalidateQueries({ queryKey: ['today-check-in'] })
      queryClient.invalidateQueries({ queryKey: ['kpi-history'] })
    },
  })
}

export function useTodayCheckIn() {
  return useQuery({
    queryKey: ['today-check-in'],
    queryFn: () => apiClient.get<CheckIn | null>('/kpi/check-in/today'),
  })
}

export function useKPIHistory(days?: number) {
  return useQuery({
    queryKey: ['kpi-history', days],
    queryFn: () =>
      apiClient.get<KPIHistoryResponse>('/kpi/history', { params: { days } }),
  })
}

export function useKPITrends(metric: string, days?: number) {
  return useQuery({
    queryKey: ['kpi-trends', metric, days],
    queryFn: () =>
      apiClient.get<KPITrendsResponse>('/kpi/trends', {
        params: { metric, days },
      }),
    enabled: !!metric,
  })
}

// Types for missing endpoints
export interface KPISummary {
  period: string
  avg_sleep_quality: number
  avg_recovery: number
  avg_stress: number
  avg_activity: number
  best_day: string
  worst_day: string
}

export interface Ressenti {
  id: number
  timestamp: string
  mood: string
  energy_level: number
  notes?: string
}

export interface SubmitRessentiPayload {
  mood: string
  energy_level: number
  notes?: string
}

// GET /api/v1/kpi/summary
export function useKPISummary() {
  return useQuery({
    queryKey: ['kpi-summary'],
    queryFn: () => apiClient.get<KPISummary>('/kpi/summary'),
  })
}

// GET /api/v1/kpi/check-in (list all check-ins)
export function useCheckIns(days?: number) {
  return useQuery({
    queryKey: ['check-ins', days],
    queryFn: () =>
      apiClient.get<CheckIn[]>('/kpi/check-in', { params: { days } }),
  })
}

// GET /api/v1/kpi/ressentis
export function useRessentis(days?: number) {
  return useQuery({
    queryKey: ['ressentis', days],
    queryFn: () =>
      apiClient.get<Ressenti[]>('/kpi/ressentis', { params: { days } }),
  })
}

// POST /api/v1/kpi/ressentis
export function useSubmitRessenti() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubmitRessentiPayload) =>
      apiClient.post<Ressenti>('/kpi/ressentis', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ressentis'] })
    },
  })
}