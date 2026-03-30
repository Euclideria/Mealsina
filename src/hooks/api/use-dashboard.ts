import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types - matching MEALSINA_API.md response format
export interface DashboardKPIs {
  sleep: number
  recovery: number
  activity: number
  stress: number
  masculinity: number
  beauty: number
  overall: number
}

export interface DashboardTrends {
  sleep?: number[]
  recovery?: number[]
  activity?: number[]
  stress?: number[]
  masculinity?: number[]
  beauty?: number[]
  overall?: number[]
}

export interface DashboardMeals {
  count: number
  total_calories: number
}

export interface DashboardTreatments {
  taken: number
  pending: number
  compliance: string
}

export interface DashboardAlert {
  type: string
  message: string
}

export interface Dashboard {
  date: string
  kpis: DashboardKPIs
  trends_7d: DashboardTrends
  ai_summary?: string
  meals_today: DashboardMeals
  treatments_today: DashboardTreatments
  active_alerts: DashboardAlert[]
  streak: number
}

export interface SystemStatus {
  status: string
  version: string
  database: string
  chromadb: string
  garmin: {
    connected: boolean
    last_sync: string
  }
  scheduler: {
    enabled: boolean
    next_run: string
  }
}

// Hooks
export function useDashboard(date?: string) {
  return useQuery({
    queryKey: ['dashboard', date],
    queryFn: () =>
      apiClient.get<Dashboard>('/dashboard', {
        params: date ? { date } : undefined,
      }),
  })
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: () => apiClient.get<SystemStatus>('/system/status'),
  })
}

export function useExportAllData(format?: 'json' | 'zip') {
  return useQuery({
    queryKey: ['export-all', format],
    queryFn: () =>
      apiClient.get('/system/export/all', { params: { format } }),
    enabled: false, // Manual trigger only
  })
}

export function useExportGarminData(params?: {
  start_date?: string
  end_date?: string
  format?: 'json' | 'csv'
}) {
  return useQuery({
    queryKey: ['export-garmin', params],
    queryFn: () =>
      apiClient.get('/system/export/garmin', { params }),
    enabled: false, // Manual trigger only
  })
}