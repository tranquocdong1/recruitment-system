const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Kiểm tra người dùng đã đăng nhập chưa
exports.protect = async (req, res, next) => {
    try {
        let token;
        // Lấy token từ header Authorization (Bearer <token>)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập.' });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra xem User đó còn tồn tại không
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'Tài khoản liên kết với token này không còn tồn tại.' });
        }

        // Gán thông tin user vào request để các hàm sau sử dụng
        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

// 2. Phân quyền theo vai trò (role)
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles là một mảng ví dụ ['employer']
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Bạn không có quyền thực hiện hành động này.' 
            });
        }
        next();
    };
};