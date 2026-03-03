import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';
import { logsQuerySchema } from '@/lib/validators/log';
import { requireCsrf } from '@/lib/security/csrf';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = logsQuerySchema.safeParse({
    page: req.nextUrl.searchParams.get('page') || '1',
    pageSize: req.nextUrl.searchParams.get('pageSize') || '10',
    search: req.nextUrl.searchParams.get('search') || ''
  });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  }

  const { page, pageSize, search } = parsed.data;
  const where = search
    ? {
        OR: [
          { service: { contains: search } },
          { message: { contains: search } },
          { ip: { contains: search } }
        ]
      }
    : undefined;

  const [items, total] = await Promise.all([
    prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.log.count({ where })
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!requireCsrf(req.headers)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await prisma.log.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}
