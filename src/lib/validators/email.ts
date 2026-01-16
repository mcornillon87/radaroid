/**
 * Email validation utilities
 * Includes format validation and disposable domain detection
 */

// Common disposable email domains (extend as needed)
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  '10minutemail.com',
  'fakeinbox.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'getnada.com',
  'maildrop.cc',
  'tempail.com',
  'disposable.com',
  'throwawaymail.com',
  'mailnesia.com',
  'mohmal.com',
  'emailondeck.com',
  'mintemail.com',
  'mytemp.email',
]

export interface EmailValidationResult {
  valid: boolean
  error?: string
  normalized?: string
}

/**
 * Validate email address
 * @param email - Email address to validate
 * @returns Validation result with normalized email or error
 */
export function validateEmail(email: string): EmailValidationResult {
  // Trim and lowercase
  const normalized = email.trim().toLowerCase()

  // Basic format check (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalized)) {
    return { valid: false, error: 'Format email invalide' }
  }

  // Check minimum length for local part
  const [localPart, domain] = normalized.split('@')
  if (localPart.length < 1 || domain.length < 3) {
    return { valid: false, error: 'Format email invalide' }
  }

  // Check for disposable domain
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Veuillez utiliser une adresse email professionnelle' }
  }

  // Check for common typos in popular domains
  const domainTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
  }

  if (domainTypos[domain]) {
    return {
      valid: false,
      error: `Vouliez-vous dire ${localPart}@${domainTypos[domain]} ?`
    }
  }

  return { valid: true, normalized }
}

/**
 * Check if email domain appears to be professional (not free email)
 * For lead quality scoring
 */
export function isProfessionalEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  const domain = normalized.split('@')[1]

  const freeEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'yahoo.fr',
    'hotmail.com',
    'hotmail.fr',
    'outlook.com',
    'outlook.fr',
    'live.com',
    'live.fr',
    'icloud.com',
    'me.com',
    'aol.com',
    'protonmail.com',
    'proton.me',
    'free.fr',
    'orange.fr',
    'laposte.net',
    'sfr.fr',
    'wanadoo.fr',
  ]

  return !freeEmailDomains.includes(domain)
}

/**
 * Add a domain to the disposable list (runtime only)
 * For dynamic blocking of new spam domains
 */
export function addDisposableDomain(domain: string): void {
  const normalized = domain.trim().toLowerCase()
  if (!DISPOSABLE_DOMAINS.includes(normalized)) {
    DISPOSABLE_DOMAINS.push(normalized)
  }
}
