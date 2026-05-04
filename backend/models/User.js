const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        lowercase: true, // Tự động chuyển email về chữ thường
        trim: true       // Loại bỏ khoảng trắng thừa ở hai đầu
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false    // Không tự động trả về mật khẩu khi truy vấn dữ liệu
    },
    role: {
        type: String,
        enum: ['candidate', 'employer'],
        default: 'candidate'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware: Tự động băm mật khẩu trước khi lưu vào Database
userSchema.pre('save', async function (next) {
    // Chỉ băm nếu mật khẩu bị thay đổi hoặc tạo mới
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Phương thức hỗ trợ: So sánh mật khẩu khi đăng nhập
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);