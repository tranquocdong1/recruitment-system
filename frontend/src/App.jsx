import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateJobs from './pages/CandidateJobs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* NHÓM 1: Chỉ dành cho Candidate */}
        <Route element={<ProtectedRoute allowedRoles={['candidate', 'admin']} />}>
          <Route path="/jobs" element={<CandidateJobs />} />
        </Route>

        {/* NHÓM 2: Chỉ dành cho Employer hoặc Admin */}
        <Route element={<ProtectedRoute allowedRoles={['employer', 'admin']} />}>
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        </Route>

        {/* NHÓM 3: Chỉ dành riêng cho Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-panel" element={<div>Trang quản trị hệ thống</div>} />
        </Route>

        {/* Trang thông báo không có quyền truy cập */}
        <Route path="/unauthorized" element={
            <div className="container text-center mt-5">
                <h1 className="text-danger">403 - Không có quyền truy cập</h1>
                <p>Bạn không có quyền xem trang này với tài khoản hiện tại.</p>
                <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Quay lại đăng nhập</button>
            </div>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    </Router>
  );
}

export default App;