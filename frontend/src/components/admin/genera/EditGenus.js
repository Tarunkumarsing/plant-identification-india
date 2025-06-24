import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../../styles/AdminContent.css';

const EditGenus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [genus, setGenus] = useState({ name: '', description: '', familyId: '' });
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch genus details and families
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, we'll use mock data
        // In production, replace with API call
        setTimeout(() => {
          const mockFamilies = [
            { id: '1', name: 'Fabaceae' },
            { id: '2', name: 'Poaceae' },
            { id: '3', name: 'Solanaceae' }
          ];
          
          const mockGenera = [
            { id: '1', name: 'Acacia', description: 'Trees and shrubs with thorns and compound leaves.', familyId: '1' },
            { id: '2', name: 'Dalbergia', description: 'Trees known for their valuable timber.', familyId: '1' },
            { id: '3', name: 'Bambusa', description: 'Bamboo species with woody stems.', familyId: '2' },
            { id: '4', name: 'Solanum', description: 'Large genus that includes tomatoes, potatoes, and eggplants.', familyId: '3' }
          ];
          
          const foundGenus = mockGenera.find(g => g.id === id);
          
          if (foundGenus) {
            setGenus(foundGenus);
            setFamilies(mockFamilies);
          } else {
            setError('Genus not found');
          }
          
          setLoading(false);
        }, 500);
        
        // When API is ready:
        // const [genusRes, familiesRes] = await Promise.all([
        //   axios.get(`http://localhost:5000/api/admin/genera/${id}`),
        //   axios.get('http://localhost:5000/api/admin/families')
        // ]);
        // setGenus(genusRes.data);
        // setFamilies(familiesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    setGenus({ ...genus, [e.target.name]: e.target.value });
  };

  // Update genus
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!genus.name.trim() || !genus.familyId) return;
    
    setSubmitting(true);
    
    try {
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setSubmitting(false);
        navigate('/admin/genera');
      }, 500);
      
      // When API is ready:
      // await axios.put(`http://localhost:5000/api/admin/genera/${id}`, genus);
      // navigate('/admin/genera');
    } catch (err) {
      console.error('Error updating genus:', err);
      setError('Failed to update genus');
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-content-header">
        <h1>Edit Plant Genus</h1>
        <p>Update genus information</p>
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
          <p>Loading genus data...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="familyId" className="form-label">Plant Family</label>
                <select
                  className="form-select"
                  id="familyId"
                  name="familyId"
                  value={genus.familyId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a family</option>
                  {families.map(family => (
                    <option key={family.id} value={family.id}>
                      {family.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Genus Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={genus.name}
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
                  value={genus.description}
                  onChange={handleInputChange}
                  rows="5"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={submitting || !genus.name.trim() || !genus.familyId}
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
                  onClick={() => navigate('/admin/genera')}
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

export default EditGenus;