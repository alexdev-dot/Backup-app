import { serverConfig } from '../config/index.js';

const POSTGRES_ERRORS = {
  '23505': { status: 409, message: 'A record with that value already exists' },
  '23503': { status: 400, message: 'Referenced record does not exist' },
  '23502': { status: 400, message: 'Required field is missing' },
  '22P02': { status: 400, message: 'Invalid input format' },
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const isDev = serverConfig.env === 'development';

  if (isDev) {
    console.error('[Error]', err);
  }

  if (err.code && POSTGRES_ERRORS[err.code]) {
    const { status, message } = POSTGRES_ERRORS[err.code];
    return res.status(status).json({ success: false, error: message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body' });
  }

  const status  = err.status || err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  res.status(status).json({
    success: false,
    error:   message,
    ...(isDev && { stack: err.stack }),
  });
};

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.isOperational = true;
  }
}
