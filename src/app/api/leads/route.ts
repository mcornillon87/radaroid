import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { intentLeadSchema } from '@/lib/validators/leads'
import { rateLimit, getClientIP, isHoneypotFilledFromObject } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request.headers)

    // Check rate limit (5 requests per minute)
    const rateLimitResult = rateLimit(`leads:${clientIP}`, 5, 60000)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans une minute.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetInMs || 60000) / 1000)),
          },
        }
      )
    }

    // Parse request body
    const body = await request.json()

    // Check honeypot
    if (isHoneypotFilledFromObject(body)) {
      // Silently accept but don't process (bot detection)
      return NextResponse.json({ success: true })
    }

    // Validate input
    const parseResult = intentLeadSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const data = parseResult.data

    // Insert into database
    const supabase = await createClient()
    const { error } = await supabase.from('intent_leads').insert({
      robot_id: data.robot_id,
      user_email: data.user_email,
      user_industry: data.user_industry || null,
      fleet_size_interest: data.fleet_size_interest || null,
    })

    if (error) {
      console.error('Error inserting intent lead:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in leads API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
