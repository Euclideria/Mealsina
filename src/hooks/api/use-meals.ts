import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface Meal {
  id: number
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date: string
  time: string
  description?: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface CreateMealPayload {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date: string
  time: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export interface MealAnalysisResponse {
  calories: number
  protein: number
  carbs: number
  fat: number
  analysis: string
  confidence: number
}

export interface DailyMealSummary {
  date: string
  total_meals: number
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  breakfast?: { calories: number }
  lunch?: { calories: number }
  dinner?: { calories: number }
  snacks?: { calories: number }
}

// Hooks
export function useMeals(params?: {
  start_date?: string
  end_date?: string
}) {
  return useQuery({
    queryKey: ['meals', params],
    queryFn: () => apiClient.get<Meal[]>('/meals', { params }),
  })
}

export function useCreateMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMealPayload) =>
      apiClient.post<Meal>('/meals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-meal-summary'] })
    },
  })
}

export function useAnalyzeMealPhoto() {
  return useMutation({
    mutationFn: (data: { file: File; meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('meal_type', data.meal_type)
      return apiClient.uploadFileWithFormData<MealAnalysisResponse>(
        '/meals/analyze',
        formData
      )
    },
  })
}

export function useDailyMealSummary(date: string) {
  return useQuery({
    queryKey: ['daily-meal-summary', date],
    queryFn: () => apiClient.get<DailyMealSummary>(`/meals/daily/${date}`),
    enabled: !!date,
  })
}

// Types for missing endpoints
export interface MealKPIs {
  avg_calories: number
  avg_protein: number
  avg_carbs: number
  avg_fat: number
  calories_trend: 'stable' | 'increasing' | 'decreasing'
  protein_trend: 'stable' | 'increasing' | 'decreasing'
  meals_logged: number
  meals_skipped: number
}

// GET /api/v1/meals/kpis
export function useMealKPIs(days?: number) {
  return useQuery({
    queryKey: ['meal-kpis', days],
    queryFn: () =>
      apiClient.get<MealKPIs>('/meals/kpis', { params: { days } }),
  })
}

// GET /api/v1/meals/daily (today's summary)
export function useTodayMeals() {
  const today = new Date().toISOString().split('T')[0]
  return useQuery({
    queryKey: ['today-meals', today],
    queryFn: () => apiClient.get<DailyMealSummary>(`/meals/daily/${today}`),
  })
}

// DELETE /api/v1/meals/{meal_id}
export function useDeleteMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mealId: number) =>
      apiClient.delete<void>(`/meals/${mealId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-meal-summary'] })
    },
  })
}