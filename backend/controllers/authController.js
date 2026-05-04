const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hàm tạo Token JWT
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Thẻ có hạn trong 7 ngày
    });
};

// ĐĂNG KÝ TÀI KHOẢN
exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Tạo user mới (Mật khẩu sẽ tự được băm bởi middleware ở model)
        const newUser = await User.create({
            email,
            password,
            role
        });

        // 2. Tạo token
        const token = signToken(newUser._id);

        // 3. Phản hồi về client
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role
                }
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra xem có nhập email và password không
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
        }

        // 2. Tìm user và lấy luôn cả trường password (vì mặc định ta đã đặt select: false)
        const user = await User.findOne({ email }).select('+password');

        // 3. Kiểm tra user tồn tại và mật khẩu có đúng không (dùng hàm comparePassword đã viết ở Model)
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }

        // 4. Nếu mọi thứ OK, gửi token về cho client
        const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: { id: user._id, email: user.email, role: user.role }
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};