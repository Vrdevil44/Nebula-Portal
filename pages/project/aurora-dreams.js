import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import CustomCursor from '../../components/CustomCursor';
import NavigationBar from '../../components/NavigationBar';

// Dynamically import Canvas component to avoid SSR issues
const AuroraCanvas = dynamic(() => import('../../components/projects/AuroraCanvas'), { ssr: false });

export default function AuroraDreams() {
  const [loading, setLoading] = useState(true);
  const [colorPalette, setColorPalette] = useState('aurora'); // 'aurora', 'sunset', 'ocean', 'cosmic'
  const [musicMode, setMusicMode] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [audioAnalyser, setAudioAnalyser] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const audioRef = useRef(null);
  
  // Color palette configurations
  const palettes = {
    aurora: {
      name: 'Northern Lights',
      colors: [
        { r: 0, g: 255, b: 140 },  // Teal
        { r: 80, g: 200, b: 255 }, // Light blue
        { r: 160, g: 100, b: 255 }, // Purple
        { r: 255, g: 100, b: 255 }  // Pink
      ]
    },
    sunset: {
      name: 'Sunset Glow',
      colors: [
        { r: 255, g: 100, b: 50 },  // Orange
        { r: 255, g: 50, b: 100 },  // Red-pink
        { r: 255, g: 200, b: 100 }, // Yellow
        { r: 200, g: 50, b: 100 }   // Dark pink
      ]
    },
    ocean: {
      name: 'Deep Ocean',
      colors: [
        { r: 0, g: 100, b: 200 },   // Deep blue
        { r: 0, g: 200, b: 255 },   // Cyan
        { r: 0, g: 150, b: 150 },   // Teal
        { r: 100, g: 200, b: 200 }  // Light teal
      ]
    },
    cosmic: {
      name: 'Cosmic Nebula',
      colors: [
        { r: 100, g: 0, b: 200 },   // Purple
        { r: 200, g: 50, b: 200 },  // Magenta
        { r: 50, g: 0, b: 100 },    // Dark purple
        { r: 200, g: 100, b: 255 }  // Light purple
      ]
    }
  };
  
  // Handle loading state
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Initialize audio context for music visualization
  useEffect(() => {
    if (musicMode && !audioContext) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        
        setAudioContext(context);
        setAudioAnalyser(analyser);
        setAudioData(new Uint8Array(analyser.frequencyBinCount));
        
        // If we already have an audio element, connect it
        if (audioRef.current) {
          const source = context.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(context.destination);
        }
      } catch (error) {
        console.error("Audio Context could not be created:", error);
        setMusicMode(false);
      }
    }
  }, [musicMode, audioContext]);
  
  // Handle audio file selection
  const handleAudioFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const audio = audioRef.current;
    const fileURL = URL.createObjectURL(file);
    audio.src = fileURL;
    
    // Connect audio to analyser if not already connected
    if (audioContext && audioAnalyser && audio) {
      try {
        const source = audioContext.createMediaElementSource(audio);
        source.connect(audioAnalyser);
        audioAnalyser.connect(audioContext.destination);
      } catch (error) {
        // Source might already be connected
        console.log("Audio source already connected or error:", error);
      }
    }
    
    audio.play().then(() => {
      setAudioPlaying(true);
    }).catch(error => {
      console.error("Audio playback failed:", error);
    });
  };
  
  // Toggle audio playback
  const toggleAudio = () => {
    const audio = audioRef.current;
    
    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else if (audio.src) {
      audio.play().then(() => {
        setAudioPlaying(true);
      }).catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  };
  
  // Capture current aurora as image
  const captureAurora = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = `aurora-dreams-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  return (
    <div className="relative min-h-screen bg-space-black overflow-hidden">
      <Head>
        <title>Aurora Dreams | Nebula</title>
        <meta name="description" content="Immersive experience with fluid animations" />
      </Head>
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Audio Element (hidden) */}
      <audio ref={audioRef} loop className="hidden" />
      
      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-black">
          <div className="text-center">
            <motion.div 
              className="w-24 h-24 rounded-full bg-gradient-to-r from-nebula-pink to-electric-blue mx-auto mb-6"
              animate={{ 
                scale: [1, 1.2, 1],
                filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <h2 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink to-electric-blue">
              Loading Aurora Dreams
            </h2>
            <p className="text-gray-400 mt-2">Preparing the fluid simulation...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="relative min-h-screen">
        {/* Aurora Canvas */}
        <div className="absolute inset-0 z-0">
          <AuroraCanvas 
            colorPalette={palettes[colorPalette].colors}
            musicMode={musicMode}
            audioAnalyser={audioAnalyser}
            audioData={audioData}
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
              Aurora Dreams
            </h1>
            <p className="text-gray-300 mt-2">Immersive experience with fluid animations</p>
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
                  {/* Color Palette Selection */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-electric-blue mb-2">Color Palette</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(palettes).map((key) => (
                        <motion.button
                          key={key}
                          className={`p-2 rounded-lg flex items-center ${colorPalette === key ? 'bg-cosmic-purple/50 border border-cosmic-purple' : 'bg-deep-blue/70 border border-cosmic-purple/30'}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setColorPalette(key)}
                        >
                          <div className="w-6 h-6 rounded-full mr-2 flex overflow-hidden">
                            {palettes[key].colors.map((color, index) => (
                              <div 
                                key={index}
                                className="flex-1 h-full"
                                style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                              />
                            ))}
                          </div>
                          <span className="text-sm">{palettes[key].name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Music Visualization */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-electric-blue mb-2">Music Visualization</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <motion.button
                          className={`px-3 py-1 rounded-full text-sm mr-2 ${musicMode ? 'bg-nebula-pink text-white' : 'bg-deep-blue border border-nebula-pink/50 text-nebula-pink'}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMusicMode(!musicMode)}
                        >
                          {musicMode ? 'Music Mode: ON' : 'Music Mode: OFF'}
                        </motion.button>
                      </div>
                      
                      {musicMode && (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input 
                              type="file" 
                              accept="audio/*" 
                              id="audio-file" 
                              className="hidden" 
                              onChange={handleAudioFile}
                            />
                            <motion.label
                              htmlFor="audio-file"
                              className="px-3 py-1 rounded-full text-sm mr-2 bg-deep-blue border border-electric-blue/50 text-electric-blue cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Select Audio File
                            </motion.label>
                            
                            <motion.button
                              className={`px-3 py-1 rounded-full text-sm ${audioPlaying ? 'bg-deep-blue border border-neon-teal/50 text-neon-teal' : 'bg-neon-teal text-white'}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={toggleAudio}
                              disabled={!audioRef.current?.src}
                            >
                              {audioPlaying ? 'Pause' : 'Play'}
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Capture Button */}
                <div className="mt-4 flex justify-center">
                  <motion.button
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-nebula-pink to-electric-blue text-white font-bold"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={captureAurora}
                  >
                    Capture Aurora
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
