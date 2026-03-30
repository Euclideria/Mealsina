import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://89.167.112.85:8000'
const API_VERSION = '/api/v1'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

class ApiError extends Error {
  public status: number
  public data?: unknown
  public response?: { status: number }

  constructor(
    status: number,
    message: string,
    data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.response = { status }
  }
}

function getAuthToken(): string {
  const token = useAuthStore.getState().auth.accessToken
  return token
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_BASE_URL}${API_VERSION}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return url.toString()
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      errorData?.detail || `HTTP error ${response.status}`,
      errorData
    )
  }
  return response.json()
}

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    return handleResponse<T>(response)
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    return handleResponse<T>(response)
  },

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    return handleResponse<T>(response)
  },

  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint)

    const formData = new FormData()
    formData.append('file', file)
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    return handleResponse<T>(response)
  },

  async uploadFileWithFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    return handleResponse<T>(response)
  },
}

export { ApiError }