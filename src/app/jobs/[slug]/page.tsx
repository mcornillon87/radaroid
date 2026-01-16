import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJobLeaderboard, getAllJobSlugs, JOB_ICONS } from '@/lib/queries/jobs'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  ScoreBar,
  ScoreCircle,
  MaturityBadge,
  MaturityStatus,
  ScoreBreakdown,
} from '@/components/scores'
import { JobAlertModal, ErrorReportModal } from '@/components/modals'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllJobSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const leaderboard = await getJobLeaderboard(slug, 'fr')

  if (!leaderboard) {
    return { title: 'Métier non trouvé | Radaroid' }
  }

  const i18n = leaderboard.job.i18n[0]
  return {
    title: `${i18n?.seo_title || slug} - Leaderboard Robots | Radaroid`,
    description:
      i18n?.description ||
      `Classement des robots humanoïdes pour le métier ${i18n?.seo_title}. Comparez les scores techniques.`,
  }
}

export const revalidate = 3600 // ISR: 1 heure

export default async function JobLeaderboardPage({ params }: PageProps) {
  const { slug } = await params
  const leaderboard = await getJobLeaderboard(slug, 'fr')

  if (!leaderboard) {
    notFound()
  }

  const { job, robots } = leaderboard
  const i18n = job.i18n[0]
  const icon = JOB_ICONS[job.slug] || '💼'
  const criteria = job.scoring_criteria?.criteria || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/jobs" className="text-blue-600 hover:underline">
            Métiers
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">{i18n?.seo_title || job.slug}</span>
        </nav>

        {/* Job Header */}
        <div className="flex items-start gap-6 mb-12">
          <span className="text-6xl">{icon}</span>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {i18n?.seo_title || job.slug}
            </h1>
            {i18n?.technical_title && (
              <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">
                {i18n.technical_title}
              </p>
            )}
            {i18n?.description && (
              <p className="text-lg text-slate-600 max-w-2xl mb-4">
                {i18n.description}
              </p>
            )}
            <div className="flex items-center gap-4">
              <JobAlertModal
                jobId={job.id}
                jobName={i18n?.seo_title || job.slug}
              />
              <ErrorReportModal
                entityType="job"
                entityId={job.id}
                entityName={i18n?.seo_title || job.slug}
              />
            </div>
          </div>
        </div>

        {/* Scoring Criteria */}
        {Object.keys(criteria).length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Critères d&apos;évaluation
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(criteria).map(([key, config]) => {
                const weight = (config as { weight?: number })?.weight || 0
                return (
                  <span
                    key={key}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {key.replace(/_/g, ' ')} ({Math.round(weight * 100)}%)
                  </span>
                )
              })}
            </div>
          </section>
        )}

        {/* Leaderboard */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Classement des Robots
          </h2>

          <div className="space-y-4">
            {robots.map((item, index) => {
              const robotI18n = item.robot.i18n[0]
              const isTop3 = index < 3

              return (
                <div
                  key={item.robot.id}
                  className={`bg-white border rounded-xl p-6 transition-all ${
                    isTop3
                      ? 'border-blue-200 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        item.rank === 1
                          ? 'bg-yellow-100 text-yellow-700'
                          : item.rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : item.rank === 3
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.rank === 1
                        ? '🥇'
                        : item.rank === 2
                        ? '🥈'
                        : item.rank === 3
                        ? '🥉'
                        : item.rank}
                    </div>

                    {/* Robot Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Link
                          href={`/robots/${item.robot.slug}`}
                          className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition"
                        >
                          {item.robot.name}
                        </Link>
                        <MaturityBadge
                          status={
                            (item.robot.status as MaturityStatus) || 'prototype'
                          }
                          size="sm"
                          showIcon={false}
                        />
                      </div>
                      {item.robot.brand && (
                        <p className="text-sm text-slate-500">
                          {item.robot.brand.name}
                        </p>
                      )}
                      {robotI18n?.tagline && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                          {robotI18n.tagline}
                        </p>
                      )}
                    </div>

                    {/* Score */}
                    <div className="hidden md:block w-48">
                      <ScoreBar score={item.score} />
                    </div>
                    <ScoreCircle score={item.score} size="md" />
                  </div>

                  {/* Score Breakdown - Hidden by default, could add toggle */}
                  {isTop3 && Object.keys(item.breakdown).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-500 mb-2">
                        Détail du score:
                      </p>
                      <ScoreBreakdown breakdown={item.breakdown} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {robots.length === 0 && (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
              <p className="text-slate-500">
                Aucun robot évalué pour ce métier.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer className="mt-12" />
    </div>
  )
}
