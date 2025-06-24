import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GeneraManager = () => {
  const [genera, setGenera] = useState([]);
  const [families, setFamilies] = useState([]);
  const [newGenus, setNewGenus] = useState({
    name: '',
    scientificName: '',
    familyId: '',
    description: '',
    characteristics: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  useEffect(() => {
    setFamilies([
      { id: 1, name: 'Rosaceae', scientificName: 'Rose Family' },
      { id: 2, name: 'Fabaceae', scientificName: 'Legume Family' }
    ]);

    setGenera([
      {
        id: 1,
        name: 'Rosa',
        scientificName: 'Rosa',
        familyId: 1,
        familyName: 'Rosaceae',
        description: 'Genus of flowering shrubs commonly known as roses',
        characteristics: 'Thorny stems, compound leaves, showy flowers'
      },
      {
        id: 2,
        name: 'Acacia',
        scientificName: 'Acacia',
        familyId: 2,
        familyName: 'Fabaceae',
        description: 'Large genus of trees and shrubs',
        characteristics: 'Bipinnate leaves, yellow flower clusters, pod fruits'
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    setNewGenus({
      ...newGenus,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedFamily = families.find(f => f.id === parseInt(newGenus.familyId));
    const genusToAdd = {
      ...newGenus,
      id: genera.length + 1,
      familyName: selectedFamily ? selectedFamily.name : ''
    };
    setGenera([...genera, genusToAdd]);
    setNewGenus({ name: '', scientificName: '', familyId: '', description: '', characteristics: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setGenera(genera.filter(genus => genus.id !== id));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Plant Genera Management</h2>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Genus'}
          </button>
          <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Add New Plant Genus</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Genus Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newGenus.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Scientific Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="scientificName"
                    value={newGenus.scientificName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Family</label>
                  <select
                    className="form-control"
                    name="familyId"
                    value={newGenus.familyId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Family</option>
                    {families.map(family => (
                      <option key={family.id} value={family.id}>
                        {family.name} ({family.scientificName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newGenus.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Key Characteristics</label>
                <textarea
                  className="form-control"
                  name="characteristics"
                  value={newGenus.characteristics}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Genus</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Existing Plant Genera ({genera.length})</h5>
        </div>
        <div className="card-body">
          {genera.length === 0 ? (
            <p className="text-muted">No plant genera added yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Genus Name</th>
                    <th>Scientific Name</th>
                    <th>Family</th>
                    <th>Description</th>
                    <th>Characteristics</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {genera.map(genus => (
                    <tr key={genus.id}>
                      <td>{genus.name}</td>
                      <td><em>{genus.scientificName}</em></td>
                      <td>{genus.familyName}</td>
                      <td>{genus.description}</td>
                      <td>{genus.characteristics}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => console.log('Edit', genus.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(genus.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneraManager;