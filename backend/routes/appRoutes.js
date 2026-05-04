const express = require('express');
const appController = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Bắt buộc đăng nhập cho tất cả các thao tác bên dưới

// Ứng viên nộp bài
router.post('/apply', restrictTo('candidate'), appController.applyJob);

// Nhà tuyển dụng xem danh sách ứng viên của 1 Job cụ thể
router.get('/job/:jobId', restrictTo('employer', 'admin'), appController.getJobApplications);

// Nhà tuyển dụng cập nhật trạng thái đơn
router.patch('/status/:id', restrictTo('employer', 'admin'), appController.updateStatus);

module.exports = router;