const express = require('express');
const router = express.Router();
const Species = require('../models/Species');

// @route   GET api/species
// @desc    Get all species
// @access  Public
router.get('/', async (req, res) => {
  try {
    const species = await Species.find().sort({ name: 1 });
    res.json(species);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/species/:id
// @desc    Get species by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const species = await Species.findById(req.params.id);
    
    if (!species) {
      return res.status(404).json({ msg: 'Species not found' });
    }
    
    res.json(species);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Species not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/species/genus/:genusId
// @desc    Get all species by genus ID
// @access  Public
router.get('/genus/:genusId', async (req, res) => {
  try {
    const species = await Species.find({ genusId: req.params.genusId }).sort({ name: 1 });
    res.json(species);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;