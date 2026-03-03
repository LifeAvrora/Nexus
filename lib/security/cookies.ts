import { cookies } from 'next/headers';

const isProd = process.env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict' as const,
  path: '/'
};

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const jar = cookies();
  jar.set('access_token', accessToken, { ...cookieOptions, maxAge: 60 * 15 });
  jar.set('refresh_token', refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearAuthCookies() {
  const jar = cookies();
  jar.delete('access_token');
  jar.delete('refresh_token');
}
