import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout'; // Import Layout mới
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateJobs from './pages/CandidateJobs';
import JobDetail from './pages/JobDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- NHÓM 1: CÁC TRANG KHÔNG CÓ NAVBAR --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={
            <div className="container text-center mt-5">
                <h1 className="text-danger">403 - Không có quyền truy cập</h1>
                <p>Bạn không có quyền xem trang này với tài khoản hiện tại.</p>
                <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Quay lại đăng nhập</button>
            </div>
        } />

        {/* --- NHÓM 2: CÁC TRANG CÓ NAVBAR (Bọc bởi MainLayout) --- */}
        <Route element={<MainLayout />}>
          
          {/* Nhóm con 2.1: Chỉ dành cho Candidate */}
          <Route element={<ProtectedRoute allowedRoles={['candidate', 'admin']} />}>
            <Route path="/jobs" element={<CandidateJobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
          </Route>

          {/* Nhóm con 2.2: Chỉ dành cho Employer hoặc Admin */}
          <Route element={<ProtectedRoute allowedRoles={['employer', 'admin']} />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          </Route>

          {/* Nhóm con 2.3: Chỉ dành riêng cho Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-panel" element={<div className="container mt-4"><h1>Trang quản trị hệ thống</h1></div>} />
          </Route>
          
        </Route>

        {/* Điều hướng mặc định */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </Router>
  );
}

export default App;