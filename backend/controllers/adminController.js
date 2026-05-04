const User = require('../models/User');
const Job = require('../models/Job');

// 1. Lấy danh sách tất cả người dùng (Chỉ Admin mới thấy)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: 'success', data: { users } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 2. Admin xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 3. Thống kê nhanh hệ thống (Dashboard)
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const jobCount = await Job.countDocuments();
        res.status(200).json({
            status: 'success',
            data: { totalUsers: userCount, totalJobs: jobCount }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};