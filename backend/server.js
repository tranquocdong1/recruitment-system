const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middlewares cơ bản
app.use(cors()); // Cho phép React truy cập API
app.use(express.json()); // Để đọc được dữ liệu JSON từ request body

app.use('/api/auth', require('./routes/authRoutes'));

// 2. Hàm kết nối MongoDB & Khởi chạy Server
const startServer = async () => {
    try {
        // Đảm bảo DB kết nối xong mới làm việc tiếp
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected...');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1); // Dừng hệ thống nếu không có DB
    }
};

startServer();

// Route kiểm tra nhanh
app.get('/', (req, res) => {
    res.send('API is running...');
});