const ApiResponse = require('../utils/apiResponse');

/**
 * Centralized Error Handling Middleware
 */
function errorMiddleware(err, req, res, next) {
  // Log internal error trace (safely without passwords/tokens)
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);
  }

  // Handle MySQL errors
  if (err.code) {
    if (err.code === 'ER_DUP_ENTRY') {
      return ApiResponse.error(
        res,
        'Duplicate entry violates unique constraint',
        'DUPLICATE_ENTRY',
        409,
        err.sqlMessage || err.message
      );
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return ApiResponse.error(
        res,
        'Foreign key reference constraint failed',
        'FOREIGN_KEY_VIOLATION',
        400,
        err.sqlMessage || err.message
      );
    }
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      return ApiResponse.error(
        res,
        'Cannot delete or update row because it is referenced by other records',
        'REFERENTIAL_INTEGRITY_VIOLATION',
        409,
        err.sqlMessage || err.message
      );
    }
    if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
      return ApiResponse.error(
        res,
        'Data check constraint violation (e.g. progress must be 0-100 or non-negative cost)',
        'CHECK_CONSTRAINT_VIOLATED',
        422,
        err.sqlMessage || err.message
      );
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      return ApiResponse.error(
        res,
        'Database service is currently unreachable',
        'DATABASE_UNAVAILABLE',
        503
      );
    }
  }

  // Custom status code or default 500
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected internal server error occurred';

  return ApiResponse.error(res, message, errorCode, statusCode, err.details || null);
}

module.exports = errorMiddleware;
