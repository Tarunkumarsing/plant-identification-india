import React from 'react';
import '../../styles/PlantGlossary.css';

const PlantGlossary = () => {
  // Sample glossary terms
  const glossaryTerms = [
    {
      term: 'Bipinnate',
      definition: 'A leaf that is twice pinnate, with the leaflets arranged on secondary axes that are attached to the main axis.',
      category: 'Leaves'
    },
    {
      term: 'Compound Leaf',
      definition: 'A leaf composed of two or more leaflets attached to a single stem or petiole.',
      category: 'Leaves'
    },
    {
      term: 'Drupe',
      definition: 'A fleshy fruit with a central stone containing the seed (e.g., peach, plum, cherry).',
      category: 'Fruits'
    },
    {
      term: 'Epiphyte',
      definition: 'A plant that grows on another plant but is not parasitic, such as various ferns, orchids, and bromeliads.',
      category: 'Habit'
    },
    {
      term: 'Inflorescence',
      definition: 'The flowering part of a plant; the arrangement of flowers on the floral axis.',
      category: 'Flowers'
    },
    {
      term: 'Panicle',
      definition: 'A branched racemose inflorescence with flowers maturing from the bottom upwards.',
      category: 'Inflorescences'
    }
  ];

  // Group terms by category
  const categorizedTerms = glossaryTerms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = [];
    }
    acc[term.category].push(term);
    return acc;
  }, {});

  // Sort categories alphabetically
  const sortedCategories = Object.keys(categorizedTerms).sort();

  return (
    <div className="plant-glossary-container">
      <h1 className="text-center mb-4">Plant Glossary</h1>
      <p className="lead text-center mb-5">
        Learn botanical terms to help identify and understand plant structures.
      </p>

      <div className="glossary-content">
        {sortedCategories.map(category => (
          <div key={category} className="category-section mb-4">
            <h2 className="category-title">{category}</h2>
            <div className="card">
              <ul className="list-group list-group-flush">
                {categorizedTerms[category].map(item => (
                  <li key={item.term} className="list-group-item">
                    <h5 className="term-title">{item.term}</h5>
                    <p className="term-definition">{item.definition}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantGlossary;