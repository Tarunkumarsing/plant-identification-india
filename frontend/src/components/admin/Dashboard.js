import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <p className="lead">Manage your plant identification database</p>
      
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Plant Characteristics</h5>
              <p className="card-text">Define traits used for plant identification.</p>
              <Link to="/admin/characteristics" className="btn btn-primary">Manage Characteristics</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Plant Families</h5>
              <p className="card-text">Manage plant families in the database.</p>
              <Link to="/admin/families" className="btn btn-primary">Manage Families</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Plant Genera</h5>
              <p className="card-text">Manage plant genera in the database.</p>
              <Link to="/admin/genera" className="btn btn-primary">Manage Genera</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Plant Species</h5>
              <p className="card-text">Manage plant species in the database.</p>
              <Link to="/admin/species" className="btn btn-primary">Manage Species</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">Back to Website</Link>
      </div>
    </div>
  );
};

export default Dashboard;