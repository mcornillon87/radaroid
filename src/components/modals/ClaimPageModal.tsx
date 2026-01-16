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

interface ClaimPageModalProps {
  robotId: string
  robotName: string
  children?: React.ReactNode
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ClaimPageModal({
  robotId,
  robotName,
  children,
}: ClaimPageModalProps) {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [proofUrl, setProofUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    setError(null)

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robot_id: robotId,
          contact_name: name,
          contact_email: email,
          proof_url: proofUrl || undefined,
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
        setName('')
        setEmail('')
        setProofUrl('')
        setFormState('idle')
      }, 3000)
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
            Vous êtes le fabricant ?
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revendiquer cette page</DialogTitle>
          <DialogDescription>
            Vous représentez le fabricant de {robotName} ?
            Demandez l&apos;accès pour mettre à jour les informations.
          </DialogDescription>
        </DialogHeader>

        {formState === 'success' ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <p className="text-green-600 font-medium">
              Demande envoyée !
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Nous vérifierons votre demande et vous recontacterons.
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
              <Label htmlFor="name">Votre nom *</Label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                disabled={formState === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@fabricant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={formState === 'loading'}
              />
              <p className="text-xs text-slate-500">
                Utilisez votre email d&apos;entreprise pour accélérer la vérification.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof-url">Preuve (optionnel)</Label>
              <Input
                id="proof-url"
                type="url"
                placeholder="https://fabricant.com/notre-equipe"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                disabled={formState === 'loading'}
              />
              <p className="text-xs text-slate-500">
                Lien vers une page officielle montrant votre affiliation.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={formState === 'loading'}
            >
              {formState === 'loading' ? 'Envoi...' : 'Envoyer la demande'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
