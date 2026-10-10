import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import CustomCursor from '../../components/CustomCursor';
import NavigationBar from '../../components/NavigationBar';

// Dynamically import Three.js components to avoid SSR issues
const CosmicExplorerScene = dynamic(() => import('../../components/projects/CosmicExplorerScene'), { ssr: false });

export default function CosmicExplorer() {
  const [loading, setLoading] = useState(true);
  const [activeObject, setActiveObject] = useState(null);
  const [controlMode, setControlMode] = useState('orbit'); // 'orbit' or 'fly'
  const [showInfo, setShowInfo] = useState(false);
  
  // Cosmic objects data
  const cosmicObjects = [
    { 
      id: 'nebula1', 
      name: 'Eagle Nebula', 
      type: 'Emission Nebula',
      description: 'The Eagle Nebula is a young open cluster of stars surrounded by hot hydrogen gas in the constellation Serpens.',
      distance: '7,000 light years',
      size: '70 × 55 light years'
    },
    { 
      id: 'galaxy1', 
      name: 'Andromeda Galaxy', 
      type: 'Spiral Galaxy',
      description: 'The Andromeda Galaxy is a spiral galaxy approximately 2.5 million light-years from Earth and the nearest major galaxy to the Milky Way.',
      distance: '2.5 million light years',
      size: '220,000 light years in diameter'
    },
    { 
      id: 'blackhole1', 
      name: 'Sagittarius A*', 
      type: 'Supermassive Black Hole',
      description: 'Sagittarius A* is a supermassive black hole at the center of the Milky Way galaxy.',
      distance: '26,000 light years',
      size: '44 million km in diameter'
    },
    { 
      id: 'cluster1', 
      name: 'Pleiades', 
      type: 'Star Cluster',
      description: 'The Pleiades, also known as the Seven Sisters, is an open star cluster containing middle-aged, hot B-type stars in the constellation Taurus.',
      distance: '444 light years',
      size: '43 light years in diameter'
    }
  ];

  // Handle loading state
  useEffect(() => {
    // Simulate loading time for the 3D scene
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'i') {
        setShowInfo(!showInfo);
      } else if (e.key === 'm') {
        setControlMode(controlMode === 'orbit' ? 'fly' : 'orbit');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInfo, controlMode]);

  return (
    <div className="relative min-h-screen bg-space-black overflow-hidden">
      <Head>
        <title>Cosmic Explorer | Nebula</title>
        <meta name="description" content="Interactive 3D visualization of deep space phenomena" />
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
              Loading Cosmic Explorer
            </h2>
            <p className="text-gray-400 mt-2">Preparing the universe...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="relative min-h-screen">
        {/* 3D Scene */}
        <div className="absolute inset-0 z-0">
          <CosmicExplorerScene 
            setActiveObject={setActiveObject} 
            controlMode={controlMode}
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
              Cosmic Explorer
            </h1>
            <p className="text-gray-300 mt-2">Interactive 3D visualization of deep space phenomena</p>
          </motion.div>
          
          {/* Controls */}
          <div className="absolute bottom-6 left-6 pointer-events-auto">
            <motion.div 
              className="p-4 rounded-xl bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3 className="text-lg font-display font-bold text-electric-blue mb-2">Controls</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>Mouse Drag: Rotate camera</li>
                <li>Mouse Wheel: Zoom in/out</li>
                <li>Right Click + Drag: Pan camera</li>
                <li>Press 'M': Toggle {controlMode === 'orbit' ? 'Fly' : 'Orbit'} mode</li>
                <li>Press 'I': Toggle info panel</li>
              </ul>
              <div className="mt-4">
                <motion.button 
                  className={`px-3 py-1 rounded-full text-sm mr-2 ${controlMode === 'orbit' ? 'bg-nebula-pink text-white' : 'bg-deep-blue border border-nebula-pink/50 text-nebula-pink'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setControlMode('orbit')}
                >
                  Orbit Mode
                </motion.button>
                <motion.button 
                  className={`px-3 py-1 rounded-full text-sm ${controlMode === 'fly' ? 'bg-electric-blue text-white' : 'bg-deep-blue border border-electric-blue/50 text-electric-blue'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setControlMode('fly')}
                >
                  Fly Mode
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Object Info Panel */}
          {activeObject && (
            <motion.div 
              className="absolute bottom-6 right-6 pointer-events-auto"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 rounded-xl bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 max-w-xs">
                <h3 className="text-lg font-display font-bold text-electric-blue">
                  {cosmicObjects.find(obj => obj.id === activeObject)?.name || 'Unknown Object'}
                </h3>
                <p className="text-xs text-nebula-pink mt-1">
                  {cosmicObjects.find(obj => obj.id === activeObject)?.type || 'Unknown Type'}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  {cosmicObjects.find(obj => obj.id === activeObject)?.description || 'No information available.'}
                </p>
                <div className="mt-3 pt-3 border-t border-cosmic-purple/30 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Distance from Earth</p>
                    <p className="text-white">{cosmicObjects.find(obj => obj.id === activeObject)?.distance || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Size</p>
                    <p className="text-white">{cosmicObjects.find(obj => obj.id === activeObject)?.size || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Universe Timeline */}
          {showInfo && (
            <motion.div 
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl pointer-events-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 rounded-xl bg-deep-blue/70 backdrop-blur-sm border border-cosmic-purple/30">
                <h3 className="text-lg font-display font-bold text-center text-electric-blue mb-4">Timeline of the Universe</h3>
                <div className="relative h-2 bg-deep-blue rounded-full overflow-hidden mb-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <div className="text-center">
                    <div className="w-1 h-3 bg-nebula-pink mx-auto mb-1"></div>
                    <p>Big Bang</p>
                    <p>13.8 billion years ago</p>
                  </div>
                  <div className="text-center">
                    <div className="w-1 h-3 bg-nebula-pink/80 mx-auto mb-1"></div>
                    <p>First Stars</p>
                    <p>13.5 billion years ago</p>
                  </div>
                  <div className="text-center">
                    <div className="w-1 h-3 bg-electric-blue mx-auto mb-1"></div>
                    <p>Galaxies Form</p>
                    <p>13 billion years ago</p>
                  </div>
                  <div className="text-center">
                    <div className="w-1 h-3 bg-electric-blue/80 mx-auto mb-1"></div>
                    <p>Milky Way Forms</p>
                    <p>13.6 billion years ago</p>
                  </div>
                  <div className="text-center">
                    <div className="w-1 h-3 bg-neon-teal mx-auto mb-1"></div>
                    <p>Solar System</p>
                    <p>4.6 billion years ago</p>
                  </div>
                  <div className="text-center">
                    <div className="w-1 h-3 bg-neon-teal/80 mx-auto mb-1"></div>
                    <p>Present Day</p>
                    <p>Now</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
