const Application = require('../models/Application');

// A. DÀNH CHO CANDIDATE: Nộp đơn ứng tuyển
exports.applyJob = async (req, res) => {
    try {
        // Nếu upload thành công, Multer sẽ trả về link trong req.file.path
        const resumeUrl = req.file ? req.file.path : req.body.resume;

        const newApp = await Application.create({
            job: req.body.jobId,
            candidate: req.user.id,
            resume: resumeUrl
        });
        res.status(201).json({ status: 'success', data: newApp });
    } catch (err) {
        console.log("Lỗi chi tiết:", err.response?.data);
        res.status(400).json({ message: err.message });
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