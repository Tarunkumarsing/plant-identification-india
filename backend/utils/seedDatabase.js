const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// Models
const Family = require('../models/Family');
const Genus = require('../models/Genus');
const Species = require('../models/Species');
const CharacteristicOptions = require('../models/CharacteristicOptions');

// Sample data for characteristics options
const characteristicOptionsData = [
  {
    category: 'habit',
    options: ['Tree', 'Shrub', 'Herb', 'Climber', 'Liana', 'Epiphyte', 'Aquatic', 'Succulent', 'Parasite']
  },
  {
    category: 'roots',
    options: ['Tap root', 'Fibrous', 'Prop', 'Stilt', 'Buttress', 'Aerial', 'Tuberous', 'Rhizomatous', 'Adventitious']
  },
  {
    category: 'stem',
    options: ['Erect', 'Prostrate', 'Decumbent', 'Ascending', 'Woody', 'Herbaceous', 'Succulent', 'Rhizomatous', 'Stoloniferous', 'Bulbous', 'Modified']
  },
  {
    category: 'leaves',
    options: ['Simple', 'Compound', 'Pinnate', 'Bipinnate', 'Palmate', 'Scale-like', 'Needle-like', 'Linear', 'Lanceolate', 'Ovate', 'Cordate', 'Oblong']
  },
  {
    category: 'stipules',
    options: ['Present', 'Absent', 'Modified', 'Spiny', 'Leaf-like', 'Sheathing', 'Interpetiolar', 'Intrapetiolar']
  },
  {
    category: 'inflorescences',
    options: ['Solitary', 'Raceme', 'Spike', 'Panicle', 'Umbel', 'Catkin', 'Corymb', 'Cyme', 'Capitulum', 'Thyrse', 'Spadix']
  },
  {
    category: 'flowers',
    options: ['Regular', 'Irregular', 'Complete', 'Incomplete', 'Perfect', 'Imperfect', 'Unisexual', 'Bisexual', 'Monoecious', 'Dioecious', 'Actinomorphic', 'Zygomorphic']
  },
  {
    category: 'fruits',
    options: ['Berry', 'Drupe', 'Capsule', 'Legume', 'Nut', 'Achene', 'Pome', 'Samara', 'Schizocarp', 'Hesperidium', 'Pepo', 'Follicle']
  },
  {
    category: 'distribution',
    options: ['Himalayan', 'Western Ghats', 'Eastern Ghats', 'Gangetic Plain', 'Coastal', 'Desert', 'Semi-arid', 'Tropical', 'Subtropical', 'Temperate', 'Alpine']
  }
];

