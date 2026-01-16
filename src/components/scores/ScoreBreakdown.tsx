import { cn } from '@/lib/utils'
import { ScoreBar } from './ScoreBar'

interface ScoreBreakdownProps {
  breakdown: Record<string, number>
  maxScore?: number
  className?: string
}

// Labels français pour les critères de scoring
const criteriaLabels: Record<string, string> = {
  // Physique
  payload_kg: 'Charge utile',
  speed_mps: 'Vitesse',
  battery_hours: 'Autonomie batterie',
  height_cm: 'Taille',
  weight_kg: 'Poids',
  dof_count: 'Degrés de liberté',

  // Capteurs & Navigation
  lidar: 'LiDAR',
  vision_cameras: 'Caméras vision',
  depth_sensors: 'Capteurs profondeur',
  slam: 'SLAM',
  gps: 'GPS',

  // IA & Cognition
  voice_recognition: 'Reconnaissance vocale',
  nlp: 'Traitement langage naturel',
  object_recognition: 'Reconnaissance objets',
  face_recognition: 'Reconnaissance faciale',
  emotion_detection: 'Détection émotions',

  // Manipulation
  gripper_type: 'Type de préhension',
  manipulation_precision: 'Précision manipulation',
  force_feedback: 'Retour de force',

  // Communication
  wifi: 'WiFi',
  bluetooth: 'Bluetooth',
  cellular: '4G/5G',

  // Sécurité
  emergency_stop: 'Arrêt d\'urgence',
  collision_detection: 'Détection collision',
  safety_rating: 'Certification sécurité',

  // Autres
  waterproof: 'Étanchéité',
  dust_resistance: 'Résistance poussière',
  operating_temp: 'Plage température',
}

function getCriteriaLabel(key: string): string {
  return criteriaLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function ScoreBreakdown({
  breakdown,
  maxScore = 100,
  className,
}: ScoreBreakdownProps) {
  const entries = Object.entries(breakdown)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)

  if (entries.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        Aucun détail de score disponible
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {entries.map(([criterion, score]) => (
        <div key={criterion} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {getCriteriaLabel(criterion)}
            </span>
            <span className="font-medium tabular-nums">
              {Math.round(score)}/{maxScore}
            </span>
          </div>
          <ScoreBar
            score={score}
            maxScore={maxScore}
            showLabel={false}
            size="sm"
          />
        </div>
      ))}
    </div>
  )
}

// Version compacte pour les cards
interface ScoreBreakdownCompactProps {
  breakdown: Record<string, number>
  limit?: number
  className?: string
}

export function ScoreBreakdownCompact({
  breakdown,
  limit = 3,
  className,
}: ScoreBreakdownCompactProps) {
  const topEntries = Object.entries(breakdown)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {topEntries.map(([criterion, score]) => (
        <div
          key={criterion}
          className="flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded-full"
        >
          <span className="text-muted-foreground">
            {getCriteriaLabel(criterion)}
          </span>
          <span className="font-semibold">{Math.round(score)}</span>
        </div>
      ))}
    </div>
  )
}
