function requireEnv(name: string, minLen = 1) {
  const value = process.env[name];
  if (!value || value.length < minLen) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getJwtEnv() {
  return {
    accessSecret: requireEnv('JWT_ACCESS_SECRET', 32),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET', 32),
    issuer: requireEnv('JWT_ISSUER'),
    audience: requireEnv('JWT_AUDIENCE')
  };
}

export function getCsrfSecret() {
  return requireEnv('CSRF_SECRET', 32);
}
