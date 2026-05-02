import { env } from '../config/env.js';

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 422 : 500);

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate value already exists',
      fields: Object.keys(err.keyValue || {})
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    details: err.details || null,
    stack: env.nodeEnv === 'production' ? undefined : err.stack
  });
};
