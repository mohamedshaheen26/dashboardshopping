import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
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
        <li className='sidebar-list-item'>
          <Link to='/'>
            <i className='fas fa-chart-pie'></i> Dashboard
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to='/customers'>
            <i className='fas fa-users'></i> Customers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to='/categories'>
            <i className='fa-solid fa-tag'></i> Categories
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to='/products'>
            <i className='fas fa-th'></i> Products
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to='/offers'>
            <i class='fas fa-gift'></i> Offers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to='/orders'>
            <i className='fa-solid fa-truck'></i> Orders
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to='/questions'>
            <i class='fas fa-question-circle'></i>   Questions
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
