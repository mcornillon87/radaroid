import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRobotBySlug, getAllRobotSlugs } from '@/lib/queries/robots'
import { getRobotScores, JOB_ICONS } from '@/lib/queries/jobs'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  ScoreBar,
  ScoreCircle,
  MaturityIndex,
  MaturityStatus,
} from '@/components/scores'
import {
  IntentLeadModal,
  ClaimPageModal,
  ErrorReportModal,
} from '@/components/modals'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllRobotSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const robot = await getRobotBySlug(slug, 'fr')

  if (!robot) {
    return { title: 'Robot non trouvé | Radaroid' }
  }

  const i18n = robot.i18n[0]
  return {
    title: `${robot.name} | Radaroid`,
    description:
      i18n?.description ||
      `Découvrez les spécifications techniques et scores de ${robot.name} par métier.`,
  }
}

export const revalidate = 3600 // ISR: 1 heure

export default async function RobotPage({ params }: PageProps) {
  const { slug } = await params
  const robot = await getRobotBySlug(slug, 'fr')

  if (!robot) {
    notFound()
  }

  const scores = await getRobotScores(slug, 'fr')
  const i18n = robot.i18n[0]
  const specs = (robot.specs as Record<string, unknown>) || {}

  // Trier les scores par score décroissant
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/robots" className="text-blue-600 hover:underline">
            Robots
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">{robot.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
            <span className="text-9xl text-slate-300">🤖</span>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              {robot.brand && (
                <p className="text-sm text-slate-500 mb-1">{robot.brand.name}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {robot.name}
              </h1>
              {i18n?.tagline && (
                <p className="text-lg text-slate-600 mt-2">{i18n.tagline}</p>
              )}
            </div>

            <MaturityIndex
              status={(robot.status as MaturityStatus) || 'prototype'}
            />

            {i18n?.description && (
              <p className="text-slate-600">{i18n.description}</p>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {typeof specs.height_cm === 'number' && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-sm text-slate-500">Taille</div>
                  <div className="text-xl font-semibold">
                    {specs.height_cm} cm
                  </div>
                </div>
              )}
              {typeof specs.weight_kg === 'number' && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-sm text-slate-500">Poids</div>
                  <div className="text-xl font-semibold">
                    {specs.weight_kg} kg
                  </div>
                </div>
              )}
              {typeof specs.payload_kg === 'number' && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-sm text-slate-500">Charge utile</div>
                  <div className="text-xl font-semibold">
                    {specs.payload_kg} kg
                  </div>
                </div>
              )}
              {typeof specs.battery_hours === 'number' && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-sm text-slate-500">Autonomie</div>
                  <div className="text-xl font-semibold">
                    {specs.battery_hours}h
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <IntentLeadModal robotId={robot.id} robotName={robot.name} />
              <div className="flex gap-4 text-sm">
                <ClaimPageModal robotId={robot.id} robotName={robot.name} />
                <ErrorReportModal
                  entityType="robot"
                  entityId={robot.id}
                  entityName={robot.name}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scores par Métier */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Scores par Métier
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedScores.map(({ job, score }) => {
              const jobI18n = job.i18n[0]
              const icon = JOB_ICONS[job.slug] || '💼'

              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition"
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">
                      {jobI18n?.seo_title || job.slug}
                    </div>
                    <ScoreBar score={score} size="sm" />
                  </div>
                  <ScoreCircle score={score} size="sm" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* Specs Techniques */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Spécifications Techniques
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {Object.entries(specs).map(([key, value], index) => (
                <div
                  key={key}
                  className={`flex justify-between p-4 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  } border-b border-slate-100 last:border-b-0`}
                >
                  <span className="text-slate-600">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="font-medium text-slate-900">
                    {typeof value === 'boolean'
                      ? value
                        ? '✅ Oui'
                        : '❌ Non'
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer className="mt-12" />
    </div>
  )
}
