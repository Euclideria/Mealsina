import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useBloodTests, useUploadBloodTest } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_authenticated/blood-tests/')({
  component: BloodTestsPage,
})

function BloodTestsPage() {
  const { data: bloodTests, isLoading } = useBloodTests({ limit: 20 })
  const uploadMutation = useUploadBloodTest()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({ test_date: '', lab_name: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = () => {
    if (!selectedFile || !uploadForm.test_date || !uploadForm.lab_name) return
    uploadMutation.mutate(
      { file: selectedFile, test_date: uploadForm.test_date, lab_name: uploadForm.lab_name },
      { onSuccess: () => setIsUploadOpen(false) }
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bilans Sanguins</h1>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un bilan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Télécharger un bilan sanguin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Date du bilan</Label>
                <Input
                  type="date"
                  value={uploadForm.test_date}
                  onChange={(e) => setUploadForm({ ...uploadForm, test_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Nom du laboratoire</Label>
                <Input
                  value={uploadForm.lab_name}
                  onChange={(e) => setUploadForm({ ...uploadForm, lab_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Fichier PDF</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? 'Téléchargement...' : 'Télécharger'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des bilans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : bloodTests?.items?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Laboratoire</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodTests.items.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{new Date(test.test_date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{test.lab_name}</TableCell>
                    <TableCell>{test.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Aucun bilan disponible</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}