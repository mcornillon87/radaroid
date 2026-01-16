import Link from 'next/link'
import { Metadata } from 'next'
import { getDeployments, getDeploymentStats } from '@/lib/queries/deployments'
import { JOB_ICONS } from '@/lib/queries/jobs'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Deployment Tracker | Radaroid',
  description:
    'Suivez les déploiements de robots humanoïdes dans le monde. Données OSINT vérifiées sur les programmes pilotes et déploiements commerciaux.',
}

export const revalidate = 3600 // ISR: 1 heure

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  pilot: { label: 'Pilote', variant: 'secondary' },
  poc: { label: 'PoC', variant: 'outline' },
  full_deploy: { label: 'Déployé', variant: 'default' },
}

export default async function TrackerPage() {
  const [deployments, stats] = await Promise.all([
    getDeployments('fr'),
    getDeploymentStats(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Deployment Tracker
          </h1>
          <p className="text-lg text-slate-600">
            Suivez les déploiements de robots humanoïdes dans le monde.
            Données collectées via OSINT (sources publiques vérifiées).
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mb-12">
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-500">Déploiements</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <div className="text-sm text-slate-500">Vérifiés</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{stats.totalRobots}</div>
            <div className="text-sm text-slate-500">Robots déployés</div>
          </div>
        </div>

        {/* Deployments Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Entreprise
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Robot
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Métier
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                    Quantité
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                    Vérifié
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deployments.map((deployment) => {
                  const jobI18n = deployment.job?.i18n[0]
                  const jobIcon = deployment.job
                    ? JOB_ICONS[deployment.job.slug] || '💼'
                    : '—'
                  const statusConfig = STATUS_LABELS[deployment.status || ''] || {
                    label: deployment.status || '—',
                    variant: 'outline' as const,
                  }

                  return (
                    <tr key={deployment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {deployment.company_name || '—'}
                        </div>
                        {deployment.source_url && (
                          <a
                            href={deployment.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Source
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {deployment.robot ? (
                          <Link
                            href={`/robots/${deployment.robot.slug}`}
                            className="text-blue-600 hover:underline"
                          >
                            {deployment.robot.name}
                          </Link>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {deployment.job ? (
                          <Link
                            href={`/jobs/${deployment.job.slug}`}
                            className="flex items-center gap-2 text-slate-700 hover:text-blue-600"
                          >
                            <span>{jobIcon}</span>
                            <span>{jobI18n?.seo_title || deployment.job.slug}</span>
                          </Link>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-medium">
                          {deployment.robot_count || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {deployment.is_verified ? (
                          <span className="text-green-600" title="Vérifié">
                            ✅
                          </span>
                        ) : (
                          <span className="text-slate-400" title="Non vérifié">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {deployments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Aucun déploiement enregistré.</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            À propos du Tracker
          </h2>
          <div className="bg-slate-50 rounded-xl p-6 space-y-4 text-slate-600">
            <p>
              Ce tracker recense les déploiements publiquement annoncés de robots
              humanoïdes. Les données sont collectées via OSINT (Open Source
              Intelligence) à partir de :
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Communiqués de presse officiels</li>
              <li>Articles de presse tech</li>
              <li>Réseaux sociaux des entreprises</li>
              <li>Rapports sectoriels</li>
            </ul>
            <p>
              Les déploiements marqués ✅ ont été vérifiés par plusieurs sources
              indépendantes.
            </p>
          </div>
        </section>
      </main>

      <Footer className="mt-12" />
    </div>
  )
}
