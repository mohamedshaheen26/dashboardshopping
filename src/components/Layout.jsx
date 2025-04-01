import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const [openSidebar, setOpenSidebar] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <div className='grid-container'>
      {!isLoginPage && <Header OpenSidebar={toggleSidebar} />}
      {!isLoginPage && (
        <Sidebar openSidebarToggle={openSidebar} OpenSidebar={toggleSidebar} />
      )}
      <main className='content'>
        <ToastContainer style={{ zIndex: 99999999 }} />
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
