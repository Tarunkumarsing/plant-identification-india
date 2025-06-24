const express = require('express');
const router = express.Router();
const Family = require('../models/Family');
const Genus = require('../models/Genus');

// @route   GET api/search
// @desc    Search for families and genera by name
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term || term.trim().length < 2) {
      return res.json([]);
    }
    
    // Search for families
    const families = await Family.find({
      name: { $regex: term, $options: 'i' }
    }).select('name').limit(5);
    
    // Search for genera
    const genera = await Genus.find({
      name: { $regex: term, $options: 'i' }
    }).select('name familyId').limit(5).populate('familyId', 'name');
    
    // Format results
    const familyResults = families.map(family => ({
      id: family._id,
      name: family.name,
      type: 'family'
    }));
    
    const genusResults = genera.map(genus => ({
      id: genus._id,
      name: genus.name,
      type: 'genus',
      familyId: genus.familyId._id,
      familyName: genus.familyId.name
    }));
    
    // Combine results and sort alphabetically
    const results = [...familyResults, ...genusResults].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;