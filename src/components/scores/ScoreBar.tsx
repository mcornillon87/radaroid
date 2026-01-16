import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number
  maxScore?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-lime-500'
  if (score >= 40) return 'bg-yellow-500'
  if (score >= 20) return 'bg-orange-500'
  return 'bg-red-500'
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-lime-600'
  if (score >= 40) return 'text-yellow-600'
  if (score >= 20) return 'text-orange-600'
  return 'text-red-600'
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function ScoreBar({
  score,
  maxScore = 100,
  showLabel = true,
  size = 'md',
  className,
}: ScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100))
  const roundedScore = Math.round(score)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex-1 bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            getScoreColor(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            'text-sm font-semibold tabular-nums min-w-[2.5rem] text-right',
            getScoreTextColor(percentage)
          )}
        >
          {roundedScore}
        </span>
      )}
    </div>
  )
}

export function ScoreCircle({
  score,
  size = 'md',
  className,
}: Omit<ScoreBarProps, 'showLabel'>) {
  const percentage = Math.min(100, Math.max(0, score))
  const roundedScore = Math.round(score)

  const sizeMap = {
    sm: { container: 'w-12 h-12', text: 'text-sm' },
    md: { container: 'w-16 h-16', text: 'text-lg' },
    lg: { container: 'w-20 h-20', text: 'text-2xl' },
  }

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={cn(
        'relative',
        sizeMap[size].container,
        className
      )}
    >
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="fill-none stroke-gray-200"
          strokeWidth="8"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className={cn('fill-none transition-all duration-500', {
            'stroke-green-500': percentage >= 80,
            'stroke-lime-500': percentage >= 60 && percentage < 80,
            'stroke-yellow-500': percentage >= 40 && percentage < 60,
            'stroke-orange-500': percentage >= 20 && percentage < 40,
            'stroke-red-500': percentage < 20,
          })}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            'font-bold tabular-nums',
            sizeMap[size].text,
            getScoreTextColor(percentage)
          )}
        >
          {roundedScore}
        </span>
      </div>
    </div>
  )
}
