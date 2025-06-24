import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/admin/auth/Login';
import Dashboard from './components/admin/Dashboard';
import FamiliesManager from './components/admin/families/FamiliesManager';
import GeneraManager from './components/admin/genera/GeneraManager';
import SpeciesManager from './components/admin/species/SpeciesManager';
import CharacteristicsManager from './components/admin/characteristics/CharacteristicsManager';
import './App.css';

function AdminApp() {
  return (
    <div className="admin-container">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="families" element={<FamiliesManager />} />
        <Route path="genera" element={<GeneraManager />} />
        <Route path="species" element={<SpeciesManager />} />
        <Route path="characteristics" element={<CharacteristicsManager />} />
        <Route path="/" element={<Navigate to="login" replace />} />
      </Routes>
    </div>
  );
}

export default AdminApp;