const express = require('express');
const router = express.Router();
const Family = require('../models/Family');

// @route   GET api/families
// @desc    Get all families
// @access  Public
router.get('/', async (req, res) => {
  try {
    const families = await Family.find().sort({ name: 1 });
    res.json(families);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/families/:id
// @desc    Get family by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    
    if (!family) {
      return res.status(404).json({ msg: 'Family not found' });
    }
    
    res.json(family);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Family not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;