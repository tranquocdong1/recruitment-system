import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar /> {/* Navbar sẽ luôn hiện ở đây */}
      <main>
        <Outlet /> {/* Đây là nơi nội dung các trang con sẽ hiển thị */}
      </main>
      {/* Bạn có thể thêm Footer ở đây nếu muốn */}
    </>
  );
};

export default MainLayout;