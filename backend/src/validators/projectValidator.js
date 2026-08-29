const { body, param, query } = require('express-validator');

const validateProjectId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer')
];

const validateCreateProject = [
  body('project_code')
    .trim()
    .notEmpty()
    .withMessage('project_code is required')
    .isLength({ max: 100 })
    .withMessage('project_code must not exceed 100 characters'),
  
  body('project_name')
    .trim()
    .notEmpty()
    .withMessage('project_name is required')
    .isLength({ max: 255 })
    .withMessage('project_name must not exceed 255 characters'),
  
  body('ministry_id')
    .isInt({ min: 1 })
    .withMessage('ministry_id must be a valid positive integer'),
  
  body('sector_id')
    .isInt({ min: 1 })
    .withMessage('sector_id must be a valid positive integer'),
  
  body('agency_id')
    .isInt({ min: 1 })
    .withMessage('agency_id must be a valid positive integer'),
  
  body('state_id')
    .isInt({ min: 1 })
    .withMessage('state_id must be a valid positive integer'),
  
  body('district_id')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('district_id must be a positive integer'),
  
  body('original_cost')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('original_cost must be a non-negative number'),
  
  body('approved_cost')
    .isFloat({ min: 0 })
    .withMessage('approved_cost must be a non-negative number'),
  
  body('revised_cost')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('revised_cost must be a non-negative number'),
  
  body('approved_date')
    .isISO8601()
    .withMessage('approved_date must be a valid ISO8601 date (YYYY-MM-DD)'),
  
  body('planned_start_date')
    .isISO8601()
    .withMessage('planned_start_date must be a valid ISO8601 date (YYYY-MM-DD)'),
  
  body('planned_completion_date')
    .isISO8601()
    .withMessage('planned_completion_date must be a valid ISO8601 date (YYYY-MM-DD)'),
  
  body('actual_start_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('actual_start_date must be a valid ISO8601 date (YYYY-MM-DD)'),
  
  body('actual_completion_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('actual_completion_date must be a valid ISO8601 date (YYYY-MM-DD)'),
  
  body('latitude')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('latitude must be between -90 and 90'),
  
  body('longitude')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('longitude must be between -180 and 180'),
  
  body('current_status')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.toUpperCase().trim() : val))
    .isIn(['PROPOSED', 'APPROVED', 'ONGOING', 'COMPLETED', 'DELAYED', 'ON_HOLD', 'CANCELLED', 'CLOSED'])
    .withMessage('Invalid current_status'),
  
  body('project_stage')
    .optional()
    .customSanitizer((val) => {
      if (typeof val !== 'string') return val;
      const upper = val.toUpperCase().trim();
      if (upper === 'IMPLEMENTATION' || upper === 'CONSTRUCTION') return 'EXECUTION';
      if (upper === 'TENDERING' || upper === 'TENDERING & AWARD') return 'PROCUREMENT';
      if (upper === 'PRE-CONSTRUCTION') return 'PLANNING';
      return upper;
    })
    .isIn(['PLANNING', 'PROCUREMENT', 'EXECUTION', 'COMMISSIONING', 'COMPLETED'])
    .withMessage('Invalid project_stage (must be PLANNING, PROCUREMENT, EXECUTION, COMMISSIONING, or COMPLETED)'),
  
  body('priority_category')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.toUpperCase().trim() : val))
    .isIn(['TOP_PRIORITY', 'HIGH_IMPACT', 'REGULAR', 'STRATEGIC', 'P1', 'P2', 'P3', 'P4'])
    .withMessage('Invalid priority_category'),
  
  body('source_system')
    .optional()
    .isIn(['OCMS', 'PAIMANA', 'DEMO', 'OTHER'])
    .withMessage('Invalid source_system')
];

const validateUpdateProject = [
  ...validateProjectId,
  body('project_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('project_name cannot be empty')
    .isLength({ max: 255 })
    .withMessage('project_name must not exceed 255 characters'),
  
  body('original_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('original_cost must be a non-negative number'),
  
  body('approved_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('approved_cost must be a non-negative number'),
  
  body('revised_cost')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('revised_cost must be a non-negative number'),
  
  body('latitude')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('latitude must be between -90 and 90'),
  
  body('longitude')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('longitude must be between -180 and 180'),
  
  body('current_status')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.toUpperCase().trim() : val))
    .isIn(['PROPOSED', 'APPROVED', 'ONGOING', 'COMPLETED', 'DELAYED', 'ON_HOLD', 'CANCELLED', 'CLOSED'])
    .withMessage('Invalid current_status'),
  
  body('project_stage')
    .optional()
    .customSanitizer((val) => {
      if (typeof val !== 'string') return val;
      const upper = val.toUpperCase().trim();
      if (upper === 'IMPLEMENTATION' || upper === 'CONSTRUCTION') return 'EXECUTION';
      if (upper === 'TENDERING' || upper === 'TENDERING & AWARD') return 'PROCUREMENT';
      if (upper === 'PRE-CONSTRUCTION') return 'PLANNING';
      return upper;
    })
    .isIn(['PLANNING', 'PROCUREMENT', 'EXECUTION', 'COMMISSIONING', 'COMPLETED'])
    .withMessage('Invalid project_stage')
];

const validateProjectListQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
  query('ministry_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ministry_id must be a positive integer'),
  query('sector_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('sector_id must be a positive integer'),
  query('state_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('state_id must be a positive integer'),
  query('agency_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('agency_id must be a positive integer'),
  query('status')
    .optional()
    .isIn(['PROPOSED', 'APPROVED', 'ONGOING', 'COMPLETED', 'DELAYED', 'ON_HOLD', 'CANCELLED', 'CLOSED'])
    .withMessage('Invalid status filter'),
  query('risk_level')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Invalid risk_level filter'),
  query('sortBy')
    .optional()
    .isIn([
      'project_id',
      'project_code',
      'project_name',
      'approved_cost',
      'revised_cost',
      'planned_completion_date',
      'current_status',
      'created_at',
      'overall_risk',
      'physical_progress'
    ])
    .withMessage('Invalid sortBy parameter'),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('sortOrder must be ASC or DESC')
];

module.exports = {
  validateProjectId,
  validateCreateProject,
  validateUpdateProject,
  validateProjectListQuery
};
