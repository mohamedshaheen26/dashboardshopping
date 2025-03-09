import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ OpenSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className='header'>
      <div className='menu-icon'>
        <i className='fas fa-bars' onClick={OpenSidebar}></i>
      </div>
      <div className='header-left'></div>
      <div className='header-right'>
        <button className='user-log' title='logout' onClick={handleLogout}>
          <i className='fas fa-sign-out-alt'></i>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
