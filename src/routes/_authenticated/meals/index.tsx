import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMeals, useCreateMeal, useDailyMealSummary, useAnalyzeMealPhoto } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/meals/')({
  component: MealsPage,
})

function MealsPage() {
  const today = new Date().toISOString().split('T')[0]
  const { data: meals, isLoading } = useMeals({ start_date: today })
  const { data: dailySummary, isLoading: summaryLoading } = useDailyMealSummary(today)
  const createMealMutation = useCreateMeal()
  const analyzePhotoMutation = useAnalyzeMealPhoto()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false)
  const [analyzeMealType, setAnalyzeMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')
  const [analyzedData, setAnalyzedData] = useState<{ calories: number; protein: number; carbs: number; fat: number; analysis: string } | null>(null)
  const [form, setForm] = useState({
    meal_type: 'lunch' as const,
    date: today,
    time: '12:00',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  })

  const handleSubmit = () => {
    createMealMutation.mutate(
      {
        meal_type: form.meal_type,
        date: form.date,
        time: form.time,
        description: form.description,
        calories: form.calories ? Number(form.calories) : undefined,
        protein: form.protein ? Number(form.protein) : undefined,
        carbs: form.carbs ? Number(form.carbs) : undefined,
        fat: form.fat ? Number(form.fat) : undefined,
      },
      { onSuccess: () => setIsAddOpen(false) }
    )
  }

  const handleAnalyzePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const result = await analyzePhotoMutation.mutateAsync({ file, meal_type: analyzeMealType })
      setAnalyzedData(result)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Repas & Nutrition</h1>
        <div className="flex gap-2">
          <Dialog open={isAnalyzeOpen} onOpenChange={setIsAnalyzeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Analyser une photo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Analyser un repas par photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type de repas</Label>
                  <Select value={analyzeMealType} onValueChange={(v) => setAnalyzeMealType(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
                      <SelectItem value="lunch">Déjeuner</SelectItem>
                      <SelectItem value="dinner">Dîner</SelectItem>
                      <SelectItem value="snack">Collation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Photo du repas</Label>
                  <Input type="file" accept="image/*" onChange={handleAnalyzePhoto} />
                </div>
                {analyzedData && (
                  <div className="p-4 rounded-lg bg-muted space-y-2">
                    <p className="font-bold">Résultats de l'analyse:</p>
                    <p className="text-sm">{analyzedData.analysis}</p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div><p className="font-bold">{analyzedData.calories}</p><p className="text-xs">kcal</p></div>
                      <div><p className="font-bold">{analyzedData.protein}g</p><p className="text-xs">P</p></div>
                      <div><p className="font-bold">{analyzedData.carbs}g</p><p className="text-xs">C</p></div>
                      <div><p className="font-bold">{analyzedData.fat}g</p><p className="text-xs">L</p></div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter un repas</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un repas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type de repas</Label>
                <Select value={form.meal_type} onValueChange={(v) => setForm({ ...form, meal_type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
                    <SelectItem value="lunch">Déjeuner</SelectItem>
                    <SelectItem value="dinner">Dîner</SelectItem>
                    <SelectItem value="snack">Collation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <Label>Heure</Label>
                  <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div><Label>Calories</Label><Input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} /></div>
                <div><Label>Protéines (g)</Label><Input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} /></div>
                <div><Label>Glucides (g)</Label><Input type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} /></div>
                <div><Label>Lipides (g)</Label><Input type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} /></div>
              </div>
              <Button onClick={handleSubmit} disabled={createMealMutation.isPending}>
                {createMealMutation.isPending ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Daily Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé du jour</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <Skeleton className="h-20" />
          ) : dailySummary ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{dailySummary.total_meals}</p>
                <p className="text-sm text-muted-foreground">Repas</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{dailySummary.total_calories}</p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{dailySummary.total_protein}g</p>
                <p className="text-sm text-muted-foreground">Protéines</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{dailySummary.total_carbs}g</p>
                <p className="text-sm text-muted-foreground">Glucides</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{dailySummary.total_fat}g</p>
                <p className="text-sm text-muted-foreground">Lipides</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun repas aujourd'hui</p>
          )}
        </CardContent>
      </Card>

      {/* Meals List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des repas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : meals?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heure</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>P</TableHead>
                  <TableHead>C</TableHead>
                  <TableHead>L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>{meal.time}</TableCell>
                    <TableCell className="capitalize">{meal.meal_type}</TableCell>
                    <TableCell>{meal.calories}</TableCell>
                    <TableCell>{meal.protein}g</TableCell>
                    <TableCell>{meal.carbs}g</TableCell>
                    <TableCell>{meal.fat}g</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Aucun repas enregistré</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}