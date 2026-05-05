import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // Lấy thông tin user từ localStorage (đã lưu lúc Login)
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('accessToken');

    // 1. Nếu chưa đăng nhập -> Đá về trang Login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Nếu đã đăng nhập nhưng sai Role -> Đá về trang không có quyền (hoặc trang chủ)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Nếu thỏa mãn hết -> Cho phép truy cập vào các Route con (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;