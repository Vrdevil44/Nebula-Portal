import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from '../../components/CustomCursor';
import NavigationBar from '../../components/NavigationBar';

export default function NebulaGallery() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'carousel', 'fullscreen'
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const carouselRef = useRef(null);
  
  // Generate gallery images
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
      setImages(generateGalleryImages());
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Generate mock gallery images
  const generateGalleryImages = () => {
    const imageTypes = [
      { type: 'nebula', label: 'Nebulae', count: 8 },
      { type: 'galaxy', label: 'Galaxies', count: 6 },
      { type: 'planet', label: 'Planets', count: 5 },
      { type: 'star', label: 'Stars', count: 4 },
      { type: 'moon', label: 'Moons', count: 3 }
    ];
    
    const galleryImages = [];
    let idCounter = 1;
    
    imageTypes.forEach(({ type, count }) => {
      for (let i = 1; i <= count; i++) {
        const id = idCounter++;
        const featured = id <= 5; // First 5 images are featured
        
        galleryImages.push({
          id,
          title: generateImageTitle(type, i),
          description: generateImageDescription(type),
          type,
          src: `/images/nebula_${(id % 5) + 1}.jpg`, // Use our downloaded images
          width: 1200,
          height: 800,
          photographer: generatePhotographerName(),
          date: generateRandomDate(),
          location: generateLocation(type),
          featured,
          likes: Math.floor(Math.random() * 1000),
          tags: generateTags(type)
        });
      }
    });
    
    return galleryImages;
  };
  
  // Generate image title
  const generateImageTitle = (type, index) => {
    const prefixes = {
      nebula: ['Cosmic', 'Eagle', 'Crab', 'Orion', 'Helix', 'Butterfly', 'Horsehead', 'Lagoon'],
      galaxy: ['Andromeda', 'Whirlpool', 'Triangulum', 'Sombrero', 'Pinwheel', 'Cartwheel'],
      planet: ['Jupiter', 'Saturn', 'Mars', 'Venus', 'Neptune'],
      star: ['Betelgeuse', 'Sirius', 'Vega', 'Antares'],
      moon: ['Europa', 'Titan', 'Enceladus']
    };
    
    const suffixes = {
      nebula: ['Nebula', 'Cloud', 'Formation', 'Cluster'],
      galaxy: ['Galaxy', 'System', 'Cluster'],
      planet: ['Surface', 'Atmosphere', 'Storms'],
      star: ['Prominence', 'Flare', 'System'],
      moon: ['Surface', 'Geysers', 'Terrain']
    };
    
    const prefix = prefixes[type][index % prefixes[type].length];
    const suffix = suffixes[type][index % suffixes[type].length];
    
    return `${prefix} ${suffix}`;
  };
  
  // Generate image description
  const generateImageDescription = (type) => {
    const descriptions = {
      nebula: 'A cosmic cloud of gas and dust where stars are born and die, creating spectacular formations of light and color across the vastness of space.',
      galaxy: 'A massive gravitationally bound system consisting of stars, stellar remnants, interstellar gas, dust, and dark matter, forming a distinct structure in the universe.',
      planet: 'A celestial body orbiting a star, with unique atmospheric conditions, surface features, and potential for harboring life in our cosmic neighborhood.',
      star: 'A luminous sphere of plasma held together by its own gravity, generating energy through nuclear fusion at its core and illuminating the cosmos.',
      moon: 'A natural satellite orbiting a planet, with diverse geological features shaped by impacts, tectonic activity, and the gravitational influence of its parent planet.'
    };
    
    return descriptions[type];
  };
  
  // Generate photographer name
  const generatePhotographerName = () => {
    const firstNames = ['Alex', 'Jamie', 'Casey', 'Morgan', 'Taylor', 'Jordan', 'Riley', 'Quinn'];
    const lastNames = ['Hubble', 'Webb', 'Kepler', 'Galileo', 'Sagan', 'Tyson', 'Hawking'];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };
  
  // Generate random date
  const generateRandomDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    
    return randomDate.toISOString().split('T')[0];
  };
  
  // Generate location
  const generateLocation = (type) => {
    const telescopes = ['Hubble Space Telescope', 'James Webb Space Telescope', 'Spitzer Space Telescope', 'Chandra X-ray Observatory', 'Very Large Telescope'];
    const observatories = ['Mauna Kea Observatory', 'European Southern Observatory', 'Atacama Large Millimeter Array', 'W. M. Keck Observatory'];
    
    if (type === 'planet' || type === 'moon') {
      const missions = ['Voyager Mission', 'Cassini Mission', 'New Horizons Mission', 'Mars Rover', 'Juno Mission'];
      return missions[Math.floor(Math.random() * missions.length)];
    } else {
      return Math.random() > 0.5 
        ? telescopes[Math.floor(Math.random() * telescopes.length)]
        : observatories[Math.floor(Math.random() * observatories.length)];
    }
  };
  
  // Generate tags
  const generateTags = (type) => {
    const commonTags = ['space', 'astronomy', 'cosmos'];
    const typeTags = {
      nebula: ['nebula', 'gas', 'dust', 'stars', 'formation'],
      galaxy: ['galaxy', 'stars', 'spiral', 'cluster'],
      planet: ['planet', 'atmosphere', 'solar system'],
      star: ['star', 'sun', 'stellar', 'luminous'],
      moon: ['moon', 'satellite', 'crater', 'surface']
    };
    
    return [...commonTags, ...typeTags[type]];
  };
  
  // Filter images based on selected tag
  const filteredImages = filterTag === 'all' 
    ? images 
    : images.filter(image => image.type === filterTag || image.tags.includes(filterTag));
  
  // Sort images based on selected sort option
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return b.featured - a.featured;
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });
  
  // Handle image click
  const handleImageClick = (image) => {
    setActiveImage(image);
    setViewMode('fullscreen');
  };
  
  // Close fullscreen view
  const closeFullscreen = () => {
    setViewMode('grid');
    setActiveImage(null);
  };
  
  // Navigate to next image in fullscreen
  const nextImage = () => {
    if (!activeImage) return;
    
    const currentIndex = sortedImages.findIndex(img => img.id === activeImage.id);
    const nextIndex = (currentIndex + 1) % sortedImages.length;
    setActiveImage(sortedImages[nextIndex]);
  };
  
  // Navigate to previous image in fullscreen
  const prevImage = () => {
    if (!activeImage) return;
    
    const currentIndex = sortedImages.findIndex(img => img.id === activeImage.id);
    const prevIndex = (currentIndex - 1 + sortedImages.length) % sortedImages.length;
    setActiveImage(sortedImages[prevIndex]);
  };
  
  // Toggle view mode between grid and carousel
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'carousel' : 'grid');
  };
  
  // Handle key press for navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode === 'fullscreen') {
        if (e.key === 'Escape') {
          closeFullscreen();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeImage]);
  
  return (
    <div className="relative min-h-screen bg-space-black overflow-hidden">
      <Head>
        <title>Nebula Gallery | Nebula</title>
        <meta name="description" content="Interactive showcase of celestial photography" />
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
              Loading Nebula Gallery
            </h2>
            <p className="text-gray-400 mt-2">Preparing celestial imagery...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="relative min-h-screen text-white">
        <div className="container mx-auto px-4 py-24">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            {/* Back Button */}
            <div className="mb-4 md:mb-0">
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
              className="text-center mb-4 md:mb-0"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal">
                Nebula Gallery
              </h1>
              <p className="text-gray-300 mt-2">Interactive showcase of celestial photography</p>
            </motion.div>
            
            {/* View Toggle */}
            <div className="flex space-x-2">
              <motion.button
                className="p-2 rounded-full bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleViewMode}
                title={viewMode === 'grid' ? 'Switch to Carousel View' : 'Switch to Grid View'}
              >
                {viewMode === 'grid' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Filters and Sorting */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                className={`px-3 py-1 rounded-full text-sm ${filterTag === 'all' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/50 border border-nebula-pink/50 text-nebula-pink'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag('all')}
              >
                All
              </motion.button>
              
              <motion.button
                className={`px-3 py-1 rounded-full text-sm ${filterTag === 'nebula' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/50 border border-nebula-pink/50 text-nebula-pink'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag('nebula')}
              >
                Nebulae
              </motion.button>
              
              <motion.button
                className={`px-3 py-1 rounded-full text-sm ${filterTag === 'galaxy' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/50 border border-nebula-pink/50 text-nebula-pink'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag('galaxy')}
              >
                Galaxies
              </motion.button>
              
              <motion.button
                className={`px-3 py-1 rounded-full text-sm ${filterTag === 'planet' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/50 border border-nebula-pink/50 text-nebula-pink'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag('planet')}
              >
                Planets
              </motion.button>
              
              <motion.button
                className={`px-3 py-1 rounded-full text-sm ${filterTag === 'star' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/50 border border-nebula-pink/50 text-nebula-pink'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag('star')}
              >
                Stars
              </motion.button>
              
              <motion.button
                className={`px-3 py-1 rounded-full text-sm ${filterTag === 'moon' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/50 border border-nebula-pink/50 text-nebula-pink'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag('moon')}
              >
                Moons
              </motion.button>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                className="bg-deep-blue/50 border border-cosmic-purple/30 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-nebula-pink"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          
          {/* Gallery Content */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="relative group rounded-xl overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleImageClick(image)}
                  layoutId={`image-${image.id}`}
                >
                  <div className="aspect-w-3 aspect-h-2 bg-deep-blue/50">
                    <img 
                      src={image.src} 
                      alt={image.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-xl font-display font-bold text-white">{image.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{image.photographer}</p>
                    
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-gray-400">{image.date}</span>
                      <span className="mx-2 text-gray-500">•</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-nebula-pink mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-400">{image.likes}</span>
                      </div>
                    </div>
                  </div>
                  
                  {image.featured && (
                    <div className="absolute top-2 right-2 bg-nebula-pink text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="relative" ref={carouselRef}>
              <div className="overflow-hidden rounded-xl">
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(0%)` }}>
                  {sortedImages.slice(0, 1).map((image) => (
                    <div key={image.id} className="w-full flex-shrink-0">
                      <div className="relative aspect-w-16 aspect-h-9">
                        <img 
                          src={image.src} 
                          alt={image.title}
                          className="object-cover w-full h-full"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                          <h3 className="text-3xl font-display font-bold text-white">{image.title}</h3>
                          <p className="text-gray-300 mt-2 max-w-2xl">{image.description}</p>
                          
                          <div className="flex items-center mt-4">
                            <span className="text-sm text-gray-400">{image.photographer}</span>
                            <span className="mx-2 text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{image.date}</span>
                            <span className="mx-2 text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{image.location}</span>
                          </div>
                          
                          <motion.button
                            className="mt-4 px-4 py-2 bg-nebula-pink text-white rounded-full inline-flex items-center w-fit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(image);
                            }}
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            View Full Size
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-6 gap-2">
                {sortedImages.slice(0, 6).map((image, index) => (
                  <motion.div
                    key={image.id}
                    className={`rounded-lg overflow-hidden cursor-pointer ${index === 0 ? 'ring-2 ring-nebula-pink' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="aspect-w-1 aspect-h-1">
                      <img 
                        src={image.src} 
                        alt={image.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* No Results */}
          {sortedImages.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-display font-bold text-white mt-4">No images found</h3>
              <p className="text-gray-400 mt-2">Try changing your filters or search criteria</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Fullscreen Image View */}
      <AnimatePresence>
        {viewMode === 'fullscreen' && activeImage && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              onClick={closeFullscreen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Previous Button */}
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              onClick={prevImage}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Next Button */}
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              onClick={nextImage}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image */}
            <motion.div
              layoutId={`image-${activeImage.id}`}
              className="relative max-w-full max-h-full"
            >
              <img 
                src={activeImage.src} 
                alt={activeImage.title}
                className="max-w-full max-h-[85vh] object-contain"
              />
            </motion.div>
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
              <h3 className="text-xl font-display font-bold text-white">{activeImage.title}</h3>
              <p className="text-gray-300 mt-1">{activeImage.description}</p>
              
              <div className="flex flex-wrap items-center mt-2">
                <span className="text-sm text-gray-400">{activeImage.photographer}</span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-sm text-gray-400">{activeImage.date}</span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-sm text-gray-400">{activeImage.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {activeImage.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-deep-blue/50 rounded-full text-xs text-gray-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
