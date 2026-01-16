import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export type MaturityStatus = 'prototype' | 'pilot' | 'production' | 'discontinued'

interface MaturityBadgeProps {
  status: MaturityStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const statusConfig: Record<
  MaturityStatus,
  { label: string; icon: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  prototype: {
    label: 'Prototype',
    icon: '🔬',
    variant: 'secondary',
  },
  pilot: {
    label: 'Pilote',
    icon: '🚀',
    variant: 'outline',
  },
  production: {
    label: 'Production',
    icon: '✅',
    variant: 'default',
  },
  discontinued: {
    label: 'Abandonné',
    icon: '⚠️',
    variant: 'destructive',
  },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

export function MaturityBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: MaturityBadgeProps) {
  const config = statusConfig[status] || statusConfig.prototype

  return (
    <Badge
      variant={config.variant}
      className={cn(sizeClasses[size], className)}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  )
}

// Composant pour afficher l'index de maturité avec plus de détails
interface MaturityIndexProps {
  status: MaturityStatus
  deploymentCount?: number
  className?: string
}

export function MaturityIndex({
  status,
  deploymentCount = 0,
  className,
}: MaturityIndexProps) {
  const statusDescriptions: Record<MaturityStatus, string> = {
    prototype: 'En développement, pas encore de déploiement commercial',
    pilot: 'Programmes pilotes en cours avec des partenaires',
    production: 'Disponible commercialement et déployé',
    discontinued: 'Projet arrêté ou abandonné',
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <MaturityBadge status={status} size="lg" />
        {deploymentCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {deploymentCount} déploiement{deploymentCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {statusDescriptions[status]}
      </p>
    </div>
  )
}
