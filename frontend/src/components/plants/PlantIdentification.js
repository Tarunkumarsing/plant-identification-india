import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import '../../styles/PlantIdentification.css';

// Categories for plant identification
const categories = [
  'Habit', 'Roots', 'Stem', 'Leaves', 'Stipules', 
  'Inflorescences', 'Flowers', 'Fruits', 'Distribution'
];

const PlantIdentification = () => {
  const location = useLocation();
  const initialState = location.state || {};
  
  // Store options for each category
  const [options, setOptions] = useState({});
  // Store user selections
  const [selections, setSelections] = useState({});
  // Current level (family, genus, species)
  const [level, setLevel] = useState(initialState.level || 'family');
  // Store results
  const [results, setResults] = useState(null);
  // Loading state
  const [loading, setLoading] = useState(false);
  // Error state
  const [error, setError] = useState('');
  // Selected items from results for next levels
  const [selectedFamily, setSelectedFamily] = useState(initialState.selectedFamily || null);
  const [selectedGenus, setSelectedGenus] = useState(initialState.selectedGenus || null);

  // Fetch options for all categories when component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // In a real app, we would fetch from our backend API
        // For now, let's use mock data for immediate development
        const mockOptions = {
          'Habit': ['Tree', 'Shrub', 'Herb', 'Climber', 'Liana', 'Epiphyte'],
          'Roots': ['Tap root', 'Fibrous', 'Prop', 'Stilt', 'Buttress', 'Aerial'],
          'Stem': ['Erect', 'Prostrate', 'Decumbent', 'Ascending', 'Woody', 'Herbaceous'],
          'Leaves': ['Simple', 'Compound', 'Pinnate', 'Bipinnate', 'Palmate', 'Scale-like'],
          'Stipules': ['Present', 'Absent', 'Modified', 'Spiny', 'Leaf-like'],
          'Inflorescences': ['Solitary', 'Raceme', 'Spike', 'Panicle', 'Umbel', 'Catkin'],
          'Flowers': ['Regular', 'Irregular', 'Complete', 'Incomplete', 'Perfect', 'Imperfect'],
          'Fruits': ['Berry', 'Drupe', 'Capsule', 'Legume', 'Nut', 'Achene', 'Pome'],
          'Distribution': ['Himalayan', 'Western Ghats', 'Eastern Ghats', 'Gangetic Plain', 'Coastal', 'Desert']
        };
        
        setOptions(mockOptions);
        
        // Uncomment this when your backend is ready
        // const response = await axios.get('http://localhost:5000/api/characteristic-options');
        // setOptions(response.data);
      } catch (err) {
        console.error('Error fetching options:', err);
        setError('Failed to load plant characteristics. Please try again later.');
      }
    };
    
    fetchOptions();
  }, []);

  // Handle checkbox selection
  const handleOptionChange = (category, option, isChecked) => {
    setSelections(prev => {
      const categorySelections = prev[category] || [];
      
      if (isChecked) {
        return { ...prev, [category]: [...categorySelections, option] };
      } else {
        return { ...prev, [category]: categorySelections.filter(item => item !== option) };
      }
    });
  };

  // Submit selections for identification
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, make an API call to your backend
      // For now, simulate API response with mock data
      setTimeout(() => {
        let mockResults;
        
        if (level === 'family') {
          mockResults = [
            { id: '1', name: 'Fabaceae', description: 'The legume family, one of the largest plant families.' },
            { id: '2', name: 'Poaceae', description: 'The grass family, includes cereals and bamboos.' },
            { id: '3', name: 'Solanaceae', description: 'The nightshade family, includes potatoes and tomatoes.' }
          ];
        } else if (level === 'genus') {
          mockResults = [
            { id: '1', name: 'Acacia', description: 'Trees and shrubs with thorns and compound leaves.' },
            { id: '2', name: 'Dalbergia', description: 'Trees known for their valuable timber.' }
          ];
        } else if (level === 'species') {
          mockResults = [
            { 
              id: '1', 
              name: 'Acacia nilotica', 
              hasSubspecies: true,
              description: 'Commonly known as Babul or Kikar. A medium-sized thorny tree native to Africa and the Indian subcontinent.'
            }
          ];
        }
        
        setResults(mockResults);
        setLoading(false);
      }, 1000);
      
      // Uncomment when your backend is ready
      // let endpoint;
      // if (level === 'family') {
      //   endpoint = 'http://localhost:5000/api/identify/family';
      // } else if (level === 'genus') {
      //   endpoint = `http://localhost:5000/api/identify/genus/${selectedFamily.id}`;
      // } else {
      //   endpoint = `http://localhost:5000/api/identify/species/${selectedGenus.id}`;
      // }
      // 
      // const response = await axios.post(endpoint, { selections });
      // setResults(response.data);
    } catch (err) {
      console.error('Error identifying plant:', err);
      setError('Failed to identify plant. Please try again.');
      setLoading(false);
    }
  };

  // Handle selection of a result item to move to next level
  const handleResultSelection = (item) => {
    if (level === 'family') {
      setSelectedFamily(item);
      setLevel('genus');
    } else if (level === 'genus') {
      setSelectedGenus(item);
      setLevel('species');
    }
    
    // Reset selections for the next level
    setSelections({});
    setResults(null);
  };

  return (
    <div className="plant-identification-container">
      <h1 className="text-center mb-4">Plant Identification Keys</h1>
      
      {selectedFamily && level !== 'family' && (
        <div className="alert alert-success mb-4">
          <h4 className="mb-0">Selected Family: {selectedFamily.name}</h4>
        </div>
      )}
      
      {selectedGenus && level === 'species' && (
        <div className="alert alert-success mb-4">
          <h4 className="mb-0">Selected Genus: {selectedGenus.name}</h4>
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0">
            {level === 'family' 
              ? 'Identify Plant Family' 
              : level === 'genus' 
                ? 'Identify Plant Genus' 
                : 'Identify Plant Species'}
          </h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          {!results ? (
            <div className="selection-form">
              <p className="instruction">Select characteristics below:</p>
              
              {categories.map(category => (
                <div key={category} className="category-section card mb-3">
                  <div className="card-header bg-light">
                    <h3 className="mb-0 h5">{category}</h3>
                  </div>
                  <div className="card-body">
                    <div className="options-list">
                      {options[category]?.map(option => (
                        <div key={option} className="form-check option-item">
                          <input
                            className="form-check-input" 
                            type="checkbox"
                            id={`${category}-${option}`}
                            onChange={(e) => handleOptionChange(category, option, e.target.checked)}
                            checked={selections[category]?.includes(option) || false}
                          />
                          <label className="form-check-label" htmlFor={`${category}-${option}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                className="btn btn-success submit-btn"
                onClick={handleSubmit}
                disabled={loading || Object.keys(selections).length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : 'Identify'}
              </button>
            </div>
          ) : (
            <div className="results-section">
              <h3>Identification Results</h3>
              {results.length > 0 ? (
                <div className="results-list">
                  {level === 'species' ? (
                    <div className="species-details card">
                      <div className="card-body">
                        <h3 className="card-title">{results[0].name}</h3>
                        <p className="card-text">{results[0].description}</p>
                        {results[0].hasSubspecies && (
                          <button className="btn btn-outline-success">
                            View Subspecies Information (PDF)
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    results.map(item => (
                      <div 
                        key={item.id} 
                        className="result-item card mb-2" 
                        onClick={() => handleResultSelection(item)}
                      >
                        <div className="card-body">
                          <h4 className="card-title">{item.name}</h4>
                          <p className="card-text">{item.description}</p>
                          <span className="view-details text-success">
                            <i className="bi bi-arrow-right"></i> Select to continue identification
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="alert alert-warning">
                  No matches found based on selected characteristics. Try different selections.
                </div>
              )}
              
              <button 
                className="btn btn-secondary mt-3"
                onClick={() => setResults(null)}
              >
                Back to Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantIdentification;