import React from 'react';
import { Link } from 'react-router-dom';
import PlantSearch from '../search/PlantSearch';
import '../../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="site-header">
        <h1>Know Your Plant of India</h1>
        <p className="lead">Explore and identify plants native to India through their characteristics</p>
        
        {/* Add the search component */}
        <div className="search-section">
          <PlantSearch />
        </div>
      </header>
      
      <div className="row main-sections">
        <div className="col-md-6 mb-4">
          <div className="card section-card h-100">
            <div className="card-body text-center">
              <h2 className="card-title">Plant Identification Keys</h2>
              <p className="card-text">Identify plants by their physical characteristics such as habit, leaves, flowers, and more.</p>
              <Link to="/plant-identification" className="btn btn-success">
                Start Identification
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card section-card h-100">
            <div className="card-body text-center">
              <h2 className="card-title">Plant Glossary</h2>
              <p className="card-text">Learn about botanical terms and plant structures to better understand plant descriptions.</p>
              <Link to="/plant-glossary" className="btn btn-success">
                Browse Glossary
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;