import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">Know Your Plant of India</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/plant-identification">Plant Identification</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/plant-glossary">Plant Glossary</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;