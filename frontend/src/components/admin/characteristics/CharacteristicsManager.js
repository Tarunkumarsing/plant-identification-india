import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CharacteristicsManager = () => {
  const [characteristics, setCharacteristics] = useState([]);
  const [newCharacteristic, setNewCharacteristic] = useState({
    category: '',
    name: '',
    description: '',
    values: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    'Habit',
    'Leaf Shape',
    'Leaf Arrangement',
    'Leaf Margin',
    'Flower Color',
    'Flower Shape',
    'Fruit Type',
    'Root Type',
    'Bark Type',
    'Other'
  ];

  // Mock data
  useEffect(() => {
    setCharacteristics([
      {
        id: 1,
        category: 'Habit',
        name: 'Plant Growth Form',
        description: 'Overall growth pattern and structure of the plant',
        values: 'Tree, Shrub, Herb, Climber, Creeper'
      },
      {
        id: 2,
        category: 'Leaf Shape',
        name: 'Leaf Blade Shape',
        description: 'The overall shape of the leaf blade',
        values: 'Linear, Lanceolate, Ovate, Obovate, Elliptic, Round, Heart-shaped'
      },
      {
        id: 3,
        category: 'Flower Color',
        name: 'Primary Flower Color',
        description: 'The dominant color of the flower',
        values: 'White, Yellow, Red, Pink, Purple, Blue, Orange, Green'
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    setNewCharacteristic({
      ...newCharacteristic,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const characteristicToAdd = {
      ...newCharacteristic,
      id: characteristics.length + 1
    };
    setCharacteristics([...characteristics, characteristicToAdd]);
    setNewCharacteristic({ category: '', name: '', description: '', values: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setCharacteristics(characteristics.filter(char => char.id !== id));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Plant Characteristics Management</h2>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Characteristic'}
          </button>
          <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Add New Plant Characteristic</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    name="category"
                    value={newCharacteristic.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Characteristic Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newCharacteristic.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newCharacteristic.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Possible Values (comma-separated)</label>
                <textarea
                  className="form-control"
                  name="values"
                  value={newCharacteristic.values}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g., Red, Blue, Yellow, White"
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Characteristic</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Existing Plant Characteristics ({characteristics.length})</h5>
        </div>
        <div className="card-body">
          {characteristics.length === 0 ? (
            <p className="text-muted">No plant characteristics added yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Possible Values</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {characteristics.map(char => (
                    <tr key={char.id}>
                      <td><span className="badge bg-secondary">{char.category}</span></td>
                      <td>{char.name}</td>
                      <td>{char.description}</td>
                      <td>{char.values}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => console.log('Edit', char.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(char.id)}
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

export default CharacteristicsManager;