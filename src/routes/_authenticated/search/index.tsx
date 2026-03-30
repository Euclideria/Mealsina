import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useGlobalSearch } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_authenticated/search/')({
  component: SearchPage,
})

function SearchPage() {
  const [query, setQuery] = useState('')
  const { data: results, isLoading } = useGlobalSearch({ q: query, limit: 10 })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Recherche globale</h1>

      <Input
        placeholder="Rechercher dans toutes les données..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : results && query.length >= 2 ? (
        <div className="space-y-6">
          {/* Blood Tests */}
          {results.results.blood_tests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bilans sanguins ({results.results.blood_tests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.results.blood_tests.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-muted">
                      <p className="font-medium">{item.content}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meals */}
          {results.results.meals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Repas ({results.results.meals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.results.meals.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-muted">
                      <p className="font-medium">{item.content}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Treatments */}
          {results.results.treatments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Traitements ({results.results.treatments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.results.treatments.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-muted">
                      <p className="font-medium">{item.content || item.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Anomalies */}
          {results.results.anomalies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anomalies ({results.results.anomalies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.results.anomalies.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-muted">
                      <p className="font-medium">{item.content}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {results.total === 0 && (
            <p className="text-muted-foreground">Aucun résultat trouvé</p>
          )}
        </div>
      ) : query.length > 0 && query.length < 2 ? (
        <p className="text-muted-foreground">Tapez au moins 2 caractères pour rechercher</p>
      ) : null}
    </div>
  )
}