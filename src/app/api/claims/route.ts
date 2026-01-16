import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { pageClaimSchema } from '@/lib/validators/leads'
import { rateLimit, getClientIP, isHoneypotFilledFromObject } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request.headers)

    // Check rate limit (2 claims per minute - very strict)
    const rateLimitResult = rateLimit(`claims:${clientIP}`, 2, 60000)
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
      return NextResponse.json({ success: true })
    }

    // Validate input
    const parseResult = pageClaimSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const data = parseResult.data

    // Check if claim already exists for this robot + email
    const supabase = await createClient()
    const { data: existing } = await supabase
      .from('page_claims')
      .select('id, status')
      .eq('robot_id', data.robot_id)
      .eq('contact_email', data.contact_email)
      .single()

    if (existing) {
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'Une demande est déjà en cours pour ce robot' },
          { status: 400 }
        )
      }
      if (existing.status === 'verified') {
        return NextResponse.json(
          { error: 'Cette page est déjà revendiquée' },
          { status: 400 }
        )
      }
    }

    // Insert into database
    const { error } = await supabase.from('page_claims').insert({
      robot_id: data.robot_id,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      proof_url: data.proof_url || null,
      status: 'pending',
    })

    if (error) {
      console.error('Error inserting page claim:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in claims API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
