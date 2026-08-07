// Wraps an async controller so any thrown error / rejected promise
// is automatically passed to next(err) instead of crashing the process
// or needing try/catch in every single controller function.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
