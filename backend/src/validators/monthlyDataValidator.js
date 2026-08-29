const { body, param } = require('express-validator');

const validateMonthlyDataId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),
  param('monthlyDataId')
    .isInt({ min: 1 })
    .withMessage('Monthly Data ID must be a positive integer')
];

const validateCreateMonthlyData = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),
  
  body('reporting_month')
    .isISO8601()
    .withMessage('reporting_month must be a valid date (YYYY-MM-DD)'),
  
  body('expenditure')
    .isFloat({ min: 0 })
    .withMessage('expenditure must be a non-negative number'),
  
  body('cumulative_expenditure')
    .isFloat({ min: 0 })
    .withMessage('cumulative_expenditure must be a non-negative number'),
  
  body('physical_progress')
    .isFloat({ min: 0, max: 100 })
    .withMessage('physical_progress must be between 0.00 and 100.00'),
  
  body('financial_progress')
    .isFloat({ min: 0, max: 100 })
    .withMessage('financial_progress must be between 0.00 and 100.00'),
  
  body('planned_progress')
    .isFloat({ min: 0, max: 100 })
    .withMessage('planned_progress must be between 0.00 and 100.00'),
  
  body('milestones_planned')
    .optional()
    .isInt({ min: 0 })
    .withMessage('milestones_planned must be >= 0'),
  
  body('milestones_completed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('milestones_completed must be >= 0'),
  
  body('milestones_delayed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('milestones_delayed must be >= 0'),
  
  body('schedule_variance_days')
    .optional()
    .isInt()
    .withMessage('schedule_variance_days must be an integer'),
  
  body('cost_variance')
    .optional()
    .isFloat()
    .withMessage('cost_variance must be a valid number'),
  
  body('manpower_count')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('manpower_count must be >= 0')
];

const validateUpdateMonthlyData = [
  ...validateMonthlyDataId,
  body('expenditure')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('expenditure must be a non-negative number'),
  
  body('cumulative_expenditure')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('cumulative_expenditure must be a non-negative number'),
  
  body('physical_progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('physical_progress must be between 0.00 and 100.00'),
  
  body('financial_progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('financial_progress must be between 0.00 and 100.00'),
  
  body('planned_progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('planned_progress must be between 0.00 and 100.00')
];

module.exports = {
  validateMonthlyDataId,
  validateCreateMonthlyData,
  validateUpdateMonthlyData
};
