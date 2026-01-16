import { createClient } from '@/lib/supabase/server'
import type { Deployment, Robot, Job, RobotI18n, JobI18n } from '@/types/database'

export interface DeploymentWithRelations extends Deployment {
  robot: (Robot & { i18n: RobotI18n[] }) | null
  job: (Job & { i18n: JobI18n[] }) | null
}

/**
 * Get all deployments with robot and job relations
 */
export async function getDeployments(
  locale: string = 'fr'
): Promise<DeploymentWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deployments')
    .select(`
      *,
      robot:robots(*, i18n:robots_i18n(*)),
      job:jobs(*, i18n:jobs_i18n(*))
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching deployments:', error)
    return []
  }

  // Filter i18n to requested locale
  return (data || []).map((deployment) => {
    const robotI18n = deployment.robot?.i18n?.filter(
      (i: RobotI18n) => i.locale === locale
    ) || []
    const jobI18n = deployment.job?.i18n?.filter(
      (i: JobI18n) => i.locale === locale
    ) || []

    return {
      ...deployment,
      robot: deployment.robot ? { ...deployment.robot, i18n: robotI18n } : null,
      job: deployment.job ? { ...deployment.job, i18n: jobI18n } : null,
    } as DeploymentWithRelations
  })
}

/**
 * Get verified deployments only
 */
export async function getVerifiedDeployments(
  locale: string = 'fr'
): Promise<DeploymentWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deployments')
    .select(`
      *,
      robot:robots(*, i18n:robots_i18n(*)),
      job:jobs(*, i18n:jobs_i18n(*))
    `)
    .eq('is_verified', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching verified deployments:', error)
    return []
  }

  return (data || []).map((deployment) => {
    const robotI18n = deployment.robot?.i18n?.filter(
      (i: RobotI18n) => i.locale === locale
    ) || []
    const jobI18n = deployment.job?.i18n?.filter(
      (i: JobI18n) => i.locale === locale
    ) || []

    return {
      ...deployment,
      robot: deployment.robot ? { ...deployment.robot, i18n: robotI18n } : null,
      job: deployment.job ? { ...deployment.job, i18n: jobI18n } : null,
    } as DeploymentWithRelations
  })
}

/**
 * Get deployment stats
 */
export async function getDeploymentStats(): Promise<{
  total: number
  verified: number
  totalRobots: number
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deployments')
    .select('is_verified, robot_count')

  if (error) {
    console.error('Error fetching deployment stats:', error)
    return { total: 0, verified: 0, totalRobots: 0 }
  }

  const total = data?.length || 0
  const verified = data?.filter((d) => d.is_verified).length || 0
  const totalRobots = data?.reduce((sum, d) => sum + (d.robot_count || 0), 0) || 0

  return { total, verified, totalRobots }
}
