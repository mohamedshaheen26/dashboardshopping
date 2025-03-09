import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";

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
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
