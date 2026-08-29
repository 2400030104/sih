const { body, param } = require('express-validator');

const validateMilestoneId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),
  param('milestoneId')
    .isInt({ min: 1 })
    .withMessage('Milestone ID must be a positive integer')
];

const validateCreateMilestone = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),
  
  body('milestone_code')
    .trim()
    .notEmpty()
    .withMessage('milestone_code is required')
    .isLength({ max: 50 })
    .withMessage('milestone_code must not exceed 50 characters'),
  
  body('milestone_name')
    .trim()
    .notEmpty()
    .withMessage('milestone_name is required')
    .isLength({ max: 255 })
    .withMessage('milestone_name must not exceed 255 characters'),
  
  body('planned_date')
    .isISO8601()
    .withMessage('planned_date must be a valid date (YYYY-MM-DD)'),
  
  body('revised_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('revised_date must be a valid date (YYYY-MM-DD)'),
  
  body('actual_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('actual_date must be a valid date (YYYY-MM-DD)'),
  
  body('status')
    .optional()
    .isIn(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'])
    .withMessage('Invalid milestone status'),
  
  body('delay_days')
    .optional({ nullable: true })
    .isInt()
    .withMessage('delay_days must be an integer'),
  
  body('criticality')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Invalid criticality')
];

const validateUpdateMilestone = [
  ...validateMilestoneId,
  body('milestone_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('milestone_name cannot be empty'),
  
  body('status')
    .optional()
    .isIn(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'])
    .withMessage('Invalid milestone status'),
  
  body('criticality')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Invalid criticality')
];

module.exports = {
  validateMilestoneId,
  validateCreateMilestone,
  validateUpdateMilestone
};
