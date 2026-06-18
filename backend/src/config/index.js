const required = (key, fallbackDev = null) => {
  const val = process.env[key];
  if (!val) {
    if (fallbackDev !== null && process.env.NODE_ENV !== 'production') return fallbackDev;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
};

export const serverConfig = {
  env:  process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
};

export const jwtConfig = {
  secret:    required('JWT_SECRET', 'dev_secret_change_in_production_min_64_chars'),
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

export const securityConfig = {
  bcryptRounds:      parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax:      parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  corsOrigin:        process.env.CORS_ORIGIN || '*',
};
