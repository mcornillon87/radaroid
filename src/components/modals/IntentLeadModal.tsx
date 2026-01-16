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

interface IntentLeadModalProps {
  robotId: string
  robotName: string
  children?: React.ReactNode
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function IntentLeadModal({
  robotId,
  robotName,
  children,
}: IntentLeadModalProps) {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [industry, setIndustry] = useState('')
  const [fleetSize, setFleetSize] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    setError(null)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robot_id: robotId,
          user_email: email,
          user_industry: industry || undefined,
          fleet_size_interest: fleetSize || undefined,
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
        // Reset form
        setEmail('')
        setIndustry('')
        setFleetSize('')
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
          <Button className="w-full">
            Ce robot m&apos;intéresse
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Intéressé par {robotName} ?</DialogTitle>
          <DialogDescription>
            Laissez vos coordonnées pour être contacté par notre équipe.
          </DialogDescription>
        </DialogHeader>

        {formState === 'success' ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-600 font-medium">
              Merci ! Nous vous recontacterons rapidement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot - invisible to humans */}
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
              <Label htmlFor="industry">Secteur d&apos;activité</Label>
              <Input
                id="industry"
                placeholder="Ex: Logistique, Santé, Hôtellerie..."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={formState === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fleet-size">Taille de flotte envisagée</Label>
              <Select
                value={fleetSize}
                onValueChange={setFleetSize}
                disabled={formState === 'loading'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 robots</SelectItem>
                  <SelectItem value="6-20">6-20 robots</SelectItem>
                  <SelectItem value="21-100">21-100 robots</SelectItem>
                  <SelectItem value="100+">100+ robots</SelectItem>
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
              {formState === 'loading' ? 'Envoi...' : 'Envoyer'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
