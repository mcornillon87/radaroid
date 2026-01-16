import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jobAlertSchema } from '@/lib/validators/leads'
import { rateLimit, getClientIP, isHoneypotFilledFromObject } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request.headers)

    // Check rate limit (5 requests per minute)
    const rateLimitResult = rateLimit(`alerts:${clientIP}`, 5, 60000)
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
    const parseResult = jobAlertSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const data = parseResult.data

    // Check if alert already exists (unique constraint on email + job_id)
    const supabase = await createClient()
    const { data: existing } = await supabase
      .from('job_alerts')
      .select('id')
      .eq('email', data.email)
      .eq('job_id', data.job_id)
      .single()

    if (existing) {
      // Update threshold if already exists
      const { error } = await supabase
        .from('job_alerts')
        .update({ threshold_score: data.threshold_score })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating job alert:', error)
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, updated: true })
    }

    // Insert new alert
    const { error } = await supabase.from('job_alerts').insert({
      job_id: data.job_id,
      email: data.email,
      threshold_score: data.threshold_score,
    })

    if (error) {
      console.error('Error inserting job alert:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in alerts API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
