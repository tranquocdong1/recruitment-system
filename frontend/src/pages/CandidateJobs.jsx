import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data.data.jobs);
        setFilteredJobs(res.data.data.jobs);
      } catch (err) {
        console.error("Lỗi lấy danh sách job", err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchLocation =
        filterLocation === "" ||
        job.location.toLowerCase().includes(filterLocation.toLowerCase());
      return matchSearch && matchLocation;
    });
    setFilteredJobs(results);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [searchTerm, filterLocation, jobs]);

  // --- LOGIC PHÂN TRANG ---
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Cuộn lên đầu khi đổi trang
  };

  const getTimeAgo = (date) => {
    const hours = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));
    return hours > 0 ? `${hours}h` : "Mới đăng";
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="d-flex bg-white shadow-sm rounded-pill p-2 border">
            <div className="flex-grow-1 d-flex align-items-center px-3 border-end">
              <i className="bi bi-search text-muted me-2"></i>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Job Title, Keyword, Company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-grow-1 d-flex align-items-center px-3">
              <i className="bi bi-geo-alt text-muted me-2"></i>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="City, country, region"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0 text-dark">
              {filteredJobs.length} Results {filteredJobs.length > 0 && `(Trang ${currentPage}/${totalPages})`}
            </h5>
          </div>

          {/* Render 10 job của trang hiện tại */}
          {currentJobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="text-decoration-none">
              <div
                className="card border-0 shadow-sm mb-3 p-3 position-relative job-card-hover"
                style={{ borderRadius: "16px", transition: "transform 0.2s, shadow 0.2s", cursor: "pointer" }}
              >
                <div className="d-flex">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold me-3"
                    style={{ width: "50px", height: "50px", minWidth: "50px", fontSize: "1.2rem" }}
                  >
                    {job.company ? job.company.charAt(0) : "J"}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1 fw-bold text-dark">
                          {job.title}
                          <span className="text-muted fw-normal ms-2" style={{ fontSize: "0.95rem" }}>
                            , {job.company || "Company"}
                          </span>
                        </h5>
                        <div className="d-flex flex-wrap gap-3 text-muted mb-3" style={{ fontSize: "0.85rem" }}>
                          <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
                          <span><i className="bi bi-briefcase me-1"></i>{job.jobType || "N/A"}</span>
                          <span><i className="bi bi-star me-1"></i>{job.experience || "N/A"}</span>
                          <span><i className="bi bi-building me-1"></i>{job.workType || "N/A"}</span>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="badge rounded-pill px-3 py-2 mb-1" style={{ backgroundColor: "#6f42c1", color: "white" }}>
                          {job.salary || "Negotiable"}
                        </span>
                        <div className="text-muted small">{getTimeAgo(job.createdAt)}</div>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {job.domains && job.domains.map((tag, idx) => (
                        <span key={idx} className="badge bg-light text-dark border-0 px-3 py-2 rounded-pill" style={{ fontWeight: "500", fontSize: "0.75rem" }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="d-flex justify-content-end">
                      {job.isApplied ? (
                        <span className="text-success fw-bold small"><i className="bi bi-check-circle-fill me-2"></i> Đã ứng tuyển</span>
                      ) : (
                        <span className="text-primary fw-bold small">Xem chi tiết & Ứng tuyển <i className="bi bi-arrow-right ms-1"></i></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* --- ĐIỀU KHIỂN PHÂN TRANG --- */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link rounded-start-pill" onClick={() => paginate(currentPage - 1)}>
                    Trước
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link rounded-end-pill" onClick={() => paginate(currentPage + 1)}>
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {filteredJobs.length === 0 && (
            <div className="text-center mt-5 text-muted">Không tìm thấy công việc phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateJobs;