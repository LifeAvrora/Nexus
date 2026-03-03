import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { clearAuthCookies } from '@/lib/security/cookies';
import { requireCsrf } from '@/lib/security/csrf';

export async function POST(req: Request) {
  if (!requireCsrf(req.headers)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  const session = await getSession();
  if (session?.sub) {
    await prisma.user.update({ where: { id: session.sub }, data: { refreshTokenHash: null } });
  }
  await clearAuthCookies();
  return NextResponse.json({ message: 'Logged out' });
}
