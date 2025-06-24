const express = require('express');
const router = express.Router();
const Family = require('../models/Family');
const Genus = require('../models/Genus');
const Species = require('../models/Species');

// @route   POST api/identify/family
// @desc    Identify plant family based on characteristics
// @access  Public
router.post('/family', async (req, res) => {
  try {
    const { selections } = req.body;
    
    if (!selections || Object.keys(selections).length === 0) {
      return res.status(400).json({ msg: 'Please provide selection criteria' });
    }
    
    // Build query based on selections
    const query = {};
    
    // For each category with selected options, find families that match ANY of the options
    for (const [category, options] of Object.entries(selections)) {
      if (options && options.length > 0) {
        const fieldPath = `characteristics.${category.toLowerCase()}`;
        query[fieldPath] = { $in: options };
      }
    }
    
    // Find matching families
    const families = await Family.find(query).select('name description');
    
    res.json(families);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/identify/genus/:familyId
// @desc    Identify plant genus based on characteristics within a family
// @access  Public
router.post('/genus/:familyId', async (req, res) => {
  try {
    const { selections } = req.body;
    const { familyId } = req.params;
    
    if (!selections || Object.keys(selections).length === 0) {
      return res.status(400).json({ msg: 'Please provide selection criteria' });
    }
    
    // Build query based on selections and family
    let query = { familyId };
    
    // For each category with selected options
    for (const [category, options] of Object.entries(selections)) {
      if (options && options.length > 0) {
        const fieldPath = `characteristics.${category.toLowerCase()}`;
        query[fieldPath] = { $in: options };
      }
    }
    
    // Find matching genera
    const genera = await Genus.find(query).select('name description');
    
    res.json(genera);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/identify/species/:genusId
// @desc    Identify plant species based on characteristics within a genus
// @access  Public
router.post('/species/:genusId', async (req, res) => {
  try {
    const { selections } = req.body;
    const { genusId } = req.params;
    
    if (!selections || Object.keys(selections).length === 0) {
      return res.status(400).json({ msg: 'Please provide selection criteria' });
    }
    
    // Build query based on selections and genus
    let query = { genusId };
    
    // For each category with selected options
    for (const [category, options] of Object.entries(selections)) {
      if (options && options.length > 0) {
        const fieldPath = `characteristics.${category.toLowerCase()}`;
        query[fieldPath] = { $in: options };
      }
    }
    
    // Find matching species
    const species = await Species.find(query).select('name hasSubspecies subspeciesPdfUrl detailedInfo');
    
    res.json(species);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;