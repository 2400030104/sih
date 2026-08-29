const ApiResponse = require('../utils/apiResponse');

/**
 * 404 Route Not Found Middleware
 */
function notFoundMiddleware(req, res, next) {
  return ApiResponse.error(
    res,
    `Resource not found: ${req.method} ${req.originalUrl}`,
    'ROUTE_NOT_FOUND',
    404
  );
}

module.exports = notFoundMiddleware;
