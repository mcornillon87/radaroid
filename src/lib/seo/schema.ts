/**
 * JSON-LD Schema.org utilities for Radaroid
 * Used for LLM SEO and rich snippets
 */

export interface RobotData {
  name: string
  slug: string
  brand?: {
    name: string
    logo_url?: string
    website?: string
  }
  description?: string
  image_url?: string
  price_estimate?: string
  status: 'prototype' | 'pilot' | 'production'
}

export interface JobData {
  slug: string
  title: string
  description?: string
}

export interface ScoreData {
  score_tech: number
  job: JobData
}

/**
 * Generate Product schema for a robot page
 */
export function generateRobotSchema(robot: RobotData, scores?: ScoreData[]) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: robot.name,
    description: robot.description,
    image: robot.image_url,
    brand: robot.brand ? {
      '@type': 'Organization',
      name: robot.brand.name,
      logo: robot.brand.logo_url,
      url: robot.brand.website
    } : undefined,
    url: `https://radaroid.com/robots/${robot.slug}`,
  }

  // Add aggregate rating if we have scores
  if (scores && scores.length > 0) {
    const avgScore = Math.round(
      scores.reduce((sum, s) => sum + s.score_tech, 0) / scores.length
    )
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgScore,
      bestRating: 100,
      worstRating: 0,
      ratingCount: scores.length
    }
  }

  return schema
}

/**
 * Generate ItemList schema for job leaderboard page
 */
export function generateJobLeaderboardSchema(
  job: JobData,
  robots: Array<{ robot: RobotData; score: number; rank: number }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Robots for ${job.title}`,
    description: job.description,
    url: `https://radaroid.com/jobs/${job.slug}`,
    numberOfItems: robots.length,
    itemListElement: robots.map((item) => ({
      '@type': 'ListItem',
      position: item.rank,
      name: item.robot.name,
      url: `https://radaroid.com/robots/${item.robot.slug}`,
      item: {
        '@type': 'Product',
        name: item.robot.name,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: item.score,
          bestRating: 100,
          worstRating: 0
        }
      }
    }))
  }
}

/**
 * Generate DefinedTerm schema for glossary entries
 */
export function generateGlossarySchema(term: {
  slug: string
  term: string
  definition: string
  category?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition,
    url: `https://radaroid.com/glossary/${term.slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Radaroid Robotics Glossary',
      url: 'https://radaroid.com/glossary'
    }
  }
}

/**
 * Generate Organization schema for Radaroid
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Radaroid',
    url: 'https://radaroid.com',
    logo: 'https://radaroid.com/logo.png',
    description: 'Le DXOMARK des Robots — Plateforme de comparaison technique de robots humanoïdes',
    sameAs: [
      'https://twitter.com/radaroid',
      'https://youtube.com/@radaroid',
      'https://linkedin.com/company/radaroid'
    ]
  }
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Radaroid',
    url: 'https://radaroid.com',
    description: 'Plateforme de comparaison technique de robots humanoïdes',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://radaroid.com/robots?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}
