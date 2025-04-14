import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import CustomCursor from '../../components/CustomCursor';
import NavigationBar from '../../components/NavigationBar';

// Dynamically import visualization components to avoid SSR issues
const DashboardCharts = dynamic(() => import('../../components/projects/DashboardCharts'), { ssr: false });

export default function StellarDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeDataset, setActiveDataset] = useState('stars');
  const [timeRange, setTimeRange] = useState('all');
  const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'galaxy'
  const [darkMode, setDarkMode] = useState(true);
  
  // Available datasets
  const datasets = {
    stars: {
      name: 'Star Classification',
      description: 'Distribution of stars by spectral type and luminosity class',
      icon: '✦'
    },
    planets: {
      name: 'Exoplanet Data',
      description: 'Known exoplanets by size, orbital period, and detection method',
      icon: '◯'
    },
    galaxies: {
      name: 'Galaxy Types',
      description: 'Distribution of galaxy morphologies and properties',
      icon: '◎'
    },
    discoveries: {
      name: 'Astronomical Discoveries',
      description: 'Timeline of major astronomical discoveries and missions',
      icon: '⚡'
    }
  };
  
  // Time range options
  const timeRanges = {
    all: 'All Time',
    century: 'Last Century',
    decade: 'Last Decade',
    year: 'Last Year'
  };
  
  // Handle loading state
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle view mode between charts and galaxy map
  const toggleViewMode = () => {
    setViewMode(viewMode === 'charts' ? 'galaxy' : 'charts');
  };
  
  return (
    <div className={`relative min-h-screen ${darkMode ? 'bg-space-black' : 'bg-gray-100'} overflow-hidden transition-colors duration-500`}>
      <Head>
        <title>Stellar Dashboard | Nebula</title>
        <meta name="description" content="Data visualization with cosmic aesthetics" />
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
              Loading Stellar Dashboard
            </h2>
            <p className="text-gray-400 mt-2">Preparing cosmic data...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className={`relative min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-500`}>
        <div className="container mx-auto px-4 py-24">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            {/* Back Button */}
            <div className="mb-4 md:mb-0">
              <Link href="/#portfolio">
                <motion.button 
                  className={`px-4 py-2 rounded-full ${darkMode ? 'bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300'} flex items-center transition-colors duration-500`}
                  whileHover={{ x: -5, backgroundColor: darkMode ? 'rgba(61, 8, 123, 0.7)' : 'rgba(255, 255, 255, 0.9)' }}
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
              <h1 className={`text-4xl md:text-5xl font-display font-bold ${darkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal' : 'text-cosmic-purple'}`}>
                Stellar Dashboard
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Data visualization with cosmic aesthetics</p>
            </motion.div>
            
            {/* Controls */}
            <div className="flex space-x-2">
              <motion.button
                className={`p-2 rounded-full ${darkMode ? 'bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300'} transition-colors duration-500`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleViewMode}
                title={viewMode === 'charts' ? 'Switch to Galaxy View' : 'Switch to Chart View'}
              >
                {viewMode === 'charts' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
              </motion.button>
              
              <motion.button
                className={`p-2 rounded-full ${darkMode ? 'bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300'} transition-colors duration-500`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className={`rounded-xl ${darkMode ? 'bg-deep-blue/30 backdrop-blur-sm border border-cosmic-purple/30' : 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg'} overflow-hidden transition-colors duration-500`}>
            {/* Dashboard Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide">
              {Object.keys(datasets).map((key) => (
                <motion.button
                  key={key}
                  className={`px-6 py-4 flex items-center whitespace-nowrap ${activeDataset === key ? (darkMode ? 'bg-cosmic-purple/30 border-b-2 border-electric-blue' : 'bg-gray-100 border-b-2 border-cosmic-purple') : 'border-b border-gray-700/30'} transition-colors duration-300`}
                  whileHover={{ backgroundColor: darkMode ? 'rgba(100, 50, 200, 0.2)' : 'rgba(240, 240, 250, 1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveDataset(key)}
                >
                  <span className={`text-xl mr-2 ${darkMode ? 'text-electric-blue' : 'text-cosmic-purple'}`}>{datasets[key].icon}</span>
                  <div className="text-left">
                    <div className={`font-display font-bold ${activeDataset === key ? (darkMode ? 'text-electric-blue' : 'text-cosmic-purple') : ''}`}>{datasets[key].name}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{datasets[key].description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Time Range Selector */}
            <div className={`px-6 py-3 flex items-center justify-between ${darkMode ? 'bg-deep-blue/50' : 'bg-gray-50'} border-b border-gray-700/30 transition-colors duration-500`}>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time Range:</div>
              <div className="flex space-x-2">
                {Object.keys(timeRanges).map((key) => (
                  <motion.button
                    key={key}
                    className={`px-3 py-1 text-sm rounded-full ${timeRange === key ? (darkMode ? 'bg-nebula-pink text-white' : 'bg-cosmic-purple text-white') : (darkMode ? 'bg-deep-blue border border-nebula-pink/50 text-nebula-pink' : 'bg-white border border-cosmic-purple/50 text-cosmic-purple')}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeRange(key)}
                  >
                    {timeRanges[key]}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Dashboard Visualization */}
            <div className="p-6">
              <DashboardCharts 
                dataset={activeDataset}
                timeRange={timeRange}
                viewMode={viewMode}
                darkMode={darkMode}
              />
            </div>
          </div>
          
          {/* Data Sources */}
          <div className={`mt-8 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Data sources: NASA Exoplanet Archive, SIMBAD Astronomical Database, Sloan Digital Sky Survey, ESA Gaia Mission</p>
          </div>
        </div>
      </main>
    </div>
  );
}
