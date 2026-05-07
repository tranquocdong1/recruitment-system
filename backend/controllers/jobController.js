const Job = require('../models/Job');
const Application = require('../models/Application');

// 1. TẠO TIN TUYỂN DỤNG (Nâng cấp để nhận mọi field từ Postman)
exports.createJob = async (req, res) => {
    try {
        // Gán ID của employer đang đăng nhập vào dữ liệu job
        const jobData = { 
            ...req.body, 
            employer: req.user.id 
        };
        
        const newJob = await Job.create(jobData);

        res.status(201).json({ 
            status: 'success', 
            data: { job: newJob } 
        });
    } catch (err) {
        res.status(400).json({ 
            status: 'fail', 
            message: err.message 
        });
    }
};

// 2. LẤY TẤT CẢ TIN TUYỂN DỤNG (Thêm sắp xếp mới nhất lên đầu)
exports.getAllJobs = async (req, res) => {
    try {
        // Thêm .sort({ createdAt: -1 }) để tin mới đăng hiện lên đầu trang
        const jobs = await Job.find().sort({ createdAt: -1 }).lean();
        
        const userId = req.user?._id || req.user?.id;

        // Nếu không có user đăng nhập
        if (!userId) {
            const jobsWithFalseStatus = jobs.map(job => ({ ...job, isApplied: false }));
            return res.status(200).json({
                status: 'success',
                data: { jobs: jobsWithFalseStatus }
            });
        }

        // Nếu có user, kiểm tra trạng thái ứng tuyển
        const jobsWithStatus = await Promise.all(
            jobs.map(async (job) => {
                const application = await Application.findOne({
                    job: job._id,
                    candidate: userId
                });
                return { 
                    ...job, 
                    isApplied: !!application 
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
        // Đảm bảo chỉ employer tạo ra tin đó mới có quyền sửa (optional check)
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
        // Khi xóa Job, có thể cân nhắc xóa luôn các Application liên quan (optional)
        await Job.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).lean();
        if (!job) return res.status(404).json({ message: 'Không tìm thấy job' });

        // Kiểm tra xem user này đã apply chưa (giống logic getAllJobs)
        const userId = req.user?.id;
        let isApplied = false;
        if (userId) {
            const app = await Application.findOne({ job: job._id, candidate: userId });
            isApplied = !!app;
        }

        res.status(200).json({ 
            status: 'success', 
            data: { job: { ...job, isApplied } } 
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};