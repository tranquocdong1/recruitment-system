const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: [true, 'Đơn ứng tuyển phải thuộc về một công việc']
    },
    candidate: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Đơn ứng tuyển phải thuộc về một ứng viên']
    },
    resume: {
        type: String, // Link đến CV (Drive/Cloudinary)
        required: [true, 'Vui lòng cung cấp link CV']
    },
    status: {
        type: String,
        enum: ['pending', 'interviewing', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

// Đảm bảo một người chỉ được ứng tuyển 1 lần cho 1 công việc (Tránh spam)
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);