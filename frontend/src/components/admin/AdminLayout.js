import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Plant Admin</h3>
          <p>{adminName}</p>
        </div>
        <nav className="admin-menu">
          <Link to="/admin/dashboard" className={`admin-menu-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i> Dashboard
          </Link>
          <Link to="/admin/characteristics" className={`admin-menu-item ${isActive('/admin/characteristics') ? 'active' : ''}`}>
            <i className="bi bi-list-check"></i> Characteristics
          </Link>
          <Link to="/admin/families" className={`admin-menu-item ${isActive('/admin/families') ? 'active' : ''}`}>
            <i className="bi bi-diagram-3"></i> Families
          </Link>
          <Link to="/admin/genera" className={`admin-menu-item ${isActive('/admin/genera') ? 'active' : ''}`}>
            <i className="bi bi-collection"></i> Genera
          </Link>
          <Link to="/admin/species" className={`admin-menu-item ${isActive('/admin/species') ? 'active' : ''}`}>
            <i className="bi bi-tree"></i> Species
          </Link>
          <hr />
          <Link to="/" className="admin-menu-item" target="_blank">
            <i className="bi bi-box-arrow-up-right"></i> View Website
          </Link>
          <button className="admin-menu-item logout-button" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i> Logout
          </button>
        </nav>
      </div>
      
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;