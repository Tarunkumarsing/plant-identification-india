const express = require('express');
const router = express.Router();
const CharacteristicOptions = require('../models/CharacteristicOptions');

// @route   GET api/characteristic-options
// @desc    Get all characteristic options
// @access  Public
router.get('/', async (req, res) => {
  try {
    const options = await CharacteristicOptions.find();
    
    // Convert to a more convenient format for frontend
    const formattedOptions = {};
    options.forEach(option => {
      // Convert the category name to title case for display
      const categoryName = option.category.charAt(0).toUpperCase() + option.category.slice(1);
      formattedOptions[categoryName] = option.options;
    });
    
    res.json(formattedOptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;