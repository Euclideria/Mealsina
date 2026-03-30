import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface BloodTestParameter {
  id: number
  blood_test_id: number
  name: string
  value: number
  unit: string
  reference_min: number
  reference_max: number
  status: 'normal' | 'low' | 'high'
}

export interface BloodTest {
  id: number
  test_date: string
  lab_name: string
  notes: string
  created_at: string
  parameters?: BloodTestParameter[]
}

export interface BloodTestsResponse {
  items: BloodTest[]
  total: number
  page: number
  limit: number
}

export interface UploadBloodTestResponse {
  id: number
  status: string
  parameters_extracted: number
}

// Hooks
export function useBloodTests(params?: {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['blood-tests', params],
    queryFn: () =>
      apiClient.get<BloodTestsResponse>('/blood-tests', { params }),
  })
}

export function useBloodTestDetail(id: number) {
  return useQuery({
    queryKey: ['blood-test', id],
    queryFn: () => apiClient.get<BloodTest>(`/blood-tests/${id}`),
    enabled: !!id,
  })
}

export function useUploadBloodTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { file: File; test_date: string; lab_name: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('test_date', data.test_date)
      formData.append('lab_name', data.lab_name)
      return apiClient.uploadFileWithFormData<UploadBloodTestResponse>(
        '/blood-tests/upload',
        formData
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-tests'] })
    },
  })
}