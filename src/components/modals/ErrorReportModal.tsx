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
import { Textarea } from '@/components/ui/textarea'

interface ErrorReportModalProps {
  entityType: 'robot' | 'job' | 'deployment'
  entityId: string
  entityName: string
  children?: React.ReactNode
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ErrorReportModal({
  entityType,
  entityId,
  entityName,
  children,
}: ErrorReportModalProps) {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    setError(null)

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          description: description,
          reported_by_email: email || undefined,
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
        setDescription('')
        setEmail('')
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
          <button className="text-sm text-slate-500 hover:text-slate-700 underline">
            Signaler une erreur
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Signaler une erreur</DialogTitle>
          <DialogDescription>
            Vous avez repéré une information incorrecte sur {entityName} ?
            Aidez-nous à améliorer nos données.
          </DialogDescription>
        </DialogHeader>

        {formState === 'success' ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-600 font-medium">
              Merci pour votre signalement !
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
              <Label htmlFor="description">Description de l&apos;erreur *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez l'erreur que vous avez repérée (min. 10 caractères)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={10}
                maxLength={1000}
                rows={4}
                disabled={formState === 'loading'}
              />
              <p className="text-xs text-slate-500">
                {description.length}/1000 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Votre email (optionnel)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Pour être informé de la correction"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={formState === 'loading'}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={formState === 'loading' || description.length < 10}
            >
              {formState === 'loading' ? 'Envoi...' : 'Envoyer le signalement'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
