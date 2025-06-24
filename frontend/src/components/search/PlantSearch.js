import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PlantSearch.css';

const PlantSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      
      try {
        // In a real implementation, you would call your backend API
        // For now, we'll use mock data
        
        // Mock data - in production, replace with API call
        const mockData = [
          { id: '1', name: 'Fabaceae', type: 'family' },
          { id: '2', name: 'Poaceae', type: 'family' },
          { id: '3', name: 'Solanaceae', type: 'family' },
          { id: '4', name: 'Acacia', type: 'genus', familyId: '1', familyName: 'Fabaceae' },
          { id: '5', name: 'Dalbergia', type: 'genus', familyId: '1', familyName: 'Fabaceae' }
        ];
        
        const filteredResults = mockData.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name));
        
        setSuggestions(filteredResults);
        
        // When API is ready, use this:
        // const response = await axios.get(`http://localhost:5000/api/search?term=${searchTerm}`);
        // setSuggestions(response.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    
    // Navigate based on suggestion type
    if (suggestion.type === 'family') {
      // Navigate to genus identification with selected family
      navigate('/plant-identification', { 
        state: { 
          selectedFamily: suggestion,
          level: 'genus'
        }
      });
    } else if (suggestion.type === 'genus') {
      // Navigate to species identification with selected genus and its family
      navigate('/plant-identification', { 
        state: { 
          selectedFamily: { id: suggestion.familyId, name: suggestion.familyName },
          selectedGenus: suggestion,
          level: 'species'
        }
      });
    }
  };

  return (
    <div className="plant-search-container" ref={searchContainerRef}>
      <div className="search-input-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search for plant family or genus..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
        />
        <button className="search-button">
          <i className="bi bi-search"></i>
        </button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li 
              key={`${suggestion.type}-${suggestion.id}`} 
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <span className="suggestion-name">{suggestion.name}</span>
              <span className="suggestion-type">{suggestion.type === 'family' ? 'Family' : 'Genus'}</span>
            </li>
          ))}
        </ul>
      )}
      
      {isLoading && (
        <div className="suggestions-loading">
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span className="ms-2">Loading...</span>
        </div>
      )}
      
      {showSuggestions && !isLoading && searchTerm.length >= 2 && suggestions.length === 0 && (
        <div className="no-suggestions">
          No matches found
        </div>
      )}
    </div>
  );
};

export default PlantSearch;