// Sample family data
const familiesData = [
  {
    name: 'Fabaceae',
    characteristics: {
      habit: ['Tree', 'Shrub', 'Herb', 'Climber'],
      roots: ['Tap root'],
      stem: ['Erect', 'Woody', 'Herbaceous'],
      leaves: ['Compound', 'Pinnate', 'Bipinnate'],
      stipules: ['Present', 'Modified'],
      inflorescences: ['Raceme', 'Panicle', 'Solitary'],
      flowers: ['Regular', 'Irregular', 'Complete'],
      fruits: ['Legume', 'Pod'],
      distribution: ['Himalayan', 'Western Ghats', 'Gangetic Plain']
    },
    description: 'The legume family, one of the largest plant families. Known for nitrogen-fixing nodules.'
  },
  {
    name: 'Poaceae',
    characteristics: {
      habit: ['Herb'],
      roots: ['Fibrous'],
      stem: ['Erect', 'Herbaceous', 'Modified'],
      leaves: ['Simple', 'Linear'],
      stipules: ['Modified'],
      inflorescences: ['Spike', 'Panicle'],
      flowers: ['Incomplete', 'Perfect', 'Imperfect'],
      fruits: ['Caryopsis'],
      distribution: ['Himalayan', 'Gangetic Plain', 'Coastal', 'Desert']
    },
    description: 'The grass family, economically important as food crops and forage.'
  },
  {
    name: 'Solanaceae',
    characteristics: {
      habit: ['Herb', 'Shrub'],
      roots: ['Tap root'],
      stem: ['Erect', 'Herbaceous', 'Woody'],
      leaves: ['Simple', 'Alternate'],
      stipules: ['Absent'],
      inflorescences: ['Solitary', 'Cyme'],
      flowers: ['Regular', 'Complete', 'Perfect'],
      fruits: ['Berry', 'Capsule'],
      distribution: ['Himalayan', 'Western Ghats', 'Gangetic Plain']
    },
    description: 'The nightshade family, many members contain potent alkaloids.'
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    try {
      // Clear existing data
      await CharacteristicOptions.deleteMany({});
      await Species.deleteMany({});
      await Genus.deleteMany({});
      await Family.deleteMany({});
      
      console.log('Database cleared');
      
      // Insert characteristic options
      const options = await CharacteristicOptions.insertMany(characteristicOptionsData);
      console.log(`${options.length} characteristic options inserted`);
      
      // Insert families
      const families = await Family.insertMany(familiesData);
      console.log(`${families.length} families inserted`);
      
      // Sample genera data for Fabaceae
      const fabaceae = families.find(f => f.name === 'Fabaceae');
      
      const generaData = [
        {
          name: 'Acacia',
          familyId: fabaceae._id,
          characteristics: {
            habit: ['Tree', 'Shrub'],
            roots: ['Tap root'],
            stem: ['Woody', 'Erect'],
            leaves: ['Bipinnate'],
            stipules: ['Modified', 'Spiny'],
            inflorescences: ['Raceme'],
            flowers: ['Regular', 'Complete'],
            fruits: ['Legume'],
            distribution: ['Western Ghats', 'Desert']
          },
          description: 'A genus of shrubs and trees belonging to the subfamily Mimosoideae of the family Fabaceae.'
        },
        {
          name: 'Dalbergia',
          familyId: fabaceae._id,
          characteristics: {
            habit: ['Tree'],
            roots: ['Tap root'],
            stem: ['Woody', 'Erect'],
            leaves: ['Pinnate'],
            stipules: ['Present'],
            inflorescences: ['Panicle'],
            flowers: ['Irregular', 'Complete'],
            fruits: ['Legume'],
            distribution: ['Himalayan', 'Western Ghats']
          },
          description: 'A genus of small to medium-sized trees, including the Indian Rosewood.'
        }
      ];
      
      // Insert genera
      const genera = await Genus.insertMany(generaData);
      console.log(`${genera.length} genera inserted`);
      
      // Sample species data for Acacia
      const acacia = genera.find(g => g.name === 'Acacia');
      
      const speciesData = [
        {
          name: 'Acacia nilotica',
          genusId: acacia._id,
          characteristics: {
            habit: ['Tree'],
            roots: ['Tap root'],
            stem: ['Woody', 'Erect'],
            leaves: ['Bipinnate'],
            stipules: ['Modified', 'Spiny'],
            inflorescences: ['Raceme'],
            flowers: ['Regular', 'Complete'],
            fruits: ['Legume'],
            distribution: ['Desert', 'Western Ghats']
          },
          hasSubspecies: true,
          subspeciesPdfUrl: '/pdfs/acacia_nilotica_subspecies.pdf',
          description: 'Commonly known as Babul or Kikar. A medium-sized thorny tree native to Africa and the Indian subcontinent.',
          detailedInfo: {
            commonNames: ['Babul', 'Kikar', 'Black Acacia'],
            uses: 'The bark is used for tanning and dyeing. The gum is used in traditional medicine.',
            ecology: 'Grows in arid, semi-arid regions. Drought resistant.'
          }
        },
        {
          name: 'Acacia catechu',
          genusId: acacia._id,
          characteristics: {
            habit: ['Tree'],
            roots: ['Tap root'],
            stem: ['Woody', 'Erect'],
            leaves: ['Bipinnate'],
            stipules: ['Spiny'],
            inflorescences: ['Raceme'],
            flowers: ['Regular', 'Complete'],
            fruits: ['Legume'],
            distribution: ['Himalayan', 'Western Ghats']
          },
          hasSubspecies: false,
          description: 'Known as Khair. A deciduous thorny tree with dark brown bark.',
          detailedInfo: {
            commonNames: ['Khair', 'Cutch Tree', 'Black Catechu'],
            uses: 'Wood extract used in Ayurveda. Source of Katha used in paan (betel leaf preparation).',
            ecology: 'Found in dry deciduous forests. Can grow on poor soil.'
          }
        }
      ];
      
      // Insert species
      const species = await Species.insertMany(speciesData);
      console.log(`${species.length} species inserted`);
      
      console.log('Database seeding completed successfully');
      mongoose.disconnect();
    } catch (error) {
      console.error('Error seeding database:', error);
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });