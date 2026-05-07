import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        // 1. Xóa toàn bộ dữ liệu trong LocalStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // 2. Thông báo và chuyển hướng
        toast.info("Đã đăng xuất");
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">IT Recruitment</Link>
                <div className="d-flex align-items-center">
                    {user && <span className="text-white me-3">Chào, {user.email}</span>}
                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;