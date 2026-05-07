const express = require('express');
const appController = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const uploadCloud = require('../utils/cloudinary');

const router = express.Router();

router.use(protect); // Bắt buộc đăng nhập cho tất cả các thao tác bên dưới

// Ứng viên nộp bài
router.post('/apply', 
    protect, 
    restrictTo('candidate'), 
    (req, res, next) => {
        uploadCloud.single('resume')(req, res, (err) => {
            if (err) {
                console.error("❌ LỖI MULTER/CLOUDINARY:", err);
                return res.status(500).json({ status: 'error', message: err.message });
            }
            next();
        });
    }, 
    appController.applyJob
);

// Nhà tuyển dụng xem danh sách ứng viên của 1 Job cụ thể
router.get('/job/:jobId', restrictTo('employer', 'admin'), appController.getJobApplications);

// Nhà tuyển dụng cập nhật trạng thái đơn
router.patch('/status/:id', restrictTo('employer', 'admin'), appController.updateStatus);

module.exports = router;