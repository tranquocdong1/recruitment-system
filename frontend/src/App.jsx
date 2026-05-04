import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Component giả lập cho các trang sau này (Bạn sẽ tạo file riêng sau)
const EmployerDashboard = () => <div className="container mt-5"><h1>Employer Dashboard</h1><p>Chào mừng nhà tuyển dụng!</p></div>;
const CandidateJobs = () => <div className="container mt-5"><h1>Danh sách việc làm</h1><p>Tìm kiếm công việc mơ ước tại đây.</p></div>;

function App() {
  return (
    <Router>
      <div className="App">
        {/* Bạn có thể thêm Navbar chung ở đây nếu muốn */}
        <Routes>
          {/* Trang mặc định sẽ là Login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<Login />} />

          {/* Các tuyến đường chúng ta sẽ phát triển tiếp theo */}
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/jobs" element={<CandidateJobs />} />

          {/* Trang lỗi 404 */}
          <Route path="*" element={
            <div className="container text-center mt-5">
              <h1>404</h1>
              <p>Trang bạn tìm kiếm không tồn tại.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;