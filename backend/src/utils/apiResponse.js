/**
 * Standardized API Response Formatter
 */
class ApiResponse {
  static success(res, message = 'Success', data = null, pagination = null, statusCode = 200) {
    const response = {
      success: true,
      message,
      data
    };

    if (pagination) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  static error(res, message = 'An error occurred', error = 'SERVER_ERROR', statusCode = 500, details = null) {
    const response = {
      success: false,
      message,
      error
    };

    if (details) {
      response.details = details;
    }

    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
