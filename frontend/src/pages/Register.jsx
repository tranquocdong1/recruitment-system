import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        role: 'candidate' // Mặc định là ứng viên
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.passwordConfirm) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }

        try {
            await api.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            
            toast.success("Đăng ký thành công! Hãy đăng nhập.");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: '450px' }}>
                <h3 className="text-center mb-4">Tham Gia Ngay 🚀</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input name="email" type="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu</label>
                        <input name="password" type="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <input name="passwordConfirm" type="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Bạn là ai?</label>
                        <select name="role" className="form-select" onChange={handleChange}>
                            <option value="candidate">Người tìm việc (Candidate)</option>
                            <option value="employer">Nhà tuyển dụng (Employer)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-3">Đăng Ký</button>
                    <div className="text-center">
                        <span>Đã có tài khoản? </span>
                        <Link to="/login">Đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;