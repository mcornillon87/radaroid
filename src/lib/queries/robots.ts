import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { Robot, Brand, RobotI18n } from '@/types/database'

export interface RobotWithRelations extends Robot {
  brand: Brand | null
  i18n: RobotI18n[]
}

/**
 * Get all robots with brand and i18n
 */
export async function getRobots(locale: string = 'fr'): Promise<RobotWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('robots')
    .select(`
      *,
      brand:brands(*),
      i18n:robots_i18n!inner(*)
    `)
    .is('deleted_at', null)
    .eq('i18n.locale', locale)
    .order('name')

  if (error) {
    console.error('Error fetching robots:', error)
    return []
  }

  return (data as RobotWithRelations[]) || []
}

/**
 * Get a single robot by slug with brand and i18n
 */
export async function getRobotBySlug(
  slug: string,
  locale: string = 'fr'
): Promise<RobotWithRelations | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('robots')
    .select(`
      *,
      brand:brands(*),
      i18n:robots_i18n!inner(*)
    `)
    .eq('slug', slug)
    .is('deleted_at', null)
    .eq('i18n.locale', locale)
    .single()

  if (error) {
    console.error('Error fetching robot:', error)
    return null
  }

  return data as RobotWithRelations
}

/**
 * Get all robot slugs (for static generation)
 * Uses static client without cookies for build-time generation
 */
export async function getAllRobotSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('robots')
    .select('slug')
    .is('deleted_at', null)

  if (error) {
    console.error('Error fetching robot slugs:', error)
    return []
  }

  return data?.map(r => r.slug) || []
}

/**
 * Get robots count
 */
export async function getRobotsCount(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('robots')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  if (error) {
    console.error('Error counting robots:', error)
    return 0
  }

  return count || 0
}
