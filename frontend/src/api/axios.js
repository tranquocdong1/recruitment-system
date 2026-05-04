import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Middleware gửi đi: Tự động đính kèm Token vào Header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Middleware nhận về: Xử lý lỗi 401 (Hết hạn Token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Nếu lỗi 401 và chưa từng thử refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const res = await axios.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });
                
                const { accessToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                
                // Thử lại request ban đầu với Token mới
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Nếu refresh cũng lỗi (hết hạn 30 ngày) -> Logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;