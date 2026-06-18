import 'dotenv/config';
import express from 'express';
import { serverConfig } from './config/index.js';
import { testConnection } from './config/database.js';
import { helmetMiddleware, corsMiddleware, globalRateLimit } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes         from './routes/auth.js';
import userRoutes         from './routes/users.js';
import professionalRoutes from './routes/professionals.js';
import bookingRoutes      from './routes/bookings.js';
import jobRoutes          from './routes/jobs.js';
import messageRoutes      from './routes/messages.js';
import paymentRoutes      from './routes/payments.js';
import reviewRoutes       from './routes/reviews.js';
import serviceRoutes      from './routes/services.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(globalRateLimit);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (_, res) => res.json({ status: 'ok', env: serverConfig.env }));

app.use('/api/auth',          authRoutes);
app.use('/api/user',          userRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/jobs',          jobRoutes);
app.use('/api',               messageRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/services',      serviceRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await testConnection();
  app.listen(serverConfig.port, () => {
    console.log(`[Server] Running on port ${serverConfig.port} in ${serverConfig.env} mode`);
  });
};

start().catch((err) => {
  console.error('[Server] Fatal startup error:', err.message);
  process.exit(1);
});
