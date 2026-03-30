import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useCurrentKPIs, useTodayCheckIn, useSubmitCheckIn } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/kpi/')({
  component: KpiPage,
})

function KpiPage() {
  const { data: kpis, isLoading: kpisLoading } = useCurrentKPIs()
  const { data: todayCheckIn } = useTodayCheckIn()
  const checkInMutation = useSubmitCheckIn()
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [form, setForm] = useState({ mood: '5', energy: '5', sleep_quality: '5', stress_level: '5', notes: '' })

  const handleSubmit = () => {
    checkInMutation.mutate(
      {
        mood: Number(form.mood),
        energy: Number(form.energy),
        sleep_quality: Number(form.sleep_quality),
        stress_level: Number(form.stress_level),
        notes: form.notes || undefined,
      },
      { onSuccess: () => setIsCheckInOpen(false) }
    )
  }

  const getTrendIcon = (trend: string | undefined) => {
    if (trend === 'up') return '↑'
    if (trend === 'down') return '↓'
    return '→'
  }

  const getTrendColor = (change: number | undefined) => {
    if (!change) return 'text-muted-foreground'
    return change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-muted-foreground'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">KPIs & Check-ins</h1>
        {!todayCheckIn && (
          <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
            <DialogTrigger asChild>
              <Button>Faire un check-in</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Check-in du jour</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Humeur (1-10)</Label>
                  <Select value={form.mood} onValueChange={(v) => setForm({ ...form, mood: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Énergie (1-10)</Label>
                  <Select value={form.energy} onValueChange={(v) => setForm({ ...form, energy: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Qualité du sommeil (1-10)</Label>
                  <Select value={form.sleep_quality} onValueChange={(v) => setForm({ ...form, sleep_quality: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Niveau de stress (1-10)</Label>
                  <Select value={form.stress_level} onValueChange={(v) => setForm({ ...form, stress_level: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes (optionnel)</Label>
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <Button onClick={handleSubmit} disabled={checkInMutation.isPending}>
                  {checkInMutation.isPending ? 'Envoi...' : 'Soumettre'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpisLoading ? (
          [...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            {kpis?.sleep && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Sommeil</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{kpis.sleep.value}</span>
                    <span className={`text-lg ${getTrendColor(kpis.sleep.change)}`}>
                      {getTrendIcon(kpis.sleep.trend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            {kpis?.recovery && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Récupération</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{kpis.recovery.value}</span>
                    <span className={`text-lg ${getTrendColor(kpis.recovery.change)}`}>
                      {getTrendIcon(kpis.recovery.trend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            {kpis?.activity && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Activité</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{kpis.activity.value}</span>
                    <span className={`text-lg ${getTrendColor(kpis.activity.change)}`}>
                      {getTrendIcon(kpis.activity.trend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            {kpis?.stress && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Stress</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{kpis.stress.value}</span>
                    <span className={`text-lg ${getTrendColor(kpis.stress.change)}`}>
                      {getTrendIcon(kpis.stress.trend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {todayCheckIn && (
        <Card>
          <CardHeader>
            <CardTitle>Check-in d'aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{todayCheckIn.mood}</p>
                <p className="text-sm text-muted-foreground">Humeur</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{todayCheckIn.energy}</p>
                <p className="text-sm text-muted-foreground">Énergie</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{todayCheckIn.sleep_quality}</p>
                <p className="text-sm text-muted-foreground">Sommeil</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{todayCheckIn.stress_level}</p>
                <p className="text-sm text-muted-foreground">Stress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}