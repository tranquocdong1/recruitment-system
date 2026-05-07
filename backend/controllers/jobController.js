const Job = require('../models/Job');
const Application = require('../models/Application');

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
        // 1. Lấy tất cả jobs, dùng .lean() để trả về plain object (dễ thêm trường isApplied)
        const jobs = await Job.find().lean();
        
        // 2. Lấy userId từ middleware getUserId (nếu có)
        const userId = req.user?._id || req.user?.id;

        // 3. Nếu không có user đăng nhập, trả về jobs với isApplied mặc định là false
        if (!userId) {
            const jobsWithFalseStatus = jobs.map(job => ({ ...job, isApplied: false }));
            return res.status(200).json({
                status: 'success',
                data: { jobs: jobsWithFalseStatus }
            });
        }

        // 4. Nếu có user, kiểm tra trạng thái ứng tuyển cho từng job
        const jobsWithStatus = await Promise.all(
            jobs.map(async (job) => {
                const application = await Application.findOne({
                    job: job._id,
                    candidate: userId
                });
                return { 
                    ...job, 
                    isApplied: !!application // Trả về true nếu tìm thấy đơn, ngược lại false
                };
            })
        );

        res.status(200).json({
            status: 'success',
            data: { jobs: jobsWithStatus }
        });
    } catch (err) {
        console.error("🔥 Lỗi tại getAllJobs:", err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
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