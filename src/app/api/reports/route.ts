import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorReportSchema } from '@/lib/validators/leads'
import { rateLimit, getClientIP, isHoneypotFilledFromObject } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request.headers)

    // Check rate limit (3 reports per minute - stricter)
    const rateLimitResult = rateLimit(`reports:${clientIP}`, 3, 60000)
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
    const parseResult = errorReportSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const data = parseResult.data

    // Insert into database
    const supabase = await createClient()
    const { error } = await supabase.from('error_reports').insert({
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      description: data.description,
      reported_by_email: data.reported_by_email || null,
      status: 'pending',
    })

    if (error) {
      console.error('Error inserting error report:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in reports API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
