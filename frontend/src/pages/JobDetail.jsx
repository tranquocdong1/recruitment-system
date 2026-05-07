import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        // Lưu ý: Bạn cần tạo thêm API get chi tiết 1 job ở Backend
        setJob(res.data.data.job);
      } catch (err) {
        toast.error("Không tìm thấy công việc này");
        navigate("/jobs");
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile) return toast.error("Vui lòng chọn file CV!");
    setLoading(true);
    const formData = new FormData();
    formData.append("jobId", id);
    formData.append("resume", resumeFile);

    try {
      await api.post("/applications/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Ứng tuyển thành công!");
      setJob({ ...job, isApplied: true }); // Cập nhật trạng thái tại chỗ
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi ứng tuyển");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container py-5">
      <div className="row">
        {/* CỘT TRÁI: CHI TIẾT CÔNG VIỆC */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "20px" }}>
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{ width: "70px", height: "70px", fontSize: "1.5rem" }}>
                {job.company?.charAt(0)}
              </div>
              <div>
                <h2 className="fw-bold mb-0">{job.title}</h2>
                <p className="text-primary mb-0">{job.company} • {job.location}</p>
              </div>
            </div>

            <hr />

            <h5 className="fw-bold mt-3">Mô tả công việc</h5>
            <p className="text-muted">{job.description}</p>

            <h5 className="fw-bold mt-4">Yêu cầu ứng viên</h5>
            <ul>
              {job.requirements?.map((req, index) => (
                <li key={index} className="text-muted mb-2">{req}</li>
              ))}
            </ul>

            <h5 className="fw-bold mt-4">Kỹ năng liên quan</h5>
            <div className="d-flex flex-wrap gap-2">
              {job.domains?.map((domain, index) => (
                <span key={index} className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                  {domain}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ỨNG TUYỂN */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: "20px", top: "100px" }}>
            <h5 className="fw-bold mb-3 text-center">Ứng tuyển ngay</h5>
            
            {job.isApplied ? (
              <div className="alert alert-success text-center py-3">
                <i className="bi bi-check-circle-fill d-block fs-2 mb-2"></i>
                Bạn đã nộp đơn cho vị trí này.
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <div className="mb-4 text-center">
                   <span className="badge bg-purple-light text-purple p-2 w-100 mb-2">Lương: {job.salary}</span>
                   <small className="text-muted d-block">Hình thức: {job.workType}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Tải lên CV (PDF/DOCX)</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    onChange={(e) => setResumeFile(e.target.files[0])} 
                    required 
                  />
                </div>

                <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi đơn của tôi"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;