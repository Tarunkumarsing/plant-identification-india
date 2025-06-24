const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  characteristics: {
    habit: [String],
    roots: [String],
    stem: [String],
    leaves: [String],
    stipules: [String],
    inflorescences: [String],
    flowers: [String],
    fruits: [String],
    distribution: [String]
  },
  description: String,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Family', FamilySchema);