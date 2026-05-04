const Application = require('../models/Application');

// A. DÀNH CHO CANDIDATE: Nộp đơn ứng tuyển
exports.applyJob = async (req, res) => {
    try {
        const newApp = await Application.create({
            job: req.body.jobId,
            candidate: req.user.id, // Lấy từ Protect Middleware
            resume: req.body.resume
        });
        res.status(201).json({ status: 'success', data: newApp });
    } catch (err) {
        res.status(400).json({ 
            message: err.code === 11000 ? 'Bạn đã ứng tuyển công việc này rồi!' : err.message 
        });
    }
};

// B. DÀNH CHO EMPLOYER/ADMIN: Lấy danh sách đơn ứng tuyển của một Job
exports.getJobApplications = async (req, res) => {
    try {
        const apps = await Application.find({ job: req.params.jobId })
            .populate('candidate', 'email') // Hiển thị email ứng viên thay vì mỗi cái ID
            .sort('-appliedAt');
            
        res.status(200).json({ status: 'success', results: apps.length, data: apps });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// C. DÀNH CHO EMPLOYER/ADMIN: Cập nhật trạng thái (Duyệt/Từ chối)
exports.updateStatus = async (req, res) => {
    try {
        const app = await Application.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true, runValidators: true }
        );
        if (!app) return res.status(404).json({ message: 'Không tìm thấy đơn này' });
        res.status(200).json({ status: 'success', data: app });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};