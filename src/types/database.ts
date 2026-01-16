/**
 * Database types for Radaroid
 * These will be auto-generated from Supabase later with:
 * npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
 *
 * For now, we define them manually based on the SQL schema.
 */

// ════════════════════════════════════════════════════════════════════════════
// BRANDS
// ════════════════════════════════════════════════════════════════════════════

export interface Brand {
  id: string
  slug: string
  name: string
  logo_url: string | null
  country: string | null
  website: string | null
  created_at: string
}

// ════════════════════════════════════════════════════════════════════════════
// ROBOTS
// ════════════════════════════════════════════════════════════════════════════

export interface Robot {
  id: string
  slug: string
  name: string
  brand_id: string | null
  specs: Record<string, unknown>
  youtube_review_url: string | null
  official_video_url: string | null
  status: 'prototype' | 'pilot' | 'production'
  created_at: string
}

export interface RobotI18n {
  robot_id: string
  locale: string
  tagline: string | null
  description: string | null
}

export interface RobotMedia {
  id: string
  robot_id: string
  type: 'image' | 'video'
  url: string
  alt: string | null
  blur_data_url: string | null
  is_hero: boolean
}

export interface RobotWithRelations extends Robot {
  brand: Brand | null
  i18n: RobotI18n[]
  media: RobotMedia[]
  scores: RobotJobScore[]
}

// ════════════════════════════════════════════════════════════════════════════
// JOBS
// ════════════════════════════════════════════════════════════════════════════

export interface Job {
  id: string
  slug: string
  scoring_criteria: {
    criteria: Record<string, import('@/lib/scoring/engine').Criterion>
  }
  video_protocol_url: string | null
  sort_order: number
}

export interface JobI18n {
  job_id: string
  locale: string
  seo_title: string
  technical_title: string
  description: string | null
}

export interface JobWithI18n extends Job {
  i18n: JobI18n[]
}

// ════════════════════════════════════════════════════════════════════════════
// SCORES
// ════════════════════════════════════════════════════════════════════════════

export interface RobotJobScore {
  robot_id: string
  job_id: string
  score_tech: number
  score_breakdown: Record<string, number>
  last_calculated_at: string
}

export interface RobotJobScoreWithRelations extends RobotJobScore {
  robot: Robot
  job: Job
}

// ════════════════════════════════════════════════════════════════════════════
// DEPLOYMENTS (OSINT)
// ════════════════════════════════════════════════════════════════════════════

export interface Deployment {
  id: string
  robot_id: string
  job_id: string | null
  company_name: string | null
  status: 'pilot' | 'poc' | 'full_deploy' | null
  robot_count: number | null
  source_url: string | null
  is_verified: boolean
  created_at: string
}

// ════════════════════════════════════════════════════════════════════════════
// GLOSSARY
// ════════════════════════════════════════════════════════════════════════════

export interface GlossaryTerm {
  id: string
  slug: string
  category: string | null
  created_at: string
}

export interface GlossaryTermI18n {
  term_id: string
  locale: string
  term: string
  definition_short: string | null
  definition_long: string | null
}

export interface GlossaryTermWithI18n extends GlossaryTerm {
  i18n: GlossaryTermI18n[]
}

// ════════════════════════════════════════════════════════════════════════════
// LEAD GEN & GROWTH
// ════════════════════════════════════════════════════════════════════════════

export interface IntentLead {
  id: string
  robot_id: string
  user_email: string
  user_industry: string | null
  fleet_size_interest: string | null
  created_at: string
}

export interface JobAlert {
  id: string
  email: string
  job_id: string
  threshold_score: number
  is_verified: boolean
  created_at: string
}

export interface PageClaim {
  id: string
  robot_id: string
  contact_name: string
  contact_email: string
  proof_url: string | null
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
}

export interface ErrorReport {
  id: string
  entity_type: 'robot' | 'deployment' | 'job'
  entity_id: string
  reported_by_email: string | null
  description: string
  status: 'pending' | 'reviewed' | 'applied' | 'rejected'
  created_at: string
}

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════

export const LOCALES = ['fr', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const ROBOT_STATUSES = ['prototype', 'pilot', 'production'] as const
export type RobotStatus = (typeof ROBOT_STATUSES)[number]

export const JOB_CATEGORIES = {
  pro: ['warehouse-picker', 'waiter', 'site-laborer', 'security-patrol', 'nurse-assistant', 'receptionist'],
  consumer: ['butler', 'cook', 'elderly-care', 'tutor', 'gardener', 'dog-walker']
} as const
