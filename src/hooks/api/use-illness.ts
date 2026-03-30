import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface Illness {
  id: number
  name: string
  status: 'active' | 'resolved'
  start_date: string
  end_date?: string
  symptoms: string[]
  notes?: string
}

export interface CreateIllnessPayload {
  name: string
  start_date: string
  symptoms: string[]
  notes?: string
}

export interface QuickSickPayload {
  feeling: 'sick' | 'healthy'
  symptoms?: string[]
  notes?: string
}

// Hooks
export function useIllnesses(status?: 'all' | 'active' | 'resolved') {
  return useQuery({
    queryKey: ['illnesses', status],
    queryFn: () =>
      apiClient.get<Illness[]>('/illness', { params: { status } }),
  })
}

export function useCreateIllness() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateIllnessPayload) =>
      apiClient.post<Illness>('/illness', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] })
    },
  })
}

export function useQuickSickLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: QuickSickPayload) =>
      apiClient.post('/illness/quick-sick', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] })
    },
  })
}

// Types for missing endpoints
export interface Symptom {
  id: number
  name: string
  severity: number
  location?: string
  status: 'active' | 'resolved'
  created_at: string
}

export interface ResolveIllnessPayload {
  notes?: string
}

// GET /api/v1/illness/active
export function useActiveIllnesses() {
  return useQuery({
    queryKey: ['active-illnesses'],
    queryFn: () => apiClient.get<Illness[]>('/illness/active'),
  })
}

// PUT /api/v1/illness/{illness_id}/resolve
export function useResolveIllness() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: number; notes?: string }) =>
      apiClient.put(`/illness/${data.id}/resolve`, { notes: data.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] })
    },
  })
}

// POST /api/v1/illness/symptom
export function useCreateSymptom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; severity: number; location?: string; notes?: string }) =>
      apiClient.post<Symptom>('/illness/symptom', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] })
    },
  })
}