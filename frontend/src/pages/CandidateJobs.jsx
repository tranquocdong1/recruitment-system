import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const CandidateJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [resumeLink, setResumeLink] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    // 1. Lấy tất cả công việc đang tuyển
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs');
                setJobs(res.data.data.jobs);
            } catch (err) {
                console.error("Lỗi lấy danh sách job", err);
            }
        };
        fetchJobs();
    }, []);

    // 2. Xử lý ứng tuyển
    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await api.post('/applications/apply', {
                jobId: selectedJob._id,
                resume: resumeLink
            });
            alert(`Chúc mừng! Bạn đã ứng tuyển thành công vị trí ${selectedJob.title}`);
            setResumeLink('');
            setSelectedJob(null);
            // Đóng Modal (Dùng cơ chế của Bootstrap)
            const modalElement = document.getElementById('applyModal');
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (err) {
            alert(err.response?.data?.message || "Ứng tuyển thất bại");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Cơ hội việc làm dành cho bạn 🌟</h2>
            <div className="row">
                {jobs.map(job => (
                    <div className="col-md-6 mb-4" key={job._id}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title text-primary">{job.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">📍 {job.location} | 💰 {job.salary}</h6>
                                <p className="card-text text-truncate" style={{maxHeight: '50px'}}>
                                    {job.description}
                                </p>
                                <button 
                                    className="btn btn-outline-primary"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#applyModal"
                                    onClick={() => setSelectedJob(job)}
                                >
                                    Xem chi tiết & Ứng tuyển
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Ứng tuyển */}
            <div className="modal fade" id="applyModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ứng tuyển vị trí: {selectedJob?.title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleApply}>
                            <div className="modal-body">
                                <p><strong>Mô tả:</strong> {selectedJob?.description}</p>
                                <div className="mb-3">
                                    <label className="form-label">Link CV của bạn (Drive/Cloudinary)</label>
                                    <input 
                                        type="url" 
                                        className="form-control" 
                                        placeholder="https://..." 
                                        value={resumeLink}
                                        onChange={(e) => setResumeLink(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="submit" className="btn btn-primary">Gửi đơn ứng tuyển</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateJobs;