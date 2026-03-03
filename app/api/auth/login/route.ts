import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { loginSchema } from '@/lib/validators/auth';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/security/cookies';

export async function POST(req: NextRequest) {
  try {
    if (!requireCsrf(req.headers)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials format' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = await signAccessToken(user.id, user.role);
    const refreshToken = await signRefreshToken(user.id, user.role);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({ message: 'Logged in' });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
