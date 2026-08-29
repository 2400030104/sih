const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to check express-validator validation result
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return ApiResponse.error(
      res,
      'Validation failed for one or more fields',
      'VALIDATION_ERROR',
      422,
      formattedErrors
    );
  }
  next();
}

module.exports = validate;
