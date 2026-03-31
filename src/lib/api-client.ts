import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_VERSION = '/api/v1'

// Token refresh state
let _isRefreshing = false
let _refreshPromise: Promise<string> | null = null

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
  const response = await fetch(buildUrl('/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // httpOnly cookie automatically sent by browser
  })

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

    // Handle 401: try to refresh token and retry
    if (response.status === 401 && !options?.headers?.['x-refreshing']) {
      if (!_isRefreshing) {
        _isRefreshing = true
        _refreshPromise = _refreshAccessToken().finally(() => {
          _isRefreshing = false
          _refreshPromise = null
        })
      }
      await _refreshPromise
      return this.get<T>(endpoint, { ...options, headers: { ...options?.headers, 'x-refreshing': 'true' } })
    }

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

    // Handle 401: try to refresh token and retry
    if (response.status === 401 && !options?.headers?.['x-refreshing']) {
      if (!_isRefreshing) {
        _isRefreshing = true
        _refreshPromise = _refreshAccessToken().finally(() => {
          _isRefreshing = false
          _refreshPromise = null
        })
      }
      await _refreshPromise
      return this.post<T>(endpoint, body, { ...options, headers: { ...options?.headers, 'x-refreshing': 'true' } })
    }

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

    // Handle 401: try to refresh token and retry
    if (response.status === 401 && !options?.headers?.['x-refreshing']) {
      if (!_isRefreshing) {
        _isRefreshing = true
        _refreshPromise = _refreshAccessToken().finally(() => {
          _isRefreshing = false
          _refreshPromise = null
        })
      }
      await _refreshPromise
      return this.put<T>(endpoint, body, { ...options, headers: { ...options?.headers, 'x-refreshing': 'true' } })
    }

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

    // Handle 401: try to refresh token and retry
    if (response.status === 401 && !options?.headers?.['x-refreshing']) {
      if (!_isRefreshing) {
        _isRefreshing = true
        _refreshPromise = _refreshAccessToken().finally(() => {
          _isRefreshing = false
          _refreshPromise = null
        })
      }
      await _refreshPromise
      return this.delete<T>(endpoint, { ...options, headers: { ...options?.headers, 'x-refreshing': 'true' } })
    }

    return handleResponse<T>(response)
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

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
      body: formData,
    })

    // Handle 401: try to refresh token and retry
    if (response.status === 401 && !options?.headers?.['x-refreshing']) {
      if (!_isRefreshing) {
        _isRefreshing = true
        _refreshPromise = _refreshAccessToken().finally(() => {
          _isRefreshing = false
          _refreshPromise = null
        })
      }
      await _refreshPromise
      return this.uploadFile<T>(endpoint, file, additionalData, { ...options, headers: { ...options?.headers, 'x-refreshing': 'true' } })
    }

    return handleResponse<T>(response)
  },

  async uploadFileWithFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> {
    const token = getAuthToken()
    const url = buildUrl(endpoint)

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
      body: formData,
    })

    // Handle 401: try to refresh token and retry
    if (response.status === 401 && !options?.headers?.['x-refreshing']) {
      if (!_isRefreshing) {
        _isRefreshing = true
        _refreshPromise = _refreshAccessToken().finally(() => {
          _isRefreshing = false
          _refreshPromise = null
        })
      }
      await _refreshPromise
      return this.uploadFileWithFormData<T>(endpoint, formData, { ...options, headers: { ...options?.headers, 'x-refreshing': 'true' } })
    }

    return handleResponse<T>(response)
  },
}

export { ApiError }