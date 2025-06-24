import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/layout/Home';
import PlantIdentification from './components/plants/PlantIdentification';
import PlantGlossary from './components/plants/PlantGlossary';
import './App.css';

function App() {
  return (
    <div className="app-container"> {/* Add this wrapper div */}
      <Header />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plant-identification" element={<PlantIdentification />} />
          <Route path="/plant-glossary" element={<PlantGlossary />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;