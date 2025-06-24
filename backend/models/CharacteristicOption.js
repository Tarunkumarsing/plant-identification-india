const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacteristicOptionSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  option: {
    type: String,
    required: true
  }
});

CharacteristicOptionSchema.index({ category: 1, option: 1 }, { unique: true });

module.exports = mongoose.model('CharacteristicOption', CharacteristicOptionSchema);