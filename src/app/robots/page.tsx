import Link from 'next/link'
import { Metadata } from 'next'
import { getRobots } from '@/lib/queries/robots'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MaturityBadge, MaturityStatus } from '@/components/scores'

export const metadata: Metadata = {
  title: 'Robots Humanoïdes | Radaroid',
  description:
    'Découvrez et comparez tous les robots humanoïdes : Tesla Optimus, Figure, Unitree, Boston Dynamics et plus. Spécifications techniques et scores par métier.',
}

export const revalidate = 3600 // ISR: 1 heure

export default async function RobotsPage() {
  const robots = await getRobots('fr')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Robots Humanoïdes
          </h1>
          <p className="text-lg text-slate-600">
            {robots.length} robots analysés avec leurs spécifications techniques
            et scores par métier.
          </p>
        </div>

        {/* Robots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {robots.map((robot) => {
            const i18n = robot.i18n[0]

            return (
              <Link
                key={robot.id}
                href={`/robots/${robot.slug}`}
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                {/* Robot Image Placeholder */}
                <div className="aspect-square bg-slate-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl text-slate-300 group-hover:scale-110 transition-transform">
                    🤖
                  </span>
                </div>

                {/* Robot Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition">
                      {robot.name}
                    </h2>
                    <MaturityBadge
                      status={(robot.status as MaturityStatus) || 'prototype'}
                      size="sm"
                      showIcon={false}
                    />
                  </div>

                  {robot.brand && (
                    <p className="text-sm text-slate-500">{robot.brand.name}</p>
                  )}

                  {i18n?.tagline && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {i18n.tagline}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {robots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Aucun robot trouvé.</p>
          </div>
        )}
      </main>

      <Footer className="mt-12" />
    </div>
  )
}
