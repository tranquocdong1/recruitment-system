const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề công việc'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Vui lòng nhập mô tả công việc']
    },
    requirements: [String], // Mảng các kỹ năng yêu cầu
    salary: String,
    location: String,
    employer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Tham chiếu đến bảng User
        required: [true, 'Tin tuyển dụng phải thuộc về một nhà tuyển dụng']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);