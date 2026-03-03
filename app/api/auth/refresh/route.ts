import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/security/cookies';

export async function POST() {
  try {
    const token = cookies().get('refresh_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyRefreshToken(token);
    if (payload.type !== 'refresh') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ok = await bcrypt.compare(token, user.refreshTokenHash);
    if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const accessToken = await signAccessToken(user.id, user.role);
    const refreshToken = await signRefreshToken(user.id, user.role);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({ message: 'Refreshed' });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
