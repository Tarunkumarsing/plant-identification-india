import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../../styles/AdminContent.css';

const EditFamily = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [family, setFamily] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch family details
  useEffect(() => {
    const fetchFamily = async () => {
      try {
        // For now, we'll use mock data
        // In production, replace with API call
        setTimeout(() => {
          const mockFamilies = [
            { id: '1', name: 'Fabaceae', description: 'The legume family, one of the largest plant families.' },
            { id: '2', name: 'Poaceae', description: 'The grass family, includes cereals and bamboos.' },
            { id: '3', name: 'Solanaceae', description: 'The nightshade family, includes potatoes and tomatoes.' }
          ];
          
          const foundFamily = mockFamilies.find(f => f.id === id);
          
          if (foundFamily) {
            setFamily(foundFamily);
          } else {
            setError('Family not found');
          }
          
          setLoading(false);
        }, 500);
        
        // When API is ready:
        // const response = await axios.get(`http://localhost:5000/api/admin/families/${id}`);
        // setFamily(response.data);
      } catch (err) {
        console.error('Error fetching family:', err);
        setError('Failed to load family data');
        setLoading(false);
      }
    };
    
    fetchFamily();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFamily({ ...family, [e.target.name]: e.target.value });
  };

  // Update family
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!family.name.trim()) return;
    
    setSubmitting(true);
    
    try {
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setSubmitting(false);
        navigate('/admin/families');
      }, 500);
      
      // When API is ready:
      // await axios.put(`http://localhost:5000/api/admin/families/${id}`, family);
      // navigate('/admin/families');
    } catch (err) {
      console.error('Error updating family:', err);
      setError('Failed to update family');
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-content-header">
        <h1>Edit Plant Family</h1>
        <p>Update family information</p>
      </div>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading family data...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Family Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={family.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={family.description}
                  onChange={handleInputChange}
                  rows="5"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={submitting || !family.name.trim()}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/admin/families')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFamily;