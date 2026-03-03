import { jwtVerify, SignJWT } from 'jose';
import { getJwtEnv } from '@/lib/security/env';

export type TokenPayload = { sub: string; role: 'admin'; type: 'access' | 'refresh' };

function jwtConfig() {
  const env = getJwtEnv();
  return {
    accessKey: new TextEncoder().encode(env.accessSecret),
    refreshKey: new TextEncoder().encode(env.refreshSecret),
    issuer: env.issuer,
    audience: env.audience
  };
}

export async function signAccessToken(userId: string, role: 'admin') {
  const { accessKey, issuer, audience } = jwtConfig();
  return new SignJWT({ role, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(accessKey);
}

export async function signRefreshToken(userId: string, role: 'admin') {
  const { refreshKey, issuer, audience } = jwtConfig();
  return new SignJWT({ role, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshKey);
}

export async function verifyAccessToken(token: string) {
  const { accessKey, issuer, audience } = jwtConfig();
  const { payload } = await jwtVerify(token, accessKey, { issuer, audience });
  return payload as unknown as TokenPayload;
}

export async function verifyRefreshToken(token: string) {
  const { refreshKey, issuer, audience } = jwtConfig();
  const { payload } = await jwtVerify(token, refreshKey, { issuer, audience });
  return payload as unknown as TokenPayload;
}
