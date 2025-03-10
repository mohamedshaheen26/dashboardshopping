import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside
      id='sidebar'
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <i className='fas fa-shopping-cart'></i> Vé.a
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className='sidebar-list'>
        <li
          className={`sidebar-list-item ${
            location.pathname === "/" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/")}
        >
          <i className='fas fa-chart-pie'></i> Dashboard
        </li>
        <li
          className={`sidebar-list-item ${
            location.pathname.startsWith("/customers") ? "active" : ""
          }`}
          onClick={() => handleNavigation("/customers")}
        >
          <i className='fas fa-users'></i> Customers
        </li>
        <li
          className={`sidebar-list-item ${
            location.pathname.startsWith("/categories") ? "active" : ""
          }`}
          onClick={() => handleNavigation("/categories")}
        >
          <i className='fa-solid fa-tag'></i> Categories
        </li>
        <li
          className={`sidebar-list-item ${
            location.pathname.startsWith("/products") ? "active" : ""
          }`}
          onClick={() => handleNavigation("/products")}
        >
          <i className='fas fa-th'></i> Products
        </li>
        <li
          className={`sidebar-list-item ${
            location.pathname.startsWith("/offers") ? "active" : ""
          }`}
          onClick={() => handleNavigation("/offers")}
        >
          <i className='fas fa-gift'></i> Offers
        </li>
        <li
          className={`sidebar-list-item ${
            location.pathname.startsWith("/orders") ? "active" : ""
          }`}
          onClick={() => handleNavigation("/orders")}
        >
          <i className='fa-solid fa-truck'></i> Orders
        </li>
        <li
          className={`sidebar-list-item ${
            location.pathname.startsWith("/questions") ? "active" : ""
          }`}
          onClick={() => handleNavigation("/questions")}
        >
          <i className='fas fa-question-circle'></i> Questions
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
