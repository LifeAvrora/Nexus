import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getCsrfSecret } from './env';

export function generateCsrfToken() {
  const secret = getCsrfSecret();
  const raw = crypto.randomBytes(32).toString('hex');
  const sig = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  return `${raw}.${sig}`;
}

export function validateCsrfToken(token: string) {
  const secret = getCsrfSecret();
  const [raw, sig] = token.split('.');
  if (!raw || !sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function requireCsrf(headers: Headers) {
  const csrfHeader = headers.get('x-csrf-token') || '';
  const cookieToken = cookies().get('csrf_token')?.value || '';
  return csrfHeader && cookieToken && csrfHeader === cookieToken && validateCsrfToken(csrfHeader);
}
