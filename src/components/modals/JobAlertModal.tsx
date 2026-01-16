'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface JobAlertModalProps {
  jobId: string
  jobName: string
  children?: React.ReactNode
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function JobAlertModal({
  jobId,
  jobName,
  children,
}: JobAlertModalProps) {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [threshold, setThreshold] = useState('70')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    setError(null)

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          email: email,
          threshold_score: parseInt(threshold, 10),
          website: '', // honeypot
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      setFormState('success')
      setTimeout(() => {
        setOpen(false)
        setEmail('')
        setThreshold('70')
        setFormState('idle')
      }, 2000)
    } catch (err) {
      setFormState('error')
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            Créer une alerte
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alerte pour {jobName}</DialogTitle>
          <DialogDescription>
            Recevez un email quand un robot atteint votre score cible pour ce métier.
          </DialogDescription>
        </DialogHeader>

        {formState === 'success' ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <p className="text-green-600 font-medium">
              Alerte créée ! Vous serez notifié.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={formState === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">M&apos;alerter quand un robot atteint</Label>
              <Select
                value={threshold}
                onValueChange={setThreshold}
                disabled={formState === 'loading'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60+ (bon potentiel)</SelectItem>
                  <SelectItem value="70">70+ (très bon)</SelectItem>
                  <SelectItem value="80">80+ (excellent)</SelectItem>
                  <SelectItem value="90">90+ (exceptionnel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={formState === 'loading'}
            >
              {formState === 'loading' ? 'Création...' : 'Créer l\'alerte'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
