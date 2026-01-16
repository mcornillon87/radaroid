import Link from 'next/link'
import { Metadata } from 'next'
import { getJobs, JOB_ICONS } from '@/lib/queries/jobs'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Métiers Automatisables | Radaroid',
  description:
    'Explorez les métiers automatisables par des robots humanoïdes. Comparez les robots par métier : manutention, service, santé, sécurité et plus.',
}

export const revalidate = 3600 // ISR: 1 heure

export default async function JobsPage() {
  const jobs = await getJobs('fr')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Métiers Automatisables
          </h1>
          <p className="text-lg text-slate-600">
            Découvrez quel robot est le mieux adapté pour chaque métier.
            {jobs.length} métiers analysés avec leurs critères techniques.
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {jobs.map((job) => {
            const i18n = job.i18n[0]
            const icon = JOB_ICONS[job.slug] || '💼'

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="group flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all text-center"
              >
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {icon}
                </span>
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition mb-1">
                  {i18n?.seo_title || job.slug}
                </h2>
                {i18n?.technical_title && (
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    {i18n.technical_title}
                  </p>
                )}
                {i18n?.description && (
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {i18n.description}
                  </p>
                )}
                <span className="mt-4 text-sm text-blue-600 font-medium group-hover:underline">
                  Voir le leaderboard →
                </span>
              </Link>
            )
          })}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Aucun métier trouvé.</p>
          </div>
        )}

        {/* Explanation Section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
            Comment fonctionne le scoring ?
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <p className="text-slate-600">
              Chaque métier a des <strong>critères techniques</strong> spécifiques.
              Par exemple, un manutentionnaire nécessite une charge utile élevée,
              tandis qu&apos;un assistant médical requiert une bonne reconnaissance
              vocale.
            </p>
            <p className="text-slate-600">
              Les robots sont évalués sur leurs <strong>spécifications techniques</strong>{' '}
              par rapport à ces critères. Le score final (0-100) reflète la
              capacité technique du robot à effectuer le métier.
            </p>
            <p className="text-slate-600">
              L&apos;<strong>indice de maturité</strong> (prototype/pilote/production)
              complète ce score technique en indiquant si le robot est réellement
              déployé sur le terrain.
            </p>
          </div>
        </section>
      </main>

      <Footer className="mt-12" />
    </div>
  )
}
