import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  return (
    <div className='grid-container'>
      {!isLoginPage && <Header />}
      {!isLoginPage && (
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}
        />
      )}
      <main className='content'>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
