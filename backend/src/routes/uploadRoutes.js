const express = require('express');
const router = express.Router();
const multer = require('multer');
const UploadController = require('../controllers/uploadController');
const ApiResponse = require('../utils/apiResponse');

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum file size
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.csv')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files (.csv) are supported'), false);
    }
  }
});

// Middleware to handle multer file upload errors
const handleUpload = (field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return ApiResponse.error(res, `Upload error: ${err.message}`, 'FILE_UPLOAD_ERROR', 400);
    } else if (err) {
      return ApiResponse.error(res, err.message, 'FILE_VALIDATION_ERROR', 400);
    }
    next();
  });
};

// POST /api/upload/projects - Bulk project ingest
router.post('/projects', handleUpload('file'), UploadController.uploadProjects);

// POST /api/upload/monthly-data - Bulk monthly monitoring ingest
router.post('/monthly-data', handleUpload('file'), UploadController.uploadMonthlyData);

module.exports = router;
