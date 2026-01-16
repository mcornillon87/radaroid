# Radaroid — TODO List

> Basé sur Architecture V3.3 — Janvier 2026

## Semaine 1 : Foundation

- [ ] Setup Next.js 14 + TailwindCSS + Shadcn/UI
- [ ] Configurer Supabase (projet + client)
- [ ] Créer les tables SQL (12 tables + index)
- [ ] Créer /public/llms.txt
- [ ] Créer /public/robots.txt (autoriser bots IA)
- [ ] Setup lib/seo/schema.ts (utilitaires JSON-LD)
- [ ] Configurer ESLint + Prettier
- [ ] Générer types TypeScript depuis Supabase

## Semaine 2 : Data Entry

- [ ] Seed : 12 jobs avec scoring_criteria JSON
- [ ] Seed : 5-10 brands (Tesla, Figure, Unitree...)
- [ ] Seed : 20 robots avec specs JSONB
- [ ] Seed : traductions i18n (fr, en)
- [ ] Seed : 10 termes glossaire
- [ ] Script de seed automatisé

## Semaine 3 : Algorithm

- [ ] Implémenter calculateScore() dans lib/scoring/engine.ts
- [ ] Support types : numeric, boolean, enum_score
- [ ] Tests unitaires du scoring engine
- [ ] Fonction recalcul batch (tous les scores)
- [ ] Stockage résultats dans robot_job_scores

## Semaine 4 : Frontend Core

- [ ] Layout global (Header, Footer, SEO meta)
- [ ] Homepage avec moteur de recherche
- [ ] /robots - Listing avec filtres techniques
- [ ] /robots/[slug] - Fiche Robot complète
- [ ] /jobs - Grille des 12 métiers
- [ ] /jobs/[job_slug] - Landing SEO + Leaderboard
- [ ] Composant CapabilitiesChart (Radar + Fallback mobile)
- [ ] Composant MaturityBadge (Cold Start UX)
- [ ] Hook useMediaQuery
- [ ] Hook useUnitConversion (SI → Imperial)

## Semaine 5 : Growth Features

- [ ] Modale "Ce robot m'intéresse" → intent_leads
- [ ] Formulaire Job Alert → job_alerts
- [ ] Modale "Claim This Page" → page_claims
- [ ] Bouton "Signaler erreur" → error_reports
- [ ] /tracker - Deployment Tracker (OSINT)
- [ ] Badge embedable /embed/[robot]/badge/[job]

## Semaine 6 : Launch

- [ ] /glossary - Index A-Z
- [ ] /glossary/[slug] - Pages définitions
- [ ] /compare/[...slugs] - Comparateur
- [ ] Sitemap XML dynamique
- [ ] OpenGraph images dynamiques
- [ ] JSON-LD sur toutes les pages
- [ ] Lighthouse audit (>90 sur toutes métriques)
- [ ] Deploy Vercel production
- [ ] Configuration domaine radaroid.com

---

## Quick Wins (Priorité Haute)

Ces tâches peuvent être faites rapidement et apportent une valeur immédiate :

1. [ ] Setup projet + Supabase connection
2. [ ] Tables SQL core (brands, robots, jobs)
3. [ ] llms.txt + robots.txt
4. [ ] Scoring engine de base
5. [ ] Page /robots listing simple

## Tâches Complexes (Prévoir plus de temps)

1. [ ] Radar Chart responsive avec fallback
2. [ ] Système i18n complet avec JOIN
3. [ ] Badge embedable (génération SVG)
4. [ ] OpenGraph images dynamiques
5. [ ] Comparateur multi-robots

---

*Dernière mise à jour : Janvier 2026*
