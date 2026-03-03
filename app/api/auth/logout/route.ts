import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { clearAuthCookies } from '@/lib/security/cookies';

export async function POST() {
  const session = await getSession();
  if (session?.sub) {
    await prisma.user.update({ where: { id: session.sub }, data: { refreshTokenHash: null } });
  }
  await clearAuthCookies();
  return NextResponse.json({ message: 'Logged out' });
}
