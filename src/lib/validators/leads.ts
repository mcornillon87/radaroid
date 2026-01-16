/**
 * Lead generation form validators
 * Zod schemas for intent leads, job alerts, error reports, and page claims
 */

import { z } from 'zod'
import { validateEmail } from './email'

// Custom Zod email refinement using our validator
const emailSchema = z.string().refine(
  (email) => validateEmail(email).valid,
  { message: 'Email invalide' }
)

/**
 * Intent Lead - "Ce robot m'intéresse"
 * Captures business interest in a specific robot
 */
export const intentLeadSchema = z.object({
  robot_id: z.string().uuid('ID robot invalide'),
  user_email: emailSchema,
  user_industry: z.string().max(100).optional(),
  fleet_size_interest: z
    .enum(['1-5', '6-20', '21-100', '100+'])
    .optional(),
})

export type IntentLeadInput = z.infer<typeof intentLeadSchema>

/**
 * Job Alert - "M'alerter quand un robot atteint ce score"
 * Email notification when robot reaches threshold on a job
 */
export const jobAlertSchema = z.object({
  job_id: z.string().uuid('ID métier invalide'),
  email: emailSchema,
  threshold_score: z
    .number()
    .min(0, 'Score minimum: 0')
    .max(100, 'Score maximum: 100')
    .default(70),
})

export type JobAlertInput = z.infer<typeof jobAlertSchema>

/**
 * Error Report - "Signaler une erreur"
 * User-submitted corrections for data quality
 */
export const errorReportSchema = z.object({
  entity_type: z.enum(['robot', 'job', 'deployment']),
  entity_id: z.string().uuid('ID invalide'),
  description: z
    .string()
    .min(10, 'Description trop courte (min 10 caractères)')
    .max(1000, 'Description trop longue (max 1000 caractères)'),
  reported_by_email: emailSchema.optional(),
})

export type ErrorReportInput = z.infer<typeof errorReportSchema>

/**
 * Page Claim - "Vous êtes le fabricant ?"
 * Manufacturer verification requests
 */
export const pageClaimSchema = z.object({
  robot_id: z.string().uuid('ID robot invalide'),
  contact_name: z
    .string()
    .min(2, 'Nom trop court')
    .max(100, 'Nom trop long'),
  contact_email: emailSchema,
  proof_url: z
    .string()
    .url('URL invalide')
    .optional()
    .or(z.literal('')),
})

export type PageClaimInput = z.infer<typeof pageClaimSchema>

/**
 * Common honeypot field schema
 * Should be empty - if filled, it's a bot
 */
export const honeypotSchema = z.object({
  website: z.string().max(0, 'Invalid submission').optional(),
})

/**
 * Combine any schema with honeypot
 */
export function withHoneypot<T extends z.ZodTypeAny>(schema: T) {
  return schema.and(honeypotSchema)
}
