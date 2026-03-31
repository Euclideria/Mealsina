import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_VERSION = '/api/v1'

// Token refresh state
let _isRefreshing = false
let _refreshPromise: Promise<string> | null = null
let _refreshAttemptCount = 0

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
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

async function _refreshAccessToken(): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      // httpOnly cookie automatically sent by browser
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      // Refresh token expired or invalid - force logout
      useAuthStore.getState().auth.reset()
      window.location.href = '/sign-in'
      throw new Error('Session expired')
    }

    const result = await response.json()
    const newToken = result.access_token

    // Store new access token
    useAuthStore.getState().auth.setAccessToken(newToken)

    return newToken
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      useAuthStore.getState().auth.reset()
      window.location.href = '/sign-in'
      throw new Error('Session refresh timed out')
    }
    throw error
  }
}

async function _fetchWithRefresh<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const response = await fetch(url, options)

  if (response.status === 401 && !(options.headers as Record<string, string> | undefined)?.['x-refreshing']) {
    if (!_isRefreshing) {
      _isRefreshing = true
      _refreshAttemptCount = 0
      _refreshPromise = _refreshAccessToken().finally(() => {
        _isRefreshing = false
        _refreshPromise = null
      })
    }

    try {
      await _refreshPromise
      _refreshAttemptCount++

      // If refresh has failed 2+ times, don't retry - force logout
      if (_refreshAttemptCount >= 2) {
        useAuthStore.getState().auth.reset()
        window.location.href = '/sign-in'
        throw new ApiError(401, 'Session expired after multiple refresh attempts')
      }

      // Retry original request with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${useAuthStore.getState().auth.accessToken}`,
          'x-refreshing': 'true',
        },
      }).then(handleResponse<T>)
    } finally {
      _isRefreshing = false
      _refreshPromise = null
    }
  }

  return handleResponse<T>(response)
}

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    return _fetchWithRefresh<T>(url, {
      ...options,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    return _fetchWithRefresh<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    return _fetchWithRefresh<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint, options?.params)

    return _fetchWithRefresh<T>(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  },

  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>,
    options?: RequestOptions
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

    return _fetchWithRefresh<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
      body: formData,
    })
  },

  async uploadFileWithFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint)

    return _fetchWithRefresh<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
      body: formData,
    })
  },

  async logout(): Promise<void> {
    try {
      await fetch(buildUrl('/auth/logout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {
      // Ensure logout completes even if server unreachable
    } finally {
      useAuthStore.getState().auth.reset()
      window.location.href = '/sign-in'
    }
  },
}

export { ApiError }
