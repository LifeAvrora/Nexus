import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/security/csrf';

export async function GET() {
  const token = generateCsrfToken();
  const response = NextResponse.json({ csrfToken: token });
  response.cookies.set('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 30
  });
  return response;
}
