import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Lấy tất cả công việc đang tuyển
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        // Backend bây giờ trả về thêm trường isApplied: true/false
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
    if (!resumeFile) return toast.error("Vui lòng chọn file CV!");

    setLoading(true);

    const formData = new FormData();
    formData.append("jobId", selectedJob._id);
    formData.append("resume", resumeFile);

    try {
      await api.post("/applications/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // --- CẬP NHẬT UI TẠI CHỖ ---
      // Tìm job vừa ứng tuyển trong state và đổi isApplied thành true
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === selectedJob._id ? { ...job, isApplied: true } : job,
        ),
      );

      toast.success(`Ứng tuyển thành công vị trí ${selectedJob.title}!`);

      // Reset form
      setResumeFile(null);
      setSelectedJob(null);

      // Đóng Modal
      const modalElement = document.getElementById("applyModal");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Cơ hội việc làm dành cho bạn 🌟</h2>
      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-6 mb-4" key={job._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary">{job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  📍 {job.location} | 💰 {job.salary}
                </h6>
                <p
                  className="card-text text-truncate"
                  style={{ maxHeight: "50px" }}
                >
                  {job.description}
                </p>

                {/* --- THAY ĐỔI NÚT BẤM DỰA TRÊN TRẠNG THÁI --- */}
                {job.isApplied ? (
                  <button className="btn btn-secondary w-100" disabled>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Đã ứng tuyển
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#applyModal"
                    onClick={() => setSelectedJob(job)}
                  >
                    Xem chi tiết & Ứng tuyển
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ứng tuyển */}
      <div
        className="modal fade"
        id="applyModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Ứng tuyển vị trí: {selectedJob?.title}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleApply}>
              <div className="modal-body">
                <p>
                  <strong>Mô tả:</strong> {selectedJob?.description}
                </p>
                <div className="mb-3">
                  <label className="form-label">
                    Chọn file CV (PDF, DOC, DOCX)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  disabled={loading}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi đơn ứng tuyển"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateJobs;
