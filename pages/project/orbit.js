import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CustomCursor from '../../components/CustomCursor';
import NavigationBar from '../../components/NavigationBar';
import dynamic from 'next/dynamic';

// Dynamically import the OrbitSimulation component to avoid SSR issues
const OrbitSimulation = dynamic(() => import('../../components/projects/OrbitSimulation'), { ssr: false });

export default function Orbit() {
  const [loading, setLoading] = useState(true);
  const [simulationMode, setSimulationMode] = useState('solar-system'); // 'solar-system', 'exoplanets', 'binary-stars', 'custom'
  const [timeScale, setTimeScale] = useState(1); // 1x, 5x, 10x, 50x, 100x
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or '2d'
  const [showControls, setShowControls] = useState(true);
  const [selectedBody, setSelectedBody] = useState(null);
  const [customBodies, setCustomBodies] = useState([]);
  const [isAddingBody, setIsAddingBody] = useState(false);
  const [newBodyData, setNewBodyData] = useState({
    name: '',
    mass: 1,
    radius: 1,
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    color: '#ffffff'
  });
  
  // Simulation modes configuration
  const simulationModes = {
    'solar-system': {
      name: 'Solar System',
      description: 'Accurate simulation of our solar system with the Sun and planets'
    },
    'exoplanets': {
      name: 'Exoplanet Systems',
      description: 'Simulations of known exoplanet systems with diverse orbital characteristics'
    },
    'binary-stars': {
      name: 'Binary Star Systems',
      description: 'Simulation of binary star systems with planets in stable orbits'
    },
    'custom': {
      name: 'Custom Simulation',
      description: 'Create your own planetary system with custom parameters'
    }
  };
  
  // Time scale options
  const timeScaleOptions = [
    { value: 1, label: '1x' },
    { value: 5, label: '5x' },
    { value: 10, label: '10x' },
    { value: 50, label: '50x' },
    { value: 100, label: '100x' }
  ];
  
  // Handle loading state
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  // Handle body selection
  const handleBodySelect = (body) => {
    setSelectedBody(body);
  };
  
  // Handle adding a new custom body
  const handleAddBody = () => {
    if (isAddingBody) {
      // Add the new body to custom bodies
      setCustomBodies([...customBodies, { ...newBodyData, id: Date.now() }]);
      
      // Reset form
      setNewBodyData({
        name: '',
        mass: 1,
        radius: 1,
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        color: '#ffffff'
      });
      
      setIsAddingBody(false);
    } else {
      setIsAddingBody(true);
    }
  };
  
  // Handle input change for new body form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewBodyData({
        ...newBodyData,
        [parent]: {
          ...newBodyData[parent],
          [child]: parseFloat(value) || 0
        }
      });
    } else {
      setNewBodyData({
        ...newBodyData,
        [name]: value
      });
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    // This will be handled by the OrbitSimulation component
    // We just need to trigger a re-render
    setTimeScale(timeScale);
  };
  
  return (
    <div className="relative min-h-screen bg-space-black overflow-hidden">
      <Head>
        <title>Orbit | Nebula</title>
        <meta name="description" content="Planetary motion simulation with realistic physics" />
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
              Loading Orbit Simulation
            </h2>
            <p className="text-gray-400 mt-2">Preparing physics engine...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="relative min-h-screen text-white">
        {/* Simulation Canvas */}
        <div className="absolute inset-0 z-0">
          <OrbitSimulation 
            mode={simulationMode}
            timeScale={timeScale}
            showOrbits={showOrbits}
            showLabels={showLabels}
            viewMode={viewMode}
            customBodies={customBodies}
            onBodySelect={handleBodySelect}
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
              Orbit
            </h1>
            <p className="text-gray-300 mt-2">Planetary motion simulation with realistic physics</p>
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
                  {/* Simulation Mode Selection */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-electric-blue mb-2">Simulation Mode</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(simulationModes).map((key) => (
                        <motion.button
                          key={key}
                          className={`p-2 rounded-lg flex flex-col items-center text-center ${simulationMode === key ? 'bg-cosmic-purple/50 border border-cosmic-purple' : 'bg-deep-blue/70 border border-cosmic-purple/30'}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSimulationMode(key)}
                        >
                          <span className="text-sm font-bold">{simulationModes[key].name}</span>
                          <span className="text-xs text-gray-400 mt-1">{simulationModes[key].description}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Simulation Controls */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-electric-blue mb-2">Simulation Controls</h3>
                    <div className="space-y-2">
                      {/* Time Scale */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 w-24">Time Scale:</span>
                        <div className="flex space-x-1">
                          {timeScaleOptions.map((option) => (
                            <motion.button
                              key={option.value}
                              className={`px-2 py-1 rounded-md text-xs ${timeScale === option.value ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setTimeScale(option.value)}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      {/* View Mode */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 w-24">View Mode:</span>
                        <div className="flex space-x-1">
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${viewMode === '3d' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('3d')}
                          >
                            3D
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${viewMode === '2d' ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('2d')}
                          >
                            2D
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Display Options */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 w-24">Display:</span>
                        <div className="flex space-x-1">
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${showOrbits ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowOrbits(!showOrbits)}
                          >
                            {showOrbits ? 'Hide Orbits' : 'Show Orbits'}
                          </motion.button>
                          <motion.button
                            className={`px-2 py-1 rounded-md text-xs ${showLabels ? 'bg-nebula-pink text-white' : 'bg-deep-blue/70 text-gray-300'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowLabels(!showLabels)}
                          >
                            {showLabels ? 'Hide Labels' : 'Show Labels'}
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Reset Button */}
                      <div className="flex justify-end mt-2">
                        <motion.button
                          className="px-3 py-1 rounded-md text-sm bg-electric-blue text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetSimulation}
                        >
                          Reset Simulation
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Custom Body Controls (only shown in custom mode) */}
                {simulationMode === 'custom' && (
                  <div className="mt-4 border-t border-cosmic-purple/30 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-display font-bold text-electric-blue">Custom Bodies</h3>
                      <motion.button
                        className="px-3 py-1 rounded-md text-sm bg-nebula-pink text-white flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddBody}
                      >
                        {isAddingBody ? 'Save Body' : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Body
                          </>
                        )}
                      </motion.button>
                    </div>
                    
                    {isAddingBody ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-deep-blue/70 p-3 rounded-lg">
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-400 block">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={newBodyData.name}
                              onChange={handleInputChange}
                              className="w-full bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                              placeholder="Planet name"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 block">Mass (Earth masses)</label>
                            <input
                              type="number"
                              name="mass"
                              value={newBodyData.mass}
                              onChange={handleInputChange}
                              className="w-full bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                              min="0.1"
                              step="0.1"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 block">Radius (Earth radii)</label>
                            <input
                              type="number"
                              name="radius"
                              value={newBodyData.radius}
                              onChange={handleInputChange}
                              className="w-full bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                              min="0.1"
                              step="0.1"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 block">Color</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                name="color"
                                value={newBodyData.color}
                                onChange={handleInputChange}
                                className="bg-deep-blue border border-cosmic-purple/30 rounded h-6 w-8"
                              />
                              <input
                                type="text"
                                name="color"
                                value={newBodyData.color}
                                onChange={handleInputChange}
                                className="flex-1 bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                                placeholder="#RRGGBB"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-400 block">Position (x, y, z in AU)</label>
                            <div className="grid grid-cols-3 gap-1">
                              <input
                                type="number"
                                name="position.x"
                                value={newBodyData.position.x}
                                onChange={handleInputChange}
                                className="bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                                placeholder="X"
                                step="0.1"
                              />
                              <input
                                type="number"
                                name="position.y"
                                value={newBodyData.position.y}
                                onChange={handleInputChange}
                                className="bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                                placeholder="Y"
                                step="0.1"
                              />
                              <input
                                type="number"
                                name="position.z"
                                value={newBodyData.position.z}
                                onChange={handleInputChange}
                                className="bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                                placeholder="Z"
                                step="0.1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 block">Velocity (x, y, z in km/s)</label>
                            <div className="grid grid-cols-3 gap-1">
                              <input
                                type="number"
                                name="velocity.x"
                                value={newBodyData.velocity.x}
                                onChange={handleInputChange}
                                className="bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                                placeholder="X"
                                step="0.1"
                              />
                              <input
                                type="number"
                                name="velocity.y"
                                value={newBodyData.velocity.y}
                                onChange={handleInputChange}
                                className="bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                                placeholder="Y"
                                step="0.1"
                              />
                              <input
                                type="number"
                                name="velocity.z"
                                value={newBodyData.velocity.z}
                                onChange={handleInputChange}
                                className="bg-deep-blue border border-cosmic-purple/30 rounded px-2 py-1 text-sm"
                                placeholder="Z"
                                step="0.1"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <motion.button
                              className="px-3 py-1 rounded-md text-sm bg-gray-700 text-white mr-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setIsAddingBody(false)}
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-32 overflow-y-auto">
                        {customBodies.length > 0 ? (
                          <div className="space-y-2">
                            {customBodies.map((body) => (
                              <div 
                                key={body.id} 
                                className="flex items-center justify-between bg-deep-blue/70 p-2 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <div 
                                    className="w-4 h-4 rounded-full mr-2" 
                                    style={{ backgroundColor: body.color }}
                                  ></div>
                                  <span>{body.name || `Body ${body.id}`}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  Mass: {body.mass} Earth masses
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-400">
                            No custom bodies added yet. Click "Add Body" to create one.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Selected Body Info */}
          {selectedBody && (
            <motion.div 
              className="absolute top-24 right-16 p-4 rounded-xl bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 max-w-xs pointer-events-auto"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <div 
                  className="w-6 h-6 rounded-full mr-2" 
                  style={{ backgroundColor: selectedBody.color }}
                ></div>
                <h3 className="text-lg font-display font-bold text-white">{selectedBody.name}</h3>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mass:</span>
                  <span>{selectedBody.mass} {selectedBody.massUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Radius:</span>
                  <span>{selectedBody.radius} {selectedBody.radiusUnit}</span>
                </div>
                {selectedBody.orbitalPeriod && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbital Period:</span>
                    <span>{selectedBody.orbitalPeriod} days</span>
                  </div>
                )}
                {selectedBody.distance && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance:</span>
                    <span>{selectedBody.distance} AU</span>
                  </div>
                )}
                {selectedBody.velocity && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Velocity:</span>
                    <span>{selectedBody.velocity} km/s</span>
                  </div>
                )}
              </div>
              
              {selectedBody.description && (
                <p className="mt-2 text-xs text-gray-300">{selectedBody.description}</p>
              )}
              
              <button 
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setSelectedBody(null)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
