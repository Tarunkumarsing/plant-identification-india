const express = require('express');
const router = express.Router();
const Genus = require('../models/Genus');

// @route   GET api/genera
// @desc    Get all genera
// @access  Public
router.get('/', async (req, res) => {
  try {
    const genera = await Genus.find().sort({ name: 1 });
    res.json(genera);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/genera/:id
// @desc    Get genus by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const genus = await Genus.findById(req.params.id);
    
    if (!genus) {
      return res.status(404).json({ msg: 'Genus not found' });
    }
    
    res.json(genus);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Genus not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/genera/family/:familyId
// @desc    Get all genera by family ID
// @access  Public
router.get('/family/:familyId', async (req, res) => {
  try {
    const genera = await Genus.find({ familyId: req.params.familyId }).sort({ name: 1 });
    res.json(genera);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;