const express = require('express');
const jobController = require('../controllers/jobController');
const { protect, restrictTo, getUserId } = require('../middleware/authMiddleware');

const router = express.Router();

// Bất kỳ ai cũng có thể xem danh sách job
router.get('/', getUserId, jobController.getAllJobs);

// Chỉ Employer mới được thực hiện các thao tác này
router.post('/', protect, restrictTo('employer'), jobController.createJob);
router.patch('/:id', protect, restrictTo('employer'), jobController.updateJob);
router.delete('/:id', protect, restrictTo('employer'), jobController.deleteJob);

module.exports = router;