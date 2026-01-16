import { createClient, createStaticClient } from '@/lib/supabase/server'
import { calculateScore } from '@/lib/scoring/engine'
import type { Job, JobI18n, Robot, Brand, RobotI18n } from '@/types/database'

export interface JobWithI18n extends Job {
  i18n: JobI18n[]
}

export interface RobotWithScore {
  robot: Robot & { brand: Brand | null; i18n: RobotI18n[] }
  score: number
  breakdown: Record<string, number>
  rank: number
}

export interface JobLeaderboard {
  job: JobWithI18n
  robots: RobotWithScore[]
}

// Job icons mapping
export const JOB_ICONS: Record<string, string> = {
  'warehouse-picker': '📦',
  'waiter': '🍽️',
  'site-laborer': '🧱',
  'security-patrol': '🔒',
  'nurse-assistant': '🏥',
  'receptionist': '🛎️',
  'butler': '🎩',
  'cook': '🍳',
  'elderly-care': '👴',
  'tutor': '🎮',
  'gardener': '🌱',
  'dog-walker': '🐕',
}

/**
 * Get all jobs with i18n
 */
export async function getJobs(locale: string = 'fr'): Promise<JobWithI18n[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      i18n:jobs_i18n!inner(*)
    `)
    .is('deleted_at', null)
    .eq('i18n.locale', locale)
    .order('sort_order')

  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }

  return (data as JobWithI18n[]) || []
}

/**
 * Get a single job by slug with i18n
 */
export async function getJobBySlug(
  slug: string,
  locale: string = 'fr'
): Promise<JobWithI18n | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      i18n:jobs_i18n!inner(*)
    `)
    .eq('slug', slug)
    .is('deleted_at', null)
    .eq('i18n.locale', locale)
    .single()

  if (error) {
    console.error('Error fetching job:', error)
    return null
  }

  return data as JobWithI18n
}

/**
 * Get all job slugs (for static generation)
 * Uses static client without cookies for build-time generation
 */
export async function getAllJobSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('slug')
    .is('deleted_at', null)

  if (error) {
    console.error('Error fetching job slugs:', error)
    return []
  }

  return data?.map(j => j.slug) || []
}

/**
 * Get leaderboard for a job (robots ranked by score)
 */
export async function getJobLeaderboard(
  jobSlug: string,
  locale: string = 'fr'
): Promise<JobLeaderboard | null> {
  const supabase = await createClient()

  // 1. Get job with criteria
  const job = await getJobBySlug(jobSlug, locale)
  if (!job) return null

  // 2. Get all robots with specs
  const { data: robots, error } = await supabase
    .from('robots')
    .select(`
      *,
      brand:brands(*),
      i18n:robots_i18n!inner(*)
    `)
    .is('deleted_at', null)
    .eq('i18n.locale', locale)

  if (error || !robots) {
    console.error('Error fetching robots for leaderboard:', error)
    return null
  }

  // 3. Calculate scores for each robot
  const criteria = job.scoring_criteria?.criteria || {}
  const robotsWithScores: RobotWithScore[] = robots.map(robot => {
    const specs = (robot.specs as Record<string, unknown>) || {}
    const result = calculateScore(specs, criteria)

    return {
      robot: robot as Robot & { brand: Brand | null; i18n: RobotI18n[] },
      score: result.score,
      breakdown: result.breakdown,
      rank: 0 // Will be set after sorting
    }
  })

  // 4. Sort by score DESC and assign ranks
  robotsWithScores.sort((a, b) => b.score - a.score)
  robotsWithScores.forEach((item, index) => {
    item.rank = index + 1
  })

  return {
    job,
    robots: robotsWithScores
  }
}

/**
 * Get scores for a robot across all jobs
 */
export async function getRobotScores(
  robotSlug: string,
  locale: string = 'fr'
): Promise<Array<{ job: JobWithI18n; score: number; breakdown: Record<string, number> }>> {
  const supabase = await createClient()

  // Get robot
  const { data: robot, error: robotError } = await supabase
    .from('robots')
    .select('specs')
    .eq('slug', robotSlug)
    .is('deleted_at', null)
    .single()

  if (robotError || !robot) {
    console.error('Error fetching robot:', robotError)
    return []
  }

  // Get all jobs
  const jobs = await getJobs(locale)

  // Calculate scores
  const specs = (robot.specs as Record<string, unknown>) || {}

  return jobs.map(job => {
    const criteria = job.scoring_criteria?.criteria || {}
    const result = calculateScore(specs, criteria)

    return {
      job,
      score: result.score,
      breakdown: result.breakdown
    }
  })
}
