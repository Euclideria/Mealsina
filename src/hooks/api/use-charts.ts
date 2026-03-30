import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface SleepTrendChartResponse {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
  }>
}

export interface NutritionWeekResponse {
  days: Array<{
    day: string
    calories: number
    protein: number
    carbs: number
  }>
  averages: {
    calories: number
    protein: number
    carbs: number
  }
}

export interface BloodTestEvolutionResponse {
  parameter: string
  unit: string
  data: Array<{
    date: string
    value: number
    reference_min: number
    reference_max: number
  }>
}

export interface HeartRateTrendResponse {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
  }>
}

// Hooks
export function useSleepTrendChart(days?: number) {
  return useQuery({
    queryKey: ['sleep-trend-chart', days],
    queryFn: () =>
      apiClient.get<SleepTrendChartResponse>('/charts/sleep-trend', {
        params: { days },
      }),
  })
}

export function useNutritionWeekChart() {
  return useQuery({
    queryKey: ['nutrition-week-chart'],
    queryFn: () => apiClient.get<NutritionWeekResponse>('/charts/nutrition-week'),
  })
}

export function useBloodTestEvolution(parameter: string) {
  return useQuery({
    queryKey: ['blood-test-evolution', parameter],
    queryFn: () =>
      apiClient.get<BloodTestEvolutionResponse>('/charts/blood-test-evolution', {
        params: { parameter },
      }),
    enabled: !!parameter,
  })
}

export function useHeartRateTrend(days?: number) {
  return useQuery({
    queryKey: ['heart-rate-trend', days],
    queryFn: () =>
      apiClient.get<HeartRateTrendResponse>('/charts/heart-rate-trend', {
        params: { days },
      }),
  })
}

// Types for missing charts endpoints
export interface TreatmentComplianceChartResponse {
  period: string
  treatments: Array<{
    name: string
    compliance_rate: number
    taken: number
    missed: number
    skipped: number
  }>
  overall_compliance: number
}

export interface ActivityLevelsResponse {
  period: string
  data: Array<{
    date: string
    steps: number
    calories_burned: number
    intensity_minutes: number
    floors_climbed: number
  }>
  avg_steps: number
  avg_intensity_minutes: number
}

// GET /api/v1/charts/treatment-compliance
export function useTreatmentComplianceChart(days?: number) {
  return useQuery({
    queryKey: ['treatment-compliance-chart', days],
    queryFn: () =>
      apiClient.get<TreatmentComplianceChartResponse>(
        '/charts/treatment-compliance',
        { params: { days } }
      ),
  })
}

// GET /api/v1/charts/activity-levels
export function useActivityLevels(days?: number) {
  return useQuery({
    queryKey: ['activity-levels', days],
    queryFn: () =>
      apiClient.get<ActivityLevelsResponse>('/charts/activity-levels', {
        params: { days },
      }),
  })
}