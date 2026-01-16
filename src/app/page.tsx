import Link from "next/link";
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/seo/schema";

export default function Home() {
  return (
    <>
      {/* JSON-LD for LLM SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateWebsiteSchema(),
            generateOrganizationSchema()
          ])
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-slate-900">
              Radaroid
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/robots" className="text-slate-600 hover:text-slate-900 transition">
                Robots
              </Link>
              <Link href="/jobs" className="text-slate-600 hover:text-slate-900 transition">
                Métiers
              </Link>
              <Link href="/glossary" className="text-slate-600 hover:text-slate-900 transition">
                Glossaire
              </Link>
              <Link href="/tracker" className="text-slate-600 hover:text-slate-900 transition">
                Tracker
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              Le DXOMARK des Robots
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Intelligence pour
              <span className="text-blue-600"> Robots </span>
              & Humains
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Radaroid est la plateforme de référence pour comparer les robots humanoïdes.
              Découvrez quel robot est techniquement capable d&apos;exécuter vos tâches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Explorer par Métier
              </Link>
              <Link
                href="/robots"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
              >
                Voir tous les Robots
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">20+</div>
              <div className="text-slate-600 mt-1">Robots analysés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">12</div>
              <div className="text-slate-600 mt-1">Métiers couverts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">50+</div>
              <div className="text-slate-600 mt-1">Critères techniques</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">100%</div>
              <div className="text-slate-600 mt-1">Data-driven</div>
            </div>
          </div>

          {/* Jobs Preview */}
          <div className="mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-4">
              Quel métier voulez-vous automatiser ?
            </h2>
            <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
              Notre approche &quot;Jobs-First&quot; vous permet de trouver le robot
              adapté à votre besoin métier spécifique.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {[
                { slug: "warehouse-picker", icon: "📦", label: "Manutentionnaire" },
                { slug: "waiter", icon: "🍽️", label: "Serveur" },
                { slug: "site-laborer", icon: "🧱", label: "Manœuvre BTP" },
                { slug: "security-patrol", icon: "🔒", label: "Vigile" },
                { slug: "nurse-assistant", icon: "🏥", label: "Assistant Hospitalier" },
                { slug: "receptionist", icon: "🛎️", label: "Agent d'Accueil" },
              ].map((job) => (
                <Link
                  key={job.slug}
                  href={`/jobs/${job.slug}`}
                  className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition"
                >
                  <span className="text-3xl mb-2">{job.icon}</span>
                  <span className="text-sm text-slate-700 text-center font-medium">
                    {job.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/jobs" className="text-blue-600 hover:underline font-medium">
                Voir les 12 métiers →
              </Link>
            </div>
          </div>

          {/* Scoring Explanation */}
          <div className="mt-24 bg-slate-50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
              Notre Système de Score Dual
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Potentiel Technique
                </h3>
                <p className="text-slate-600 text-sm">
                  Score 0-100 basé sur les spécifications techniques vs les critères
                  requis pour chaque métier. &quot;Sur le papier, est-il capable ?&quot;
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Indice de Maturité
                </h3>
                <p className="text-slate-600 text-sm">
                  Statut basé sur les déploiements vérifiés (OSINT).
                  &quot;Est-il fiable en production ?&quot; Prototype → Pilote → Production.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-slate-50 mt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-slate-600 text-sm">
                © 2026 Radaroid. Le DXOMARK des Robots.
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/glossary" className="text-slate-600 hover:text-slate-900">
                  Glossaire
                </Link>
                <Link href="/tracker" className="text-slate-600 hover:text-slate-900">
                  Deployment Tracker
                </Link>
                <a href="/llms.txt" className="text-slate-600 hover:text-slate-900">
                  llms.txt
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
