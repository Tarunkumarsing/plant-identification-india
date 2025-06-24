const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpeciesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  genusId: {
    type: Schema.Types.ObjectId,
    ref: 'Genus',
    required: true
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
  hasSubspecies: {
    type: Boolean,
    default: false
  },
  subspeciesPdfUrl: String,
  description: String,
  images: [String],
  detailedInfo: {
    commonNames: [String],
    uses: String,
    ecology: String,
    additionalInfo: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Species', SpeciesSchema);