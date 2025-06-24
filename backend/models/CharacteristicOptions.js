const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacteristicOptionsSchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  options: [String]
});

module.exports = mongoose.model('CharacteristicOptions', CharacteristicOptionsSchema);