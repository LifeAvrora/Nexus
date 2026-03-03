import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { registerSchema } from '@/lib/validators/auth';
import { hashPassword } from '@/lib/security/password';
import { requireCsrf } from '@/lib/security/csrf';

export async function POST(req: Request) {
  try {
    if (!requireCsrf(req.headers)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashed = await hashPassword(parsed.data.password);
    await prisma.user.create({
      data: { email: parsed.data.email, password: hashed, role: 'admin' }
    });

    return NextResponse.json({ message: 'Account created' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
