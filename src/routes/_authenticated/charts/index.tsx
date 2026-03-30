import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useSleepTrendChart, useNutritionWeekChart, useHeartRateTrend, useBloodTestEvolution } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/charts/')({
  component: ChartsPage,
})

function ChartsPage() {
  const [selectedParam, setSelectedParam] = useState('ferritine')
  const { data: sleepData, isLoading: sleepLoading } = useSleepTrendChart(30)
  const { data: nutritionData, isLoading: nutritionLoading } = useNutritionWeekChart()
  const { data: hrData, isLoading: hrLoading } = useHeartRateTrend(30)
  const { data: bloodEvolution, isLoading: bloodLoading } = useBloodTestEvolution(selectedParam)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Graphiques & Visualisations</h1>

      {/* Sleep Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendance du sommeil</CardTitle>
        </CardHeader>
        <CardContent>
          {sleepLoading ? (
            <Skeleton className="h-64" />
          ) : sleepData?.labels?.length ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Données sur {sleepData.labels.length} jours
              </p>
              <div className="grid grid-cols-7 gap-2">
                {sleepData.labels.slice(-7).map((label, i) => {
                  const score = sleepData.datasets[0]?.data?.[sleepData.labels.length - 7 + i]
                  return (
                    <div key={label} className="text-center">
                      <div
                        className="w-full rounded-t-md bg-primary"
                        style={{ height: `${score || 0}px`, maxHeight: '100px' }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{label.slice(5)}</p>
                      <p className="text-xs font-medium">{score || '-'}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>

      {/* Nutrition Week */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition de la semaine</CardTitle>
        </CardHeader>
        <CardContent>
          {nutritionLoading ? (
            <Skeleton className="h-64" />
          ) : nutritionData?.days?.length ? (
            <div className="grid grid-cols-7 gap-2">
              {nutritionData.days.map((day) => (
                <div key={day.day} className="text-center p-2">
                  <p className="text-sm font-medium">{day.day}</p>
                  <p className="text-lg font-bold">{day.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>

      {/* Heart Rate Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Fréquence cardiaque</CardTitle>
        </CardHeader>
        <CardContent>
          {hrLoading ? (
            <Skeleton className="h-64" />
          ) : hrData?.labels?.length ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Données sur {hrData.labels.length} jours
              </p>
              <div className="grid grid-cols-7 gap-2">
                {hrData.labels.slice(-7).map((label, i) => {
                  const resting = hrData.datasets[0]?.data?.[hrData.labels.length - 7 + i]
                  return (
                    <div key={label} className="text-center p-2 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">{label.slice(5)}</p>
                      <p className="text-lg font-bold">{resting || '-'}</p>
                      <p className="text-xs text-muted-foreground">bpm</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>

      {/* Blood Test Evolution */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des paramètres sanguins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedParam} onValueChange={setSelectedParam}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Paramètre" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ferritine">Ferritine</SelectItem>
                <SelectItem value="vitamin_d">Vitamine D</SelectItem>
                <SelectItem value="hemoglobin">Hémoglobine</SelectItem>
                <SelectItem value="tsh">TSH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {bloodLoading ? (
            <Skeleton className="h-64" />
          ) : bloodEvolution?.data?.length ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Unité: {bloodEvolution.unit}
              </p>
              <div className="space-y-2">
                {bloodEvolution.data.map((item) => (
                  <div key={item.date} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                    <span className="text-sm">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                    <div className="text-right">
                      <span className="font-bold">{item.value}</span>
                      <span className="text-xs text-muted-foreground ml-1">{bloodEvolution.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}