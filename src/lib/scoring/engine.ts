/**
 * Radaroid Scoring Engine
 *
 * Calculates job-fit scores based on robot specifications
 * and job-specific criteria defined in JSON.
 *
 * Supports 3 criterion types:
 * - numeric: Linear interpolation between min and ideal thresholds
 * - boolean: All-or-nothing based on required value
 * - enum_score: Direct mapping from option to score
 */

export interface Criterion {
  label?: string
  description?: string
  weight: number
  type: 'numeric' | 'boolean' | 'enum_score'
  unit?: string
  thresholds?: { min: number; ideal: number }
  required?: boolean
  options?: Record<string, number>
}

export interface ScoringCriteria {
  criteria: Record<string, Criterion>
}

export interface ScoreResult {
  /** Overall weighted score (0-100) */
  score: number
  /** Individual criterion scores (0-100 each) */
  breakdown: Record<string, number>
  /** Criteria that couldn't be evaluated (missing specs) */
  missing: string[]
}

/**
 * Calculate the job-fit score for a robot based on its specs and job criteria
 *
 * @param robotSpecs - The robot's technical specifications (from robots.specs JSONB)
 * @param criteria - The job's scoring criteria (from jobs.scoring_criteria.criteria)
 * @returns ScoreResult with overall score, breakdown, and missing criteria
 *
 * @example
 * ```ts
 * const specs = { payload_capacity: 25, runtime_efficiency: 6 }
 * const criteria = {
 *   payload_capacity: { weight: 50, type: 'numeric', thresholds: { min: 10, ideal: 30 } },
 *   runtime_efficiency: { weight: 50, type: 'numeric', thresholds: { min: 4, ideal: 8 } }
 * }
 * const result = calculateScore(specs, criteria)
 * // result.score = 75 (average of payload: 75% and runtime: 50%)
 * ```
 */
export function calculateScore(
  robotSpecs: Record<string, unknown>,
  criteria: Record<string, Criterion>
): ScoreResult {
  let totalWeightedScore = 0
  let totalWeight = 0
  const breakdown: Record<string, number> = {}
  const missing: string[] = []

  for (const [key, rules] of Object.entries(criteria)) {
    const value = robotSpecs[key]
    let criterionScore = 0
    let evaluated = false

    // ═══════════════════════════════════════════════════════════
    // TYPE NUMERIC (Linear interpolation)
    // ═══════════════════════════════════════════════════════════
    if (rules.type === 'numeric' && rules.thresholds) {
      if (typeof value === 'number') {
        const { min, ideal } = rules.thresholds

        if (value >= ideal) {
          criterionScore = 100
        } else if (value <= min) {
          criterionScore = 0
        } else {
          // Linear interpolation between min and ideal
          criterionScore = ((value - min) / (ideal - min)) * 100
        }
        evaluated = true
      }
    }

    // ═══════════════════════════════════════════════════════════
    // TYPE BOOLEAN (All or nothing)
    // ═══════════════════════════════════════════════════════════
    else if (rules.type === 'boolean') {
      if (value !== undefined) {
        const requiredValue = rules.required ?? true
        criterionScore = (Boolean(value) === requiredValue) ? 100 : 0
        evaluated = true
      }
    }

    // ═══════════════════════════════════════════════════════════
    // TYPE ENUM_SCORE (Direct mapping via JSON)
    // ═══════════════════════════════════════════════════════════
    else if (rules.type === 'enum_score' && rules.options) {
      if (typeof value === 'string' && value in rules.options) {
        criterionScore = rules.options[value]
        evaluated = true
      }
    }

    // Track results
    if (evaluated) {
      totalWeightedScore += criterionScore * rules.weight
      totalWeight += rules.weight
      breakdown[key] = Math.round(criterionScore)
    } else {
      missing.push(key)
    }
  }

  // Calculate final score (handle edge case of no evaluated criteria)
  const finalScore = totalWeight > 0
    ? Math.round(totalWeightedScore / totalWeight)
    : 0

  return {
    score: finalScore,
    breakdown,
    missing
  }
}

/**
 * Calculate scores for a robot across all jobs
 *
 * @param robotSpecs - The robot's technical specifications
 * @param jobs - Array of jobs with their scoring criteria
 * @returns Array of job scores
 */
export function calculateAllJobScores(
  robotSpecs: Record<string, unknown>,
  jobs: Array<{ id: string; slug: string; scoring_criteria: ScoringCriteria }>
): Array<{ job_id: string; job_slug: string; result: ScoreResult }> {
  return jobs.map((job) => ({
    job_id: job.id,
    job_slug: job.slug,
    result: calculateScore(robotSpecs, job.scoring_criteria.criteria)
  }))
}

/**
 * Get a human-readable label for a score
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Very Good'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Moderate'
  if (score >= 20) return 'Limited'
  return 'Not Suitable'
}

/**
 * Get a color class for a score (Tailwind)
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Get a background color class for a score bar (Tailwind)
 */
export function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-blue-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}
