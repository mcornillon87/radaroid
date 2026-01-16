# Plan d'Implémentation Radaroid

> Version 1.0 — Basé sur Architecture V3.3
> Stack : Next.js 14 (App Router) + Supabase + TailwindCSS + Shadcn/UI

---

## Phase 1 : Foundation (Semaine 1)

### 1.1 Setup Projet

**Commandes :**

```bash
# Créer le projet Next.js
npx create-next-app@latest radaroid --typescript --tailwind --app --eslint
cd radaroid

# Initialiser Shadcn/UI
npx shadcn@latest init

# Installer les dépendances
npm install @supabase/supabase-js recharts plaiceholder sharp
npm install -D @types/node supabase
```

**Structure initiale :**

```
radaroid/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── types/
├── components/
└── public/
```

**Fichiers à créer :**

`lib/supabase/client.ts` — Client Supabase côté browser :
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`lib/supabase/server.ts` — Client Supabase côté server :
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

`.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### 1.2 Database Schema

Exécuter dans **Supabase SQL Editor** le schema complet de l'architecture V3.3 (Section 4).

**Ordre d'exécution :**
1. `brands` (aucune dépendance)
2. `glossary_terms` + `glossary_terms_i18n`
3. `robots` + `robots_i18n` + `robot_media`
4. `jobs` + `jobs_i18n`
5. `robot_job_scores`
6. `deployments`
7. Tables Growth : `intent_leads`, `job_alerts`, `page_claims`, `error_reports`
8. Index de performance

### 1.3 LLM SEO Foundation

**Fichier `/public/llms.txt` :**
```
# Radaroid — Robot Intelligence Platform

## About
Radaroid is the DXOMARK of humanoid robots. We provide standardized technical evaluations
and job-fit scores for commercial robots.

## Key Pages
- /robots — Complete robot catalog with technical specs
- /jobs — Job-based robot rankings (waiter, warehouse picker, etc.)
- /glossary — Technical terms dictionary (SLAM, LiDAR, DoF, etc.)
- /tracker — Real-world deployment database (OSINT verified)

## Scoring System
- Technical Potential (0-100): Algorithm-based on specs vs job criteria
- Maturity Index: Based on verified field deployments

## Data Structure
Each robot has:
- Technical specifications (payload, speed, battery, sensors)
- Job-fit scores for 12 different professions
- Maturity status (prototype/pilot/production)
- Verified deployment count

## Contact
For data corrections or manufacturer claims: contact@radaroid.com
```

**Fichier `/public/robots.txt` :**
```
User-agent: *
Allow: /

# AI Crawlers Welcome
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://radaroid.com/sitemap.xml
```

---

## Phase 2 : Data Entry (Semaine 2)

### 2.1 Scripts de Seed

Créer `scripts/seed.ts` :

```typescript
// scripts/seed.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Jobs avec scoring_criteria
const jobs = [
  {
    slug: 'waiter',
    scoring_criteria: {
      criteria: {
        stability_index: { weight: 30, type: 'numeric', thresholds: { min: 1, ideal: 3 } },
        interaction_tech_level: { weight: 25, type: 'enum_score', options: { none: 0, basic_voice: 30, screen_face: 60, llm_integrated: 100 } },
        obstacle_avoidance: { weight: 25, type: 'enum_score', options: { static_only: 0, stop_and_wait: 50, dynamic_rerouting: 100 } },
        payload_tray: { weight: 20, type: 'numeric', thresholds: { min: 2, ideal: 10 } }
      }
    }
  },
  // ... 11 autres jobs
]

async function seed() {
  // Insert jobs
  for (const job of jobs) {
    await supabase.from('jobs').upsert(job)
  }
  // ... brands, robots, i18n
}

seed()
```

**Commande d'exécution :**
```bash
npx tsx scripts/seed.ts
```

### 2.2 Types TypeScript

```bash
# Générer les types depuis Supabase
npx supabase gen types typescript --project-id <project-id> > types/database.ts
```

`types/scoring.ts` :
```typescript
export interface Criterion {
  weight: number
  type: 'numeric' | 'boolean' | 'enum_score'
  thresholds?: { min: number; ideal: number }
  required?: boolean
  options?: Record<string, number>
  unit?: string
  label?: string
  description?: string
}

export interface ScoringCriteria {
  criteria: Record<string, Criterion>
}

export interface ScoreResult {
  score: number
  breakdown: Record<string, number>
}
```

---

## Phase 3 : Scoring Engine (Semaine 3)

### 3.1 Implementation

`lib/scoring/engine.ts` — Code fourni dans l'architecture V3.3 (Section 5.1).

### 3.2 Tests

```bash
npm install -D jest @types/jest ts-jest
npx jest --init
```

`__tests__/scoring.test.ts` :
```typescript
import { calculateScore } from '@/lib/scoring/engine'

