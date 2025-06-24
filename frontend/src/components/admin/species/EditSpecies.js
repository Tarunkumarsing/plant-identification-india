import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../../styles/AdminContent.css';
import '../../../styles/SpeciesManager.css';

const EditSpecies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  
  const [species, setSpecies] = useState({
    name: '',
    genusId: '',
    description: '',
    characteristics: {},
    imageUrl: '',
    distribution: ''
  });
  const [genera, setGenera] = useState([]);
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [filteredGenera, setFilteredGenera] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch species details, genera, and families
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, we'll use mock data
        // In production, replace with API calls
        setTimeout(() => {
          const mockFamilies = [
            { id: '1', name: 'Fabaceae' },
            { id: '2', name: 'Poaceae' },
            { id: '3', name: 'Solanaceae' }
          ];
          
          const mockGenera = [
            { id: '1', name: 'Acacia', familyId: '1', familyName: 'Fabaceae' },
            { id: '2', name: 'Dalbergia', familyId: '1', familyName: 'Fabaceae' },
            { id: '3', name: 'Bambusa', familyId: '2', familyName: 'Poaceae' },
            { id: '4', name: 'Solanum', familyId: '3', familyName: 'Solanaceae' }
          ];
          
          const mockSpecies = [
            { 
              id: '1', 
              name: 'nilotica', 
              genusId: '1', 
              genusName: 'Acacia',
              familyId: '1',
              familyName: 'Fabaceae',
              description: 'Commonly known as Babul or Kikar. A medium-sized thorny tree native to Africa and the Indian subcontinent.',
              characteristics: {
                Habit: ['Tree'],
                Leaves: ['Bipinnate'],
                Flowers: ['Regular', 'Yellow']
              },
              imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Acacia_nilotica_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-001.jpg/800px-Acacia_nilotica_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-001.jpg',
              distribution: 'Western Ghats, Gangetic Plain'
            },
            { 
              id: '2', 
              name: 'sissoo', 
              genusId: '2', 
              genusName: 'Dalbergia',
              familyId: '1',
              familyName: 'Fabaceae',
              description: 'Commonly known as North Indian Rosewood. A large deciduous tree native to the Indian subcontinent.',
              characteristics: {
                Habit: ['Tree'],
                Leaves: ['Compound', 'Pinnate'],
                Fruits: ['Legume']
              },
              imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Dalbergia_sissoo_leaves.jpg/800px-Dalbergia_sissoo_leaves.jpg',
              distribution: 'Himalayan, Gangetic Plain'
            }
          ];
          
          const foundSpecies = mockSpecies.find(s => s.id === id);
          
          if (foundSpecies) {
            setSpecies(foundSpecies);
            setSelectedFamily(foundSpecies.familyId);
            setFamilies(mockFamilies);
            setGenera(mockGenera);
            
            // Filter genera based on selected family
            setFilteredGenera(mockGenera.filter(genus => genus.familyId === foundSpecies.familyId));
            setImagePreview(foundSpecies.imageUrl);
          } else {
            setError('Species not found');
          }
          
          setLoading(false);
        }, 500);
        
        // When API is ready:
        // const [speciesRes, familiesRes, generaRes] = await Promise.all([
        //   axios.get(`http://localhost:5000/api/admin/species/${id}`),
        //   axios.get('http://localhost:5000/api/admin/families'),
        //   axios.get('http://localhost:5000/api/admin/genera')
        // ]);
        // 
        // setSpecies(speciesRes.data);
        // setFamilies(familiesRes.data);
        // setGenera(generaRes.data);
        // setSelectedFamily(speciesRes.data.familyId);
        // setFilteredGenera(generaRes.data.filter(genus => genus.familyId === speciesRes.data.familyId));
        // setImagePreview(speciesRes.data.imageUrl);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Handle family change
  const handleFamilyChange = (e) => {
    const familyId = e.target.value;
    setSelectedFamily(familyId);
    
    const filtered = genera.filter(genus => genus.familyId === familyId);
    setFilteredGenera(filtered);
    
    // Reset genus selection if not available in new family
    if (!filtered.find(g => g.id === species.genusId)) {
      setSpecies({
        ...species,
        genusId: filtered.length > 0 ? filtered[0].id : ''
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setSpecies({ ...species, [e.target.name]: e.target.value });
  };

  // Handle characteristic selections
  const handleCharacteristicChange = (category, value, checked) => {
    setSpecies(prev => {
      const updatedCharacteristics = { ...prev.characteristics };
      
      if (!updatedCharacteristics[category]) {
        updatedCharacteristics[category] = [];
      }
      
      if (checked) {
        updatedCharacteristics[category] = [...updatedCharacteristics[category], value];
      } else {
        updatedCharacteristics[category] = updatedCharacteristics[category].filter(item => item !== value);
      }
      
      return { ...prev, characteristics: updatedCharacteristics };
    });
  };

  // Handle image file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    
    // In a real app, you would upload the image to your server or a service like AWS S3
    setUploadingImage(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Here you would normally get the URL from your server's response
          setSpecies({ ...species, imageUrl: URL.createObjectURL(file) });
          setUploadingImage(false);
        }, 500);
      }
    }, 300);
    
    // When API is ready:
    // const formData = new FormData();
    // formData.append('image', file);
    // 
    // try {
    //   const response = await axios.post('http://localhost:5000/api/upload', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //     onUploadProgress: (progressEvent) => {
    //       const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //       setUploadProgress(percentCompleted);
    //     }
    //   });
    //   
    //   setSpecies({ ...species, imageUrl: response.data.imageUrl });
    //   setUploadingImage(false);
    // } catch (err) {
    //   console.error('Error uploading image:', err);
    //   setError('Failed to upload image');
    //   setUploadingImage(false);
    // }
  };

  // Update species
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!species.name.trim() || !species.genusId) return;
    
    setSubmitting(true);
    
    try {
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setSubmitting(false);
        navigate('/admin/species');
      }, 500);
      
      // When API is ready:
      // await axios.put(`http://localhost:5000/api/admin/species/${id}`, species);
      // navigate('/admin/species');
    } catch (err) {
      console.error('Error updating species:', err);
      setError('Failed to update species');
      setSubmitting(false);
    }
  };

  // Mock characteristics options (in a real app, fetch from API)
  const characteristicOptions = {
    'Habit': ['Tree', 'Shrub', 'Herb', 'Climber', 'Liana', 'Epiphyte'],
    'Leaves': ['Simple', 'Compound', 'Pinnate', 'Bipinnate', 'Palmate', 'Scale-like'],
    'Flowers': ['Regular', 'Irregular', 'White', 'Yellow', 'Red', 'Blue'],
    'Fruits': ['Berry', 'Drupe', 'Capsule', 'Legume', 'Nut', 'Achene']
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-content-header">
        <h1>Edit Plant Species</h1>
        <p>Update species information</p>
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
          <p>Loading species data...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="family" className="form-label">Family</label>
                    <select
                      className="form-select"
                      id="family"
                      name="family"
                      value={selectedFamily}
                      onChange={handleFamilyChange}
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
                    <label htmlFor="genusId" className="form-label">Genus</label>
                    <select
                      className="form-select"
                      id="genusId"
                      name="genusId"
                      value={species.genusId}
                      onChange={handleInputChange}
                      required
                      disabled={!filteredGenera.length}
                    >
                      <option value="">Select a genus</option>
                      {filteredGenera.map(genus => (
                        <option key={genus.id} value={genus.id}>
                          {genus.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Species Name (Specific Epithet)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={species.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. nilotica"
                    />
                    <small className="form-text text-muted">
                      Enter only the specific epithet, not the full name
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={species.description}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="distribution" className="form-label">Distribution</label>
                    <input
                      type="text"
                      className="form-control"
                      id="distribution"
                      name="distribution"
                      value={species.distribution}
                      onChange={handleInputChange}
                      placeholder="e.g. Western Ghats, Gangetic Plain"
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <div className="image-upload-container">
                      {!imagePreview && !species.imageUrl && (
                        <div 
                          className="image-upload-placeholder"
                          onClick={() => fileInputRef.current.click()}
                        >
                          <i className="bi bi-image"></i>
                          <p>Click to upload species image</p>
                        </div>
                      )}
                      
                      {(imagePreview || species.imageUrl) && (
                        <div className="image-preview-container">
                          <img 
                            src={imagePreview || species.imageUrl} 
                            alt="Species preview" 
                            className="img-fluid image-preview" 
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-danger image-remove-btn"
                            onClick={() => {
                              setImagePreview(null);
                              setSpecies({...species, imageUrl: ''});
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        className="form-control d-none" 
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      
                      {uploadingImage && (
                        <div className="mt-2">
                          <div className="progress">
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${uploadProgress}%` }}
                              aria-valuenow={uploadProgress} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small className="text-muted">Uploading image... {uploadProgress}%</small>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Characteristics</label>
                    <div className="characteristics-container">
                      {Object.entries(characteristicOptions).map(([category, options]) => (
                        <div key={category} className="characteristic-category">
                          <h5>{category}</h5>
                          <div className="characteristic-options">
                            {options.map(option => (
                              <div key={option} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`characteristic-${category}-${option}`}
                                  checked={species.characteristics[category]?.includes(option) || false}
                                  onChange={(e) => handleCharacteristicChange(category, option, e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`characteristic-${category}-${option}`}>
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={submitting || !species.name.trim() || !species.genusId}
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
                  onClick={() => navigate('/admin/species')}
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

export default EditSpecies;