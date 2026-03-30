import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface Treatment {
  id: number
  name: string
  dose: string
  frequency: 'daily' | 'weekly' | 'as_needed'
  timing?: 'morning' | 'afternoon' | 'evening' | 'bedtime'
  status: 'active' | 'inactive'
  start_date?: string
  end_date?: string
  notes?: string
}

export interface CreateTreatmentPayload {
  name: string
  dose: string
  frequency: 'daily' | 'weekly' | 'as_needed'
  timing?: 'morning' | 'afternoon' | 'evening' | 'bedtime'
  start_date?: string
  notes?: string
}

export interface LogDosePayload {
  taken: boolean
  notes?: string
  time?: string
}

export interface TreatmentLog {
  treatment_id: number
  logs: Array<{
    date: string
    taken: boolean
    notes?: string
  }>
}

export interface TreatmentCompliance {
  treatment_id: number
  treatment_name: string
  total_doses: number
  taken_doses: number
  compliance_rate: number
}

export interface AITreatmentSuggestion {
  name: string
  dose: string
  frequency: string
  timing: string
  duration: string
  reasoning: string
  side_effects: string[]
  interactions: string[]
}

// Hooks
export function useTreatments(active_only?: boolean) {
  return useQuery({
    queryKey: ['treatments', active_only],
    queryFn: () =>
      apiClient.get<Treatment[]>('/treatments', {
        params: { active_only },
      }),
  })
}

export function useCreateTreatment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTreatmentPayload) =>
      apiClient.post<Treatment>('/treatments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
    },
  })
}

export function useLogDose(treatmentId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LogDosePayload) =>
      apiClient.post(`/treatments/${treatmentId}/log`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-compliance'] })
    },
  })
}

export function useBulkLogDoses() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TreatmentLog) =>
      apiClient.post('/treatments/log', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-compliance'] })
    },
  })
}

export function useTreatmentCompliance(days?: number) {
  return useQuery({
    queryKey: ['treatment-compliance', days],
    queryFn: () =>
      apiClient.get<TreatmentCompliance[]>('/treatments/compliance', {
        params: { days },
      }),
  })
}

export function useAITreatmentSuggestion() {
  return useMutation({
    mutationFn: (data: { context: string; goal: string }) =>
      apiClient.post<AITreatmentSuggestion>('/treatments/ai-generate', data),
  })
}

// Types for missing endpoints
export interface TreatmentDetail {
  id: string
  name: string
  dosage_amount: number
  dosage_unit: string
  frequency: string
  scheduled_times: string[]
  is_active: boolean
  logs: Array<{
    id: number
    taken_at: string
    status: 'taken' | 'missed' | 'skipped'
  }>
}

export interface TreatmentLogEntry {
  id: number
  treatment_id: string
  treatment_name: string
  taken_at: string
  status: 'taken' | 'missed' | 'skipped'
}

// GET /api/v1/treatments/{treatment_id}
export function useTreatmentDetail(treatmentId: number) {
  return useQuery({
    queryKey: ['treatment-detail', treatmentId],
    queryFn: () =>
      apiClient.get<TreatmentDetail>(`/treatments/${treatmentId}`),
    enabled: !!treatmentId,
  })
}

// GET /api/v1/treatments/logs
export function useTreatmentLogs(days?: number) {
  return useQuery({
    queryKey: ['treatment-logs', days],
    queryFn: () =>
      apiClient.get<TreatmentLogEntry[]>('/treatments/logs', {
        params: { days },
      }),
  })
}

// DELETE /api/v1/treatments/{treatment_id}
export function useDeleteTreatment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (treatmentId: number) =>
      apiClient.delete<void>(`/treatments/${treatmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
    },
  })
}