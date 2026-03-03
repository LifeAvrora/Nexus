import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@nexus.local';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const password = await bcrypt.hash('AdminPass123!@#', 12);
    const user = await prisma.user.create({
      data: { email, password, role: Role.admin }
    });

    await prisma.log.createMany({
      data: [
        { service: 'auth-service', message: 'User login successful', ip: '192.168.1.10', userId: user.id },
        { service: 'api-service', message: 'Database connection failed due to timeout', ip: '202.83.17.44', userId: user.id },
        { service: 'monitoring', message: 'CPU temperature threshold warning', ip: '192.168.11.10' }
      ]
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
