const Job = require('../models/Job');

// 1. TẠO TIN TUYỂN DỤNG
exports.createJob = async (req, res) => {
    try {
        // Gán ID của employer đang đăng nhập vào dữ liệu job
        const jobData = { ...req.body, employer: req.user.id };
        const newJob = await Job.create(jobData);

        res.status(201).json({ status: 'success', data: { job: newJob } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 2. LẤY TẤT CẢ TIN TUYỂN DỤNG (Dành cho Ứng viên xem)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('employer', 'email'); // Lấy thêm email của employer
        res.status(200).json({ status: 'success', results: jobs.length, data: { jobs } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 3. CẬP NHẬT TIN TUYỂN DỤNG
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!job) return res.status(404).json({ message: 'Không tìm thấy tin này' });
        res.status(200).json({ status: 'success', data: { job } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 4. XÓA TIN TUYỂN DỤNG
exports.deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};