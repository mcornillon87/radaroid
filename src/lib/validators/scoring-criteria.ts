/**
 * Zod schema for job scoring criteria validation
 * Ensures scoring_criteria JSONB in jobs table is well-formed
 */
import { z } from 'zod'

const CriterionSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  weight: z.number().min(0).max(100),
  type: z.enum(['numeric', 'boolean', 'enum_score']),
  unit: z.string().optional(),
  thresholds: z.object({
    min: z.number(),
    ideal: z.number()
  }).optional(),
  required: z.boolean().optional(),
  options: z.record(z.string(), z.number()).optional()
}).refine(
  (data) => {
    // If type = numeric, thresholds must exist
    if (data.type === 'numeric' && !data.thresholds) return false
    // If type = enum_score, options must exist
    if (data.type === 'enum_score' && !data.options) return false
    return true
  },
  { message: 'Invalid criterion: numeric requires thresholds, enum_score requires options' }
)

export const ScoringCriteriaSchema = z.object({
  criteria: z.record(z.string(), CriterionSchema)
})

export type ScoringCriteria = z.infer<typeof ScoringCriteriaSchema>
export type Criterion = z.infer<typeof CriterionSchema>

export interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Validate scoring criteria at runtime
 * @param data - Raw scoring_criteria object from database or API
 * @returns Validation result with typed data or error message
 */
export function validateScoringCriteria(data: unknown): ValidationResult<ScoringCriteria> {
  const result = ScoringCriteriaSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    error: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
  }
}

/**
 * Calculate total weight sum for a criteria set
 * Useful for validation warnings (should ideally sum to 100)
 */
export function getTotalWeight(criteria: ScoringCriteria): number {
  return Object.values(criteria.criteria).reduce((sum, c) => sum + c.weight, 0)
}

/**
 * Check if weights sum to 100 (best practice warning, not error)
 */
export function checkWeightsSum(criteria: ScoringCriteria): { valid: boolean; total: number } {
  const total = getTotalWeight(criteria)
  return { valid: total === 100, total }
}
