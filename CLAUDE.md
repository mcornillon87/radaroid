# Radaroid — Instructions pour Claude

> "Le DXOMARK des Robots" — Plateforme de comparaison technique de robots humanoïdes

## Stack Technique

- **Framework:** Next.js 14+ (App Router uniquement)
- **Database:** Supabase (Postgres) — pas de Prisma
- **Styling:** TailwindCSS + Shadcn/UI
- **Validation:** Zod
- **Deploy:** Vercel

## Commandes Utiles

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run lint     # Linter
```

## Architecture Clé

```
src/
├── app/                 # Pages Next.js App Router
├── components/          # Composants React
├── lib/
│   ├── supabase/       # Clients Supabase (browser + server)
│   ├── scoring/        # Moteur de calcul des scores
│   ├── validators/     # Schemas Zod (robot-specs, scoring-criteria, email)
│   ├── rate-limit.ts   # Rate limiter + honeypot
│   └── seo/            # Générateurs JSON-LD
└── types/              # Types TypeScript
```

## Règles Critiques

### 1. Score Dual (JAMAIS fusionner)
- **Score Technique (0-100):** Basé sur specs vs critères JSON
- **Indice de Maturité:** Badge (prototype/pilot/production)
- Toujours les afficher SÉPARÉMENT

### 2. Scoring Engine
```typescript
// CORRECT: Diviser par totalWeight
const finalScore = Math.round(totalWeightedScore / totalWeight)

// FAUX: Ne jamais diviser par 100 hardcodé!
```

### 3. Soft Delete
```typescript
// JAMAIS de DELETE SQL
await supabase.from('robots').update({ deleted_at: new Date().toISOString() })

// Utiliser les views active_*
await supabase.from('active_robots').select('*')
```

### 4. Validation Obligatoire
```typescript
import { validateRobotSpecs } from '@/lib/validators/robot-specs'
import { validateEmail } from '@/lib/validators/email'

// Toujours valider avant insertion DB
```

### 5. Rate Limiting (Formulaires publics)
```typescript
import { rateLimit, isHoneypotFilled, getClientIP } from '@/lib/rate-limit'

// 1. Vérifier honeypot
// 2. Vérifier rate limit (5 req/min/IP)
// 3. Valider email (bloquer domaines jetables)
```

### 6. i18n
Toujours JOIN sur les tables `_i18n`:
```typescript
.select(`*, i18n:robots_i18n!inner(*)`).eq('i18n.locale', locale)
```

### 7. Mobile First
- Barres horizontales sur mobile (< 768px)
- Radar Chart uniquement sur desktop

## Anti-Patterns (NE PAS FAIRE)

- ❌ Auth publique
- ❌ Forum/commentaires
- ❌ Stripe/paiements
- ❌ Score unique fusionné
- ❌ Pages Router (`pages/`)
- ❌ Prisma ORM
- ❌ DELETE SQL (utiliser soft delete)
- ❌ Division par 100 dans scoring

## Documentation

### Dossier `developpeur doc/`
- `Radaroid-Architecture-V3.5.md` — Architecture complète + SQL + stratégie
- `Radaroid-Design-System-v1.2-Addendum.md` — Guidelines UX/UI et Design System

### Racine
- `.cursorrules` — Règles détaillées pour Cursor/Claude

## Langue

- Code et commits en anglais
- Communication avec l'utilisateur en français
