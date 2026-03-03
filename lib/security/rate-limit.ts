const attempts = new Map<string, { count: number; expiresAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);

  if (!current || current.expiresAt < now) {
    attempts.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (current.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  attempts.set(ip, current);
  return { allowed: true, remaining: LIMIT - current.count };
}
