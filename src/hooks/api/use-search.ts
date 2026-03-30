import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Types
export interface SearchResult {
  id: number
  date?: string
  content?: string
  title?: string
  type?: string
}

export interface SearchResponse {
  query: string
  results: {
    blood_tests: SearchResult[]
    meals: SearchResult[]
    treatments: SearchResult[]
    anomalies: SearchResult[]
    health: SearchResult[]
  }
  total: number
}

// Hooks
export function useGlobalSearch(params: {
  q: string
  types?: string
  limit?: number
}) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => apiClient.get<SearchResponse>('/search', { params }),
    enabled: !!params.q && params.q.length >= 2,
  })
}

// Types for RAG search
export interface RAGSearchResult {
  id: string
  content: string
  score: number
  metadata: {
    type: string
    date: string
  }
}

export interface RAGSearchResponse {
  query: string
  results: RAGSearchResult[]
}

// GET /api/v1/search/rag
export function useRAGSearch(q: string, limit?: number) {
  return useQuery({
    queryKey: ['rag-search', q, limit],
    queryFn: () =>
      apiClient.get<RAGSearchResponse>('/search/rag', {
        params: { q, limit },
      }),
    enabled: !!q && q.length >= 2,
  })
}