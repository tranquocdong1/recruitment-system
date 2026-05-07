import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from 'react-toastify';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  // 1. Lấy danh sách Jobs của Employer này (Giả sử Backend có route lấy job theo employer)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs"); // Bạn có thể filter theo employer ở backend
        setJobs(res.data.data.jobs);
      } catch (err) {
        console.error("Lỗi lấy danh sách job", err);
      }
    };
    fetchJobs();
  }, []);

  // 2. Lấy ứng viên khi chọn một Job
  const handleViewApplications = async (jobId) => {
    try {
      setSelectedJob(jobId);
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data.data);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(msg);
    }
  };

  // 3. Cập nhật trạng thái (Chuyển từ Pending -> Interviewing...)
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/status/${appId}`, { status: newStatus });
      // Cập nhật lại giao diện tại chỗ
      setApplications(
        applications.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (err) {
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(msg);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Hệ thống quản lý tuyển dụng (ATS) 📊</h2>

      <div className="row">
        {/* Cột trái: Danh sách Tin tuyển dụng */}
        <div className="col-md-4">
          <div className="list-group">
            <h5 className="list-group-item list-group-item-action active">
              Tin tuyển dụng của bạn
            </h5>
            {jobs.map((job) => (
              <button
                key={job._id}
                className={`list-group-item list-group-item-action ${selectedJob === job._id ? "bg-light" : ""}`}
                onClick={() => handleViewApplications(job._id)}
              >
                {job.title}
              </button>
            ))}
          </div>
        </div>

        {/* Cột phải: Danh sách Ứng viên */}
        <div className="col-md-8">
          <h5>Danh sách ứng viên {selectedJob && "cho công việc đã chọn"}</h5>
          <table className="table table-hover border mt-3">
            <thead className="table-dark">
              <tr>
                <th>Ứng viên</th>
                <th>CV</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.candidate?.email}</td>
                    <td>
                      <a href={app.resume} target="_blank" rel="noreferrer">
                        Xem CV
                      </a>
                    </td>
                    <td>
                      <span
                        className={`badge ${app.status === "accepted" ? "bg-success" : app.status === "rejected" ? "bg-danger" : "bg-warning text-dark"}`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={app.status}
                        onChange={(e) =>
                          handleUpdateStatus(app._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Chọn một job hoặc chưa có ứng viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
