import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from '../../components/CustomCursor';
import NavigationBar from '../../components/NavigationBar';
import dynamic from 'next/dynamic';

// Dynamically import the StarMap component to avoid SSR issues
const StarMap = dynamic(() => import('../../components/projects/StarMap'), { ssr: false });

export default function Constellation() {
  const [loading, setLoading] = useState(true);
  const [activeConstellation, setActiveConstellation] = useState(null);
  const [showStoryPanel, setShowStoryPanel] = useState(false);
  const [viewMode, setViewMode] = useState('northern'); // 'northern', 'southern', 'equatorial'
  const [season, setSeason] = useState('spring'); // 'spring', 'summer', 'autumn', 'winter'
  const [showLabels, setShowLabels] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Constellation data
  const constellations = [
    {
      id: 'ursa-major',
      name: 'Ursa Major',
      latinName: 'Ursa Major',
      meaning: 'Great Bear',
      hemisphere: 'northern',
      season: 'spring',
      stars: [
        'Dubhe', 'Merak', 'Phecda', 'Megrez', 'Alioth', 'Mizar', 'Alkaid'
      ],
      story: "Ursa Major represents the Great Bear in Greek mythology. Zeus fell in love with a beautiful nymph named Callisto. Hera, Zeus's wife, became jealous and transformed Callisto into a bear. Years later, Callisto's son Arcas nearly killed the bear while hunting, not recognizing his mother. To avoid tragedy, Zeus placed both Callisto and Arcas in the sky as Ursa Major and Ursa Minor. The constellation's most recognizable feature is the Big Dipper, which forms the bear's hindquarters and tail.",
      brightestStar: 'Alioth',
      area: '1280 square degrees',
      visibility: 'Year-round in the Northern Hemisphere',
      neighbors: ['Ursa Minor', 'Draco', 'Boötes', 'Canes Venatici']
    },
    {
      id: 'orion',
      name: 'Orion',
      latinName: 'Orion',
      meaning: 'The Hunter',
      hemisphere: 'equatorial',
      season: 'winter',
      stars: [
        'Betelgeuse', 'Rigel', 'Bellatrix', 'Mintaka', 'Alnilam', 'Alnitak', 'Saiph'
      ],
      story: "Orion depicts a mighty hunter from Greek mythology. Born to Poseidon, Orion was a giant with extraordinary hunting skills. His boast that he could kill any creature on Earth angered Gaia, who sent a scorpion to defeat him. After his death, he was placed among the stars opposite Scorpius. The constellation features the distinctive three-star belt of Orion, as well as the Orion Nebula. Betelgeuse marks his right shoulder, while Rigel represents his left foot.",
      brightestStar: 'Rigel',
      area: '594 square degrees',
      visibility: 'Visible worldwide from November to February',
      neighbors: ['Taurus', 'Gemini', 'Lepus', 'Eridanus', 'Monoceros']
    },
    {
      id: 'cassiopeia',
      name: 'Cassiopeia',
      latinName: 'Cassiopeia',
      meaning: 'The Queen',
      hemisphere: 'northern',
      season: 'autumn',
      stars: [
        'Schedar', 'Caph', 'Gamma Cassiopeiae', 'Ruchbah', 'Segin'
      ],
      story: "Cassiopeia represents the vain queen from Greek mythology who boasted that she and her daughter Andromeda were more beautiful than the Nereids, sea nymphs. This angered Poseidon, who sent a sea monster to ravage the coast of Ethiopia. To appease the monster, Andromeda was chained to a rock as a sacrifice, but was rescued by Perseus. Cassiopeia was placed in the sky as punishment, doomed to circle the celestial pole forever, sometimes hanging upside down in an undignified position. The constellation forms a distinctive W or M shape.",
      brightestStar: 'Schedar',
      area: '598 square degrees',
      visibility: 'Year-round in the Northern Hemisphere',
      neighbors: ['Cepheus', 'Andromeda', 'Perseus', 'Camelopardalis']
    },
    {
      id: 'cygnus',
      name: 'Cygnus',
      latinName: 'Cygnus',
      meaning: 'The Swan',
      hemisphere: 'northern',
      season: 'summer',
      stars: [
        'Deneb', 'Albireo', 'Sadr', 'Delta Cygni', 'Gienah'
      ],
      story: "Cygnus depicts a swan flying along the Milky Way. In Greek mythology, it is associated with several stories. One tells of Zeus transforming himself into a swan to seduce Leda, Queen of Sparta. Another relates to Orpheus, who was transformed into a swan after his death and placed in the sky next to his lyre (the constellation Lyra). The constellation forms a distinctive cross pattern, often called the Northern Cross, with Deneb marking the tail and Albireo the beak of the swan.",
      brightestStar: 'Deneb',
      area: '804 square degrees',
      visibility: 'Best visible in summer and autumn in the Northern Hemisphere',
      neighbors: ['Lyra', 'Draco', 'Cepheus', 'Pegasus', 'Vulpecula']
    },
    {
      id: 'scorpius',
      name: 'Scorpius',
      latinName: 'Scorpius',
      meaning: 'The Scorpion',
      hemisphere: 'southern',
      season: 'summer',
      stars: [
        'Antares', 'Shaula', 'Sargas', 'Dschubba', 'Larawag', 'Girtab', 'Alniyat'
      ],
      story: "Scorpius represents the scorpion that killed Orion in Greek mythology. After Orion boasted he could kill any creature, Gaia (or in some versions, Apollo) sent a scorpion to defeat him. Zeus placed both Orion and the scorpion in the sky, but on opposite sides so they would never meet again. The bright red star Antares marks the heart of the scorpion, and its name means 'rival of Mars' due to its reddish appearance. The constellation truly resembles a scorpion, with a distinctive curved tail ending in a stinger.",
      brightestStar: 'Antares',
      area: '497 square degrees',
      visibility: 'Best visible in summer months in the Southern Hemisphere',
      neighbors: ['Ophiuchus', 'Libra', 'Lupus', 'Ara', 'Sagittarius']
    },
    {
      id: 'crux',
      name: 'Crux',
      latinName: 'Crux',
      meaning: 'The Southern Cross',
      hemisphere: 'southern',
      season: 'spring',
      stars: [
        'Acrux', 'Mimosa', 'Gacrux', 'Delta Crucis', 'Epsilon Crucis'
      ],
      story: "Crux, or the Southern Cross, is the smallest of the 88 modern constellations but one of the most distinctive. Ancient Greeks could see it from Athens, considering it part of Centaurus. As the precession of the equinoxes made it invisible to most of the Northern Hemisphere, it was rediscovered by European explorers in the 16th century. It has great cultural significance in many Southern Hemisphere nations, appearing on several national flags. The constellation forms a cross with the bright star Acrux at the bottom and Gacrux at the top.",
      brightestStar: 'Acrux',
      area: '68 square degrees',
      visibility: 'Visible year-round in the Southern Hemisphere',
      neighbors: ['Centaurus', 'Musca', 'Carina']
    },
    {
      id: 'leo',
      name: 'Leo',
      latinName: 'Leo',
      meaning: 'The Lion',
      hemisphere: 'equatorial',
      season: 'spring',
      stars: [
        'Regulus', 'Denebola', 'Algieba', 'Zosma', 'Chort', 'Adhafera', 'Alterf'
      ],
      story: "Leo represents the Nemean Lion in Greek mythology, a fearsome beast with an impenetrable hide that Heracles (Hercules) had to defeat as the first of his twelve labors. After strangling the lion, Heracles used its own claws to skin it and wore its hide as armor. Zeus placed the lion among the stars to commemorate Heracles' first labor. The constellation forms a distinctive pattern resembling a crouching lion, with the bright star Regulus marking the lion's heart.",
      brightestStar: 'Regulus',
      area: '947 square degrees',
      visibility: 'Best visible in spring months',
      neighbors: ['Cancer', 'Hydra', 'Virgo', 'Coma Berenices', 'Ursa Major']
    },
    {
      id: 'pegasus',
      name: 'Pegasus',
      latinName: 'Pegasus',
      meaning: 'The Winged Horse',
      hemisphere: 'northern',
      season: 'autumn',
      stars: [
        'Markab', 'Scheat', 'Algenib', 'Enif', 'Homam', 'Matar', 'Baham'
      ],
      story: "Pegasus depicts the winged horse from Greek mythology. Born from the blood of Medusa after Perseus beheaded her, Pegasus was tamed by the hero Bellerophon with the help of Athena's golden bridle. Together they had many adventures, including defeating the Chimera. When Bellerophon attempted to fly to Mount Olympus, Zeus sent a gadfly to sting Pegasus, causing Bellerophon to fall back to Earth. Pegasus continued to Olympus, where Zeus used him to carry divine thunder and lightning. The constellation's most recognizable feature is the Great Square of Pegasus, forming the body of the horse.",
      brightestStar: 'Enif',
      area: '1121 square degrees',
      visibility: 'Best visible in autumn months in the Northern Hemisphere',
      neighbors: ['Andromeda', 'Aquarius', 'Cygnus', 'Pisces', 'Lacerta']
    },
    {
      id: 'andromeda',
      name: 'Andromeda',
      latinName: 'Andromeda',
      meaning: 'The Chained Maiden',
      hemisphere: 'northern',
      season: 'autumn',
      stars: [
        'Alpheratz', 'Mirach', 'Almach', 'Delta Andromedae', 'Mu Andromedae'
      ],
      story: "Andromeda represents the princess from Greek mythology who was chained to a rock as a sacrifice to appease the sea monster Cetus. Her mother, Queen Cassiopeia, had boasted that Andromeda was more beautiful than the Nereids, angering Poseidon. The hero Perseus rescued Andromeda and later married her. The constellation is home to the famous Andromeda Galaxy (M31), the nearest major galaxy to our Milky Way and the most distant object visible to the naked eye.",
      brightestStar: 'Alpheratz',
      area: '722 square degrees',
      visibility: 'Best visible in autumn and winter in the Northern Hemisphere',
      neighbors: ['Pegasus', 'Cassiopeia', 'Perseus', 'Lacerta', 'Triangulum']
    },
    {
      id: 'draco',
      name: 'Draco',
      latinName: 'Draco',
      meaning: 'The Dragon',
      hemisphere: 'northern',
      season: 'summer',
      stars: [
        'Etamin', 'Rastaban', 'Altais', 'Aldhibah', 'Edasich', 'Thuban', 'Grumium'
      ],
      story: "Draco represents a dragon in Greek mythology. One story identifies it as Ladon, the hundred-headed dragon that guarded the golden apples of the Hesperides, slain by Heracles as part of his twelve labors. Another associates it with the dragon killed by Cadmus before founding the city of Thebes. The constellation winds between the Big and Little Dippers. Interestingly, due to the precession of Earth's axis, Thuban (Alpha Draconis) was the North Star around 2700 BCE, a role now filled by Polaris.",
      brightestStar: 'Etamin',
      area: '1083 square degrees',
      visibility: 'Year-round in the Northern Hemisphere',
      neighbors: ['Ursa Major', 'Ursa Minor', 'Cepheus', 'Cygnus', 'Hercules']
    },
    {
      id: 'sagittarius',
      name: 'Sagittarius',
      latinName: 'Sagittarius',
      meaning: 'The Archer',
      hemisphere: 'southern',
      season: 'summer',
      stars: [
        'Kaus Australis', 'Nunki', 'Ascella', 'Kaus Media', 'Kaus Borealis', 'Alnasl', 'Sephdar'
      ],
      story: "Sagittarius depicts a centaur archer in Greek mythology, often identified as Chiron, the wise centaur who tutored many heroes. However, some accounts distinguish it as a different centaur named Crotus, son of Pan and inventor of archery. The constellation marks the direction of the center of our Milky Way galaxy and contains many notable deep-sky objects. Its stars form a pattern often called 'the Teapot,' with the Milky Way appearing as steam rising from the spout.",
      brightestStar: 'Kaus Australis',
      area: '867 square degrees',
      visibility: 'Best visible in summer months in the Southern Hemisphere',
      neighbors: ['Scorpius', 'Ophiuchus', 'Aquila', 'Capricornus', 'Scutum']
    },
    {
      id: 'aquarius',
      name: 'Aquarius',
      latinName: 'Aquarius',
      meaning: 'The Water Bearer',
      hemisphere: 'southern',
      season: 'autumn',
      stars: [
        'Sadalsuud', 'Sadalmelik', 'Sadachbia', 'Skat', 'Zeta Aquarii', 'Ancha', 'Sadaltager'
      ],
      story: "Aquarius represents the water bearer in Greek mythology, often identified as Ganymede, a beautiful youth whom Zeus abducted to serve as cupbearer to the gods. The constellation depicts a figure pouring water from a jar, which flows into the mouth of the Southern Fish (Piscis Austrinus). This water-pouring symbolism connected Aquarius to the life-giving annual floods of the Nile in ancient Egyptian astronomy. The constellation is part of the zodiac and contains the famous 'Water Jar' asterism formed by four stars.",
      brightestStar: 'Sadalsuud',
      area: '980 square degrees',
      visibility: 'Best visible in autumn months',
      neighbors: ['Pegasus', 'Pisces', 'Capricornus', 'Aquila', 'Cetus']
    }
  ];
  
  // Handle loading state
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = constellations.filter(constellation => 
      constellation.name.toLowerCase().includes(query) ||
      constellation.latinName.toLowerCase().includes(query) ||
      constellation.meaning.toLowerCase().includes(query) ||
      constellation.stars.some(star => star.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
  }, [searchQuery]);
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  // Handle constellation selection
  const handleConstellationSelect = (constellation) => {
    setActiveConstellation(constellation);
    setShowStoryPanel(true);
  };
  
  // Close story panel
  const closeStoryPanel = () => {
    setShowStoryPanel(false);
  };
  
  // Filter constellations by current view settings
  const getVisibleConstellations = () => {
    return constellations.filter(constellation => {
      if (viewMode === 'northern' && constellation.hemisphere === 'southern') {
        return false;
      }
      if (viewMode === 'southern' && constellation.hemisphere === 'northern') {
        return false;
      }
      return true;
    });
  };
  
  return (
    <div className="relative min-h-screen bg-space-black overflow-hidden">
      <Head>
        <title>Constellation | Nebula</title>
        <meta name="description" content="Interactive star map with mythological stories" />
      </Head>
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-black">
          <div className="text-center">
            <motion.div 
              className="w-24 h-24 rounded-full bg-gradient-to-r from-nebula-pink to-electric-blue mx-auto mb-6"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <h2 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink to-electric-blue">
              Loading Constellation Map
            </h2>
            <p className="text-gray-400 mt-2">Charting the celestial sphere...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="relative min-h-screen text-white">
        {/* Star Map Canvas */}
        <div className="absolute inset-0 z-0">
          <StarMap 
            viewMode={viewMode}
            season={season}
            showLabels={showLabels}
            showBoundaries={showBoundaries}
            constellations={getVisibleConstellations()}
            activeConstellation={activeConstellation}
            onConstellationSelect={handleConstellationSelect}
          />
        </div>
        
        {/* UI Overlay */}
        <div className="relative z-10 pointer-events-none">
          {/* Back Button */}
          <div className="absolute top-24 left-6 pointer-events-auto">
            <Link href="/#portfolio">
              <motion.button 
                className="px-4 py-2 rounded-full bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 text-white flex items-center"
                whileHover={{ x: -5, backgroundColor: 'rgba(61, 8, 123, 0.7)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Portfolio
              </motion.button>
            </Link>
          </div>
          
          {/* Title */}
          <motion.div 
            className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal">
              Constellation
            </h1>
            <p className="text-gray-300 mt-2">Interactive star map with mythological stories</p>
          </motion.div>
          
          {/* Toggle Controls Button */}
          <div className="absolute top-24 right-6 pointer-events-auto">
            <motion.button
              className="p-2 rounded-full bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleControls}
            >
              {showControls ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              )}
            </motion.button>
          </div>
          
          {/* Search Bar */}
          <div className="absolute top-40 right-6 pointer-events-auto w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search constellations or stars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nebula-pink"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setSearchQuery('')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 rounded-xl bg-deep-blue/70 backdrop-blur-sm border border-cosmic-purple/30 max-h-60 overflow-y-auto">
                {searchResults.map((constellation) => (
                  <motion.button
                    key={constellation.id}
                    className="w-full px-4 py-2 text-left hover:bg-cosmic-purple/30 transition-colors"
                    whileHover={{ x: 5 }}
                    onClick={() => handleConstellationSelect(constellation)}
                  >
                    <div className="font-bold">{constellation.name}</div>
                    <div className="text-xs text-gray-400">{constellation.meaning}</div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
          
          {/* Controls Panel */}
          {showControls && (
            <motion.div 
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl pointer-events-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 mx-4 rounded-xl bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* View Controls */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-electric-blue mb-2">View Controls</h3>
                    <div className="space-y-2">
                      {/* Hemisphere Selection */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 w-24">Hemisphere:</span>
                        <div className="flex space-x-1">
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${viewMode === 'northern' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('northern')}
                          >
                            Northern
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${viewMode === 'southern' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('southern')}
                          >
                            Southern
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${viewMode === 'equatorial' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('equatorial')}
                          >
                            Equatorial
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Season Selection */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 w-24">Season:</span>
                        <div className="flex space-x-1">
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${season === 'spring' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSeason('spring')}
                          >
                            Spring
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${season === 'summer' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSeason('summer')}
                          >
                            Summer
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${season === 'autumn' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSeason('autumn')}
                          >
                            Autumn
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${season === 'winter' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSeason('winter')}
                          >
                            Winter
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display Options */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-electric-blue mb-2">Display Options</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 w-24">Show:</span>
                        <div className="flex space-x-1">
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${showLabels ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowLabels(!showLabels)}
                          >
                            {showLabels ? 'Hide Labels' : 'Show Labels'}
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${showBoundaries ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowBoundaries(!showBoundaries)}
                          >
                            {showBoundaries ? 'Hide Boundaries' : 'Show Boundaries'}
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-2">
                        <p>Click on any constellation to view its mythological story and details.</p>
                        <p>Drag to rotate the star map. Scroll to zoom in and out.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Constellation List */}
                <div className="mt-4 border-t border-cosmic-purple/30 pt-4">
                  <h3 className="text-lg font-display font-bold text-electric-blue mb-2">Featured Constellations</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {getVisibleConstellations().slice(0, 8).map((constellation) => (
                      <motion.button
                        key={constellation.id}
                        className={`p-2 rounded-lg text-center ${activeConstellation?.id === constellation.id ? 'bg-cosmic-purple/50 border border-cosmic-purple' : 'bg-deep-blue/70 border border-cosmic-purple/30'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleConstellationSelect(constellation)}
                      >
                        <div className="text-sm font-bold">{constellation.name}</div>
                        <div className="text-xs text-gray-400">{constellation.meaning}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Constellation Story Panel */}
          <AnimatePresence>
            {showStoryPanel && activeConstellation && (
              <motion.div 
                className="absolute top-24 right-6 w-80 p-4 rounded-xl bg-deep-blue/70 backdrop-blur-sm border border-cosmic-purple/30 pointer-events-auto max-h-[70vh] overflow-y-auto"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button 
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  onClick={closeStoryPanel}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <h3 className="text-xl font-display font-bold text-white pr-6">{activeConstellation.name}</h3>
                <div className="text-sm text-gray-300 italic">{activeConstellation.latinName} - {activeConstellation.meaning}</div>
                
                <div className="mt-4 space-y-3">
                  <div className="text-sm">{activeConstellation.story}</div>
                  
                  <div className="border-t border-cosmic-purple/30 pt-3">
                    <h4 className="text-sm font-bold text-electric-blue">Notable Stars</h4>
                    <div className="text-sm mt-1">
                      <span className="text-gray-300">Brightest Star:</span> {activeConstellation.brightestStar}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-300">Key Stars:</span> {activeConstellation.stars.join(', ')}
                    </div>
                  </div>
                  
                  <div className="border-t border-cosmic-purple/30 pt-3">
                    <h4 className="text-sm font-bold text-electric-blue">Details</h4>
                    <div className="text-sm mt-1">
                      <span className="text-gray-300">Area:</span> {activeConstellation.area}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-300">Visibility:</span> {activeConstellation.visibility}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-300">Neighboring Constellations:</span> {activeConstellation.neighbors.join(', ')}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
