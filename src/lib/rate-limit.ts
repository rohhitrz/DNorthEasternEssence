/**
 * Simple in-memory rate limiter for development.
 * For production, use Upstash Redis (@upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60_000);

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export const RATE_LIMITS = {
  checkout: { maxRequests: 10, windowSeconds: 60 } as RateLimitConfig,
  webhooks: { maxRequests: 100, windowSeconds: 60 } as RateLimitConfig,
  reviews: { maxRequests: 5, windowSeconds: 60 } as RateLimitConfig,
  general: { maxRequests: 60, windowSeconds: 60 } as RateLimitConfig,
};

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const existing = rateLimitMap.get(key);

  if (!existing || existing.resetAt < now) {
    // Create new window
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    };
    rateLimitMap.set(key, entry);
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count++;
  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}
