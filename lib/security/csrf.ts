import crypto from 'crypto';
import { cookies } from 'next/headers';
import { env } from './env';

export function generateCsrfToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  const sig = crypto.createHmac('sha256', env.CSRF_SECRET).update(raw).digest('hex');
  return `${raw}.${sig}`;
}

export function validateCsrfToken(token: string) {
  const [raw, sig] = token.split('.');
  if (!raw || !sig) return false;
  const expected = crypto.createHmac('sha256', env.CSRF_SECRET).update(raw).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function requireCsrf(headers: Headers) {
  const csrfHeader = headers.get('x-csrf-token') || '';
  const cookieToken = cookies().get('csrf_token')?.value || '';
  return csrfHeader && cookieToken && csrfHeader === cookieToken && validateCsrfToken(csrfHeader);
}
