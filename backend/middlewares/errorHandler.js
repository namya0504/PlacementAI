export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Central Error Handler:', err.stack || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Only expose stack traces when explicitly in development mode.
  // If NODE_ENV is unset or any other value, default to production-safe behaviour.
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: isDevelopment ? err.stack : undefined
  });
};
