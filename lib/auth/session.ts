import { cookies } from 'next/headers';
import { verifyAccessToken } from './jwt';

export async function getSession() {
  const token = cookies().get('access_token')?.value;
  if (!token) return null;
  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}
