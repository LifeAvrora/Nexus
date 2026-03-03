import { jwtVerify, SignJWT } from 'jose';
import { env } from '@/lib/security/env';

const accessKey = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshKey = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export type TokenPayload = { sub: string; role: 'admin'; type: 'access' | 'refresh' };

export async function signAccessToken(userId: string, role: 'admin') {
  return new SignJWT({ role, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(accessKey);
}

export async function signRefreshToken(userId: string, role: 'admin') {
  return new SignJWT({ role, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshKey);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessKey, { issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE });
  return payload as unknown as TokenPayload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, refreshKey, { issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE });
  return payload as unknown as TokenPayload;
}
