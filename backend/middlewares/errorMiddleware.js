// Catches unmatched routes and forwards a 404 to the error handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Single place that formats every error response consistently.
// Any controller can just `next(err)` or throw inside asyncHandler
// and it lands here.
const errorHandler = (err, req, res, next) => {
  // If a controller set a status before throwing, respect it.
  // Otherwise default to 500.
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    // Stack trace only in development — never leak internals in production
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
