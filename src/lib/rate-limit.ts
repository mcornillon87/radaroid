/**
 * In-memory rate limiter for V1
 * For production scale, consider Redis-based solution
 */

interface RateLimitRecord {
  count: number
  timestamp: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Periodic cleanup to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    rateLimitMap.forEach((value, key) => {
      if (now - value.timestamp > 60000) { // 1 minute
        rateLimitMap.delete(key)
      }
    })
  }, 60000)
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetInMs?: number
}

/**
 * Check and update rate limit for an identifier
 * @param identifier - Unique identifier (usually IP address or user ID)
 * @param limit - Maximum requests allowed in window (default: 5)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Whether the request is allowed and remaining quota
 */
export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // First request or window expired
  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now })
    return { success: true, remaining: limit - 1 }
  }

  // Window still active, check limit
  if (record.count >= limit) {
    const resetInMs = windowMs - (now - record.timestamp)
    return { success: false, remaining: 0, resetInMs }
  }

  // Increment count
  record.count++
  return { success: true, remaining: limit - record.count }
}

/**
 * Reset rate limit for an identifier (for testing or admin override)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now - record.timestamp > windowMs) {
    return { success: true, remaining: limit }
  }

  if (record.count >= limit) {
    const resetInMs = windowMs - (now - record.timestamp)
    return { success: false, remaining: 0, resetInMs }
  }

  return { success: true, remaining: limit - record.count }
}

// ════════════════════════════════════════════════════════════════════════════
// HONEYPOT DETECTION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Check if honeypot field was filled (indicates bot)
 * The form should have an invisible field named "website" that humans won't fill
 * @param formData - Form data from request
 * @returns true if honeypot was filled (likely a bot)
 */
export function isHoneypotFilled(formData: FormData): boolean {
  const honeypotValue = formData.get('website')
  return honeypotValue !== null && honeypotValue !== ''
}

/**
 * Check honeypot from a plain object (for JSON API requests)
 */
export function isHoneypotFilledFromObject(data: Record<string, unknown>): boolean {
  const honeypotValue = data['website']
  return honeypotValue !== undefined && honeypotValue !== null && honeypotValue !== ''
}

/**
 * Get client IP from request headers
 * Handles common proxy headers (Vercel, Cloudflare, etc.)
 */
export function getClientIP(headers: Headers): string {
  // Vercel
  const xForwardedFor = headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  // Cloudflare
  const cfConnectingIP = headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Real IP (nginx)
  const xRealIP = headers.get('x-real-ip')
  if (xRealIP) {
    return xRealIP
  }

  return 'unknown'
}