describe('Scoring Engine', () => {
  it('calculates numeric criteria correctly', () => {
    const specs = { payload_capacity: 20 }
    const criteria = {
      payload_capacity: {
        weight: 100,
        type: 'numeric' as const,
        thresholds: { min: 10, ideal: 30 }
      }
    }
    const result = calculateScore(specs, criteria)
    expect(result.score).toBe(50) // (20-10)/(30-10) * 100 = 50
  })

  it('calculates enum_score criteria correctly', () => {
    const specs = { interaction_tech_level: 'llm_integrated' }
    const criteria = {
      interaction_tech_level: {
        weight: 100,
        type: 'enum_score' as const,
        options: { none: 0, basic_voice: 30, llm_integrated: 100 }
      }
    }
    const result = calculateScore(specs, criteria)
    expect(result.score).toBe(100)
  })
})
```

### 3.3 Batch Recalculation

`lib/scoring/recalculate.ts` :
```typescript
export async function recalculateAllScores(supabase: SupabaseClient) {
  const { data: robots } = await supabase.from('robots').select('id, specs')
  const { data: jobs } = await supabase.from('jobs').select('id, scoring_criteria')

  for (const robot of robots ?? []) {
    for (const job of jobs ?? []) {
      const result = calculateScore(robot.specs, job.scoring_criteria.criteria)
      await supabase.from('robot_job_scores').upsert({
        robot_id: robot.id,
        job_id: job.id,
        score_tech: result.score,
        score_breakdown: result.breakdown,
        last_calculated_at: new Date().toISOString()
      })
    }
  }
}
```

---

## Phase 4 : Frontend (Semaine 4)

### 4.1 Structure des Pages

| Route | Type | ISR | Description |
|-------|------|-----|-------------|
| `/` | Server | 1h | Homepage |
| `/robots` | Server | 1h | Listing filtrable |
| `/robots/[slug]` | Server | 24h | Fiche robot |
| `/jobs` | Server | 1h | Grille métiers |
| `/jobs/[job_slug]` | Server | 1h | Leaderboard |
| `/glossary` | Server | 24h | Index A-Z |
| `/glossary/[slug]` | Server | 24h | Définition |
| `/tracker` | Server | 1h | Deployments |
| `/compare/[...slugs]` | Server | - | Comparateur |

### 4.2 Exemple : Page Robot

`app/robots/[slug]/page.tsx` :
```typescript
import { createClient } from '@/lib/supabase/server'
import { CapabilitiesChart } from '@/components/scores/capabilities-chart'
import { MaturityBadge } from '@/components/scores/maturity-badge'
import { JsonLd } from '@/components/seo/json-ld'

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase.from('robots').select('slug')
  return data?.map(r => ({ slug: r.slug })) ?? []
}

export default async function RobotPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: robot } = await supabase
    .from('robots')
    .select(`
      *,
      brand:brands(*),
      i18n:robots_i18n(*),
      scores:robot_job_scores(*, job:jobs(*, i18n:jobs_i18n(*)))
    `)
    .eq('slug', params.slug)
    .single()

  const { count: deploymentsCount } = await supabase
    .from('deployments')
    .select('*', { count: 'exact', head: true })
    .eq('robot_id', robot.id)

  return (
    <>
      <JsonLd type="Product" data={robot} />
      <main>
        <h1>{robot.name}</h1>
        <MaturityBadge
          deploymentsCount={deploymentsCount ?? 0}
          status={robot.status}
        />
        <CapabilitiesChart scores={robot.scores} />
      </main>
    </>
  )
}
```

### 4.3 JSON-LD Schema

`lib/seo/schema.ts` :
```typescript
export function generateProductSchema(robot: Robot) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: robot.name,
    brand: {
      '@type': 'Organization',
      name: robot.brand?.name
    },
    description: robot.i18n?.[0]?.description,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: robot.scores?.[0]?.score_tech ?? 0,
        bestRating: 100
      }
    }
  }
}
```

---

## Phase 5 : Growth (Semaine 5)

### 5.1 Lead Gen Modals

`components/modals/interest-modal.tsx` — Modale simple avec :
- Champ email (validation)
- Select industrie
- Select fleet size
- Server Action → `intent_leads`

### 5.2 Deployment Tracker

`app/tracker/page.tsx` :
- Table avec filtres (robot, job, status)
- Badge vérifié/non vérifié
- Formulaire soumission (crowdsource)

### 5.3 Badge Embedable

`app/embed/[robot]/badge/[job]/route.tsx` :
```typescript
import { ImageResponse } from 'next/og'

export async function GET(
  request: Request,
  { params }: { params: { robot: string; job: string } }
) {
  // Fetch score
  // Generate SVG badge
  return new ImageResponse(
    <div style={{ /* badge styles */ }}>
      ✓ CERTIFIED BY RADAROID
      {robot.name} - {job.title}: {score}/100
    </div>,
    { width: 300, height: 100 }
  )
}
```

---

## Phase 6 : Launch (Semaine 6)

### 6.1 SEO Finalization

`app/sitemap.ts` :
```typescript
export default async function sitemap() {
  const supabase = await createClient()
  const { data: robots } = await supabase.from('robots').select('slug, updated_at')
  const { data: jobs } = await supabase.from('jobs').select('slug')

  return [
    { url: 'https://radaroid.com', changeFrequency: 'daily' },
    ...robots.map(r => ({
      url: `https://radaroid.com/robots/${r.slug}`,
      lastModified: r.updated_at
    })),
    ...jobs.map(j => ({
      url: `https://radaroid.com/jobs/${j.slug}`
    }))
  ]
}
```

### 6.2 Deploy

```bash
# Installer Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

**Configuration DNS :**
1. Ajouter domaine dans Vercel Dashboard
2. Configurer CNAME ou A records chez le registrar

---

## Checklist Pre-Launch

- [ ] Lighthouse > 90 sur toutes métriques
- [ ] JSON-LD valide (Google Rich Results Test)
- [ ] llms.txt accessible
- [ ] robots.txt autorise bots IA
- [ ] sitemap.xml généré
- [ ] Mobile responsive testé
- [ ] Fallback barres horizontales < 768px
- [ ] Modales lead gen fonctionnelles
- [ ] Error reports fonctionnel
- [ ] 404 page personnalisée

---

*Document de référence — Radaroid Implementation Plan v1.0*
