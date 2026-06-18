import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { securityConfig, serverConfig } from '../config/index.js';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: serverConfig.env === 'production',
  crossOriginEmbedderPolicy: serverConfig.env === 'production',
});

export const corsMiddleware = cors({
  origin: securityConfig.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86_400,
});

export const globalRateLimit = rateLimit({
  windowMs: securityConfig.rateLimitWindowMs,
  max:      securityConfig.rateLimitMax,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: 'Too many requests, please try again later' },
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: 'Too many authentication attempts, please try again in 15 minutes' },
});
