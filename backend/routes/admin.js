const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Family = require('../models/Family');
const Genus = require('../models/Genus');
const Species = require('../models/Species');
const CharacteristicOption = require('../models/CharacteristicOption');

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const families = await Family.countDocuments();
    const genera = await Genus.countDocuments();
    const species = await Species.countDocuments();
    const characteristics = await CharacteristicOption.countDocuments();
    
    res.json({
      families,
      genera,
      species,
      characteristics
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all families
router.get('/families', auth, async (req, res) => {
  try {
    const families = await Family.find().sort({ name: 1 });
    res.json(families);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get single family
router.get('/families/:id', auth, async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }
    
    res.json(family);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Family not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Create family
router.post('/families', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if family exists
    let family = await Family.findOne({ name });
    if (family) {
      return res.status(400).json({ message: 'Family already exists' });
    }
    
    family = new Family({
      name,
      description
    });
    
    await family.save();
    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update family
router.put('/families/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if family exists
    let family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }
    
    // Check if new name already exists (except for this family)
    if (name !== family.name) {
      const existingFamily = await Family.findOne({ name });
      if (existingFamily) {
        return res.status(400).json({ message: 'A family with this name already exists' });
      }
    }
    
    family.name = name;
    family.description = description;
    
    await family.save();
    res.json(family);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Family not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete family
router.delete('/families/:id', auth, async (req, res) => {
  try {
    // Get all genera in the family to delete dependent species
    const genera = await Genus.find({ familyId: req.params.id });
    
    // Delete species in each genus
    for (const genus of genera) {
      await Species.deleteMany({ genusId: genus._id });
    }
    
    // Delete all genera in the family
    await Genus.deleteMany({ familyId: req.params.id });
    
    // Delete the family
    const family = await Family.findByIdAndRemove(req.params.id);
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }
    
    res.json({ message: 'Family deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Family not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Similar routes for genera and species...
// For brevity, I've only included the family routes as examples
// The genera and species routes would follow a similar pattern

// Get all characteristic options
router.get('/characteristics', auth, async (req, res) => {
  try {
    const characteristics = await CharacteristicOption.find();
    
    // Format as object with category names as keys
    const result = {};
    characteristics.forEach(char => {
      if (!result[char.category]) {
        result[char.category] = [];
      }
      result[char.category].push(char.option);
    });
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add characteristic option
router.post('/characteristics', auth, async (req, res) => {
  try {
    const { category, option } = req.body;
    
    // Check if option exists
    let characteristic = await CharacteristicOption.findOne({ category, option });
    if (characteristic) {
      return res.status(400).json({ message: 'Option already exists in this category' });
    }
    
    characteristic = new CharacteristicOption({
      category,
      option
    });
    
    await characteristic.save();
    res.json(characteristic);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete characteristic option
router.delete('/characteristics', auth, async (req, res) => {
  try {
    const { category, option } = req.body;
    
    // Find and delete the option
    const characteristic = await CharacteristicOption.findOneAndRemove({ category, option });
    
    if (!characteristic) {
      return res.status(404).json({ message: 'Option not found' });
    }
    
    res.json({ message: 'Option deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;