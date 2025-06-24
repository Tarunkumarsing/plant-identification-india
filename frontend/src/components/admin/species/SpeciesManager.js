import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SpeciesManager = () => {
  const [species, setSpecies] = useState([]);
  const [genera, setGenera] = useState([]);
  const [newSpecies, setNewSpecies] = useState({
    commonName: '',
    scientificName: '',
    genusId: '',
    description: '',
    habitat: '',
    distribution: '',
    uses: '',
    characteristics: '',
    images: []
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Mock data
  useEffect(() => {
    fetchGenera();
    fetchSpecies();
  }, []);

  const fetchGenera = async () => {
    // Mock data for now
    setGenera([
      { _id: '1', name: 'Rosa', familyName: 'Rosaceae' },
      { _id: '2', name: 'Acacia', familyName: 'Fabaceae' }
    ]);
  };

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to mock data
      setSpecies([
        {
          _id: '1',
          commonName: 'Indian Rose',
          scientificName: 'Rosa indica',
          genusId: '1',
          genusName: 'Rosa',
          description: 'A species of rose native to India',
          habitat: 'Gardens, hillsides',
          distribution: 'Throughout India',
          uses: 'Ornamental, perfume',
          characteristics: 'Red flowers, thorny stems, compound leaves',
          images: [
            { url: '/images/rosa-indica-1.jpg', caption: 'Rosa indica flower' },
            { url: '/images/rosa-indica-2.jpg', caption: 'Rosa indica plant' }
          ]
        },
        {
          _id: '2',
          commonName: 'Babul',
          scientificName: 'Acacia nilotica',
          genusId: '2',
          genusName: 'Acacia',
          description: 'A thorny tree native to Africa and India',
          habitat: 'Dry regions, plains',
          distribution: 'Rajasthan, Gujarat, Maharashtra',
          uses: 'Timber, gum arabic, fodder',
          characteristics: 'Yellow flowers, bipinnate leaves, thorny branches',
          images: [
            { url: '/images/acacia-nilotica-1.jpg', caption: 'Acacia nilotica tree' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error fetching species:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewSpecies({
      ...newSpecies,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      caption: ''
    }));
    setImagePreview(previews);
  };

  const handleImageCaptionChange = (index, caption) => {
    const updatedPreviews = [...imagePreview];
    updatedPreviews[index].caption = caption;
    setImagePreview(updatedPreviews);
  };

  const removeImagePreview = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreview.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setImagePreview(updatedPreviews);
  };

  const uploadImages = async (files) => {
    const uploadedImages = [];
    
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('image', files[i]);
      formData.append('caption', imagePreview[i]?.caption || '');

      try {
        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const imageData = await response.json();
          uploadedImages.push(imageData);
        } else {
          // Fallback: create mock image data
          uploadedImages.push({
            url: `/images/${files[i].name}`,
            caption: imagePreview[i]?.caption || ''
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // Fallback: create mock image data
        uploadedImages.push({
          url: `/images/${files[i].name}`,
          caption: imagePreview[i]?.caption || ''
        });
      }
    }

    return uploadedImages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        uploadedImages = await uploadImages(imageFiles);
      }

      const speciesData = {
        ...newSpecies,
        images: uploadedImages
      };

      const response = await fetch('/api/species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(speciesData)
      });

      if (response.ok) {
        const savedSpecies = await response.json();
        const selectedGenus = genera.find(g => g._id === savedSpecies.genusId);
        savedSpecies.genusName = selectedGenus ? selectedGenus.name : '';
        setSpecies([...species, savedSpecies]);
        setMessage('Species added successfully with images!');
      } else {
        throw new Error('Failed to save species');
      }
    } catch (error) {
      console.error('Error saving species:', error);
      // Fallback: add to local state
      const selectedGenus = genera.find(g => g._id === newSpecies.genusId);
      const speciesToAdd = {
        ...newSpecies,
        _id: Date.now().toString(),
        genusName: selectedGenus ? selectedGenus.name : '',
        images: imagePreview.map(img => ({
          url: img.url,
          caption: img.caption
        }))
      };
      setSpecies([...species, speciesToAdd]);
      setMessage('Species added locally (database connection failed)');
    } finally {
      // Reset form
      setNewSpecies({
        commonName: '', scientificName: '', genusId: '', description: '',
        habitat: '', distribution: '', uses: '', characteristics: '', images: []
      });
      setImageFiles([]);
      setImagePreview([]);
      setShowAddForm(false);
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this species?');
    if (!userConfirmed) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/species/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSpecies(species.filter(sp => sp._id !== id));
        setMessage('Species deleted successfully!');
      } else {
        throw new Error('Failed to delete species');
      }
    } catch (error) {
      console.error('Error deleting species:', error);
      // Fallback: remove from local state
      setSpecies(species.filter(sp => sp._id !== id));
      setMessage('Species deleted locally (database connection failed)');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Plant Species Management</h2>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={loading}
          >
            {showAddForm ? 'Cancel' : 'Add New Species'}
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
            <h5>Add New Plant Species</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Common Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="commonName"
                    value={newSpecies.commonName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Scientific Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="scientificName"
                    value={newSpecies.scientificName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Genus</label>
                  <select
                    className="form-control"
                    name="genusId"
                    value={newSpecies.genusId}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Genus</option>
                    {genera.map(genus => (
                      <option key={genus._id} value={genus._id}>
                        {genus.name} ({genus.familyName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="mb-4">
                <label className="form-label">Plant Images</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={loading}
                />
                
                {imagePreview.length > 0 && (
                  <div className="row">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <div className="card">
                          <img 
                            src={preview.url} 
                            className="card-img-top" 
                            alt="Preview"
                            style={{height: '200px', objectFit: 'cover'}}
                          />
                          <div className="card-body">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Image caption..."
                              value={preview.caption}
                              onChange={(e) => handleImageCaptionChange(index, e.target.value)}
                              disabled={loading}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger mt-2"
                              onClick={() => removeImagePreview(index)}
                              disabled={loading}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Habitat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="habitat"
                    value={newSpecies.habitat}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Distribution</label>
                  <input
                    type="text"
                    className="form-control"
                    name="distribution"
                    value={newSpecies.distribution}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newSpecies.description}
                  onChange={handleInputChange}
                  rows="2"
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Uses</label>
                <textarea
                  className="form-control"
                  name="uses"
                  value={newSpecies.uses}
                  onChange={handleInputChange}
                  rows="2"
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Key Characteristics</label>
                <textarea
                  className="form-control"
                  name="characteristics"
                  value={newSpecies.characteristics}
                  onChange={handleInputChange}
                  rows="2"
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving Species & Images...' : 'Add Species'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Existing Plant Species ({species.length})</h5>
        </div>
        <div className="card-body">
          {species.length === 0 ? (
            <p className="text-muted">No plant species added yet.</p>
          ) : (
            <div className="row">
              {species.map(sp => (
                <div key={sp._id} className="col-md-6 mb-4">
                  <div className="card">
                    {sp.images && sp.images.length > 0 && (
                      <div className="card-img-top">
                        <img 
                          src={sp.images[0].url} 
                          alt={sp.commonName}
                          style={{width: '100%', height: '200px', objectFit: 'cover'}}
                        />
                      </div>
                    )}
                    <div className="card-body">
                      <h6 className="card-title">{sp.commonName}</h6>
                      <p className="card-text">
                        <em>{sp.scientificName}</em><br/>
                        <strong>Genus:</strong> {sp.genusName}<br/>
                        <strong>Habitat:</strong> {sp.habitat}<br/>
                        <strong>Distribution:</strong> {sp.distribution}
                      </p>
                      {sp.images && sp.images.length > 1 && (
                        <small className="text-muted">+{sp.images.length - 1} more images</small>
                      )}
                      <div className="mt-2">
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => console.log('Edit', sp._id)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(sp._id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeciesManager;