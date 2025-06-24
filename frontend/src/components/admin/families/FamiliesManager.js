import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FamiliesManager = () => {
  const [families, setFamilies] = useState([]);
  const [newFamily, setNewFamily] = useState({
    name: '',
    scientificName: '',
    description: '',
    characteristics: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load families from database
  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/families');
      if (response.ok) {
        const data = await response.json();
        setFamilies(data);
      } else {
        // Fallback to mock data if API fails
        setFamilies([
          {
            _id: '1',
            name: 'Rose Family',
            scientificName: 'Rosaceae',
            description: 'A major plant family including roses, apples, and cherries',
            characteristics: 'Usually have 5-petaled flowers, alternate leaves'
          },
          {
            _id: '2',
            name: 'Legume Family',
            scientificName: 'Fabaceae',
            description: 'Plants that fix nitrogen, including beans and peas',
            characteristics: 'Compound leaves, pod fruits, root nodules'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching families:', error);
      setMessage('Error loading families. Using offline data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewFamily({
      ...newFamily,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFamily)
      });

      if (response.ok) {
        const savedFamily = await response.json();
        setFamilies([...families, savedFamily]);
        setMessage('Family added successfully!');
        setNewFamily({ name: '', scientificName: '', description: '', characteristics: '' });
        setShowAddForm(false);
      } else {
        throw new Error('Failed to save family');
      }
    } catch (error) {
      console.error('Error saving family:', error);
      // Fallback: add to local state
      const familyToAdd = {
        ...newFamily,
        _id: Date.now().toString()
      };
      setFamilies([...families, familyToAdd]);
      setMessage('Family added locally (database connection failed)');
      setNewFamily({ name: '', scientificName: '', description: '', characteristics: '' });
      setShowAddForm(false);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this family?');
    if (!userConfirmed) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/families/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFamilies(families.filter(family => family._id !== id));
        setMessage('Family deleted successfully!');
      } else {
        throw new Error('Failed to delete family');
      }
    } catch (error) {
      console.error('Error deleting family:', error);
      // Fallback: remove from local state
      setFamilies(families.filter(family => family._id !== id));
      setMessage('Family deleted locally (database connection failed)');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Plant Families Management</h2>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={loading}
          >
            {showAddForm ? 'Cancel' : 'Add New Family'}
          </button>
          <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-warning'} alert-dismissible fade show`}>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Add New Plant Family</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Common Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newFamily.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Scientific Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="scientificName"
                    value={newFamily.scientificName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newFamily.description}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Key Characteristics</label>
                <textarea
                  className="form-control"
                  name="characteristics"
                  value={newFamily.characteristics}
                  onChange={handleInputChange}
                  rows="2"
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Add Family'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Existing Plant Families ({families.length})</h5>
        </div>
        <div className="card-body">
          {families.length === 0 ? (
            <p className="text-muted">No plant families added yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Common Name</th>
                    <th>Scientific Name</th>
                    <th>Description</th>
                    <th>Characteristics</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {families.map(family => (
                    <tr key={family._id}>
                      <td>{family.name}</td>
                      <td><em>{family.scientificName}</em></td>
                      <td>{family.description}</td>
                      <td>{family.characteristics}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => console.log('Edit', family._id)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(family._id)}
                          disabled={loading}
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

export default FamiliesManager;