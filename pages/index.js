import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import Three.js components to avoid SSR issues
const HeroCanvas = dynamic(() => import('../components/HeroCanvas'), { ssr: false });

// Import custom components
import CustomCursor from '../components/CustomCursor';
import NavigationBar from '../components/NavigationBar';
import SectionTransition from '../components/SectionTransition';
import { BentoGrid, BentoCard } from '../components/BentoGrid';

export default function Home() {
  const heroRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for parallax effects
  const handleMouseMove = (e) => {
    setCursorPosition({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2
    });
  };
  
  useEffect(() => {
    // Initialize hero animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline
      .from('.hero-title span', {
        opacity: 0,
        y: 100,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.2');
      
    // Add event listener for mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Portfolio items with images
  const portfolioItems = [
    { 
      title: 'Cosmic Explorer', 
      description: 'Interactive 3D visualization of deep space phenomena',
      image: '/images/nebula_1.webp',
      color: 'nebula-pink',
      size: 'large',
      path: '/project/cosmic-explorer'
    },
    { 
      title: 'Aurora Dreams', 
      description: 'Immersive experience with fluid animations',
      image: '/images/nebula_2.webp',
      color: 'electric-blue',
      size: 'medium',
      path: '/project/aurora-dreams'
    },
    { 
      title: 'Stellar Dashboard', 
      description: 'Data visualization with cosmic aesthetics',
      image: '/images/nebula_3.jpeg',
      color: 'neon-teal',
      size: 'medium',
      path: '/project/stellar-dashboard'
    },
    { 
      title: 'Nebula Gallery', 
      description: 'Interactive showcase of celestial photography',
      image: '/images/nebula_4.jpeg',
      color: 'cosmic-purple',
      size: 'small',
      path: '/project/nebula-gallery'
    },
    { 
      title: 'Orbit', 
      description: 'Planetary motion simulation with realistic physics',
      image: '/images/nebula_5.jpeg',
      color: 'multi',
      size: 'wide',
      path: '/project/orbit'
    },
    { 
      title: 'Constellation', 
      description: 'Interactive star map with mythological stories',
      color: 'nebula-pink',
      size: 'small',
      path: '/project/constellation'
    }
  ];
  
  // Service items with icons
  const serviceItems = [
    { 
      title: 'UI/UX Design', 
      description: 'Creating intuitive and engaging user experiences that captivate and convert.',
      icon: <div className="h-12 w-12 rounded-full bg-gradient-to-r from-nebula-pink to-electric-blue flex items-center justify-center"><span className="text-2xl">✦</span></div>,
      color: 'nebula-pink'
    },
    { 
      title: '3D Visualization', 
      description: 'Bringing ideas to life with immersive 3D models and environments.',
      icon: <div className="h-12 w-12 rounded-full bg-gradient-to-r from-electric-blue to-neon-teal flex items-center justify-center"><span className="text-2xl">◆</span></div>,
      color: 'electric-blue'
    },
    { 
      title: 'Web Development', 
      description: 'Building responsive, high-performance websites with cutting-edge technologies.',
      icon: <div className="h-12 w-12 rounded-full bg-gradient-to-r from-neon-teal to-cosmic-purple flex items-center justify-center"><span className="text-2xl">⚙</span></div>,
      color: 'neon-teal'
    },
    { 
      title: 'Motion Design', 
      description: 'Adding life to static designs with fluid animations and transitions.',
      icon: <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cosmic-purple to-nebula-pink flex items-center justify-center"><span className="text-2xl">✧</span></div>,
      color: 'cosmic-purple'
    },
    { 
      title: 'Brand Identity', 
      description: 'Crafting unique visual languages that communicate your brand\'s essence.',
      icon: <div className="h-12 w-12 rounded-full bg-gradient-to-r from-nebula-pink to-neon-teal flex items-center justify-center"><span className="text-2xl">★</span></div>,
      color: 'multi'
    },
    { 
      title: 'Digital Strategy', 
      description: 'Developing comprehensive plans to achieve your digital goals.',
      icon: <div className="h-12 w-12 rounded-full bg-gradient-to-r from-electric-blue to-cosmic-purple flex items-center justify-center"><span className="text-2xl">⚡</span></div>,
      color: 'electric-blue'
    }
  ];
  
  // Team members
  const teamMembers = [
    { name: 'Alex Nova', role: 'Creative Director', color: 'nebula-pink' },
    { name: 'Sam Stellar', role: 'Lead Developer', color: 'electric-blue' },
    { name: 'Jamie Cosmos', role: 'UI/UX Designer', color: 'neon-teal' },
    { name: 'Riley Orbit', role: '3D Artist', color: 'cosmic-purple' }
  ];
  
  return (
    <div className="min-h-screen overflow-x-hidden" onMouseMove={handleMouseMove}>
      <Head>
        <title>Nebula | Digital Design Agency</title>
        <meta name="description" content="Nebula is a digital design agency specializing in creating immersive digital experiences." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroCanvas cursorPosition={cursorPosition} />
        </div>
        
        <div className="container mx-auto px-6 z-10 text-center">
          <h1 className="hero-title text-5xl md:text-7xl font-display font-bold mb-6">
            {['We', 'Create', 'Digital', 'Experiences'].map((word, index) => (
              <span key={index} className="inline-block mx-1 bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal">
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
            Transforming ideas into immersive digital journeys through innovative design and cutting-edge technology.
          </p>
          <motion.button 
            className="hero-cta btn-primary"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Universe
          </motion.button>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-white flex justify-center items-start p-1"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div 
              className="w-1 h-2 bg-white rounded-full"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <SectionTransition id="services" className="py-20 bg-deep-blue">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center text-4xl md:text-5xl font-display font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal">
            Our Cosmic Services
          </h2>
          
          <BentoGrid className="mt-12">
            {serviceItems.map((service, index) => (
              <BentoCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                color={service.color}
                size="small"
              />
            ))}
          </BentoGrid>
        </div>
      </SectionTransition>

      {/* Portfolio Section */}
      <SectionTransition id="portfolio" className="py-20 bg-space-black">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center text-4xl md:text-5xl font-display font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal">
            Our Stellar Work
          </h2>
          
          <BentoGrid className="mt-12">
            {portfolioItems.map((item, index) => (
              <Link href={item.path} key={index}>
                <BentoCard
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  color={item.color}
                  size={item.size}
                />
              </Link>
            ))}
          </BentoGrid>
        </div>
      </SectionTransition>

      {/* Team Section */}
      <SectionTransition id="team" className="py-20 bg-deep-blue">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center text-4xl md:text-5xl font-display font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal">
            Our Stellar Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="relative overflow-hidden rounded-xl nebula-glow group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -inset-px rounded-xl z-0 opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(45deg, var(--color-${member.color}), transparent, var(--color-${member.color}))`,
                    backgroundSize: '200% 200%',
                    animation: 'gradient-animation 3s ease infinite'
                  }}
                />
                
                <div className="relative p-6 bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 rounded-xl z-10">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-nebula-pink to-electric-blue mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-1 text-center">{member.name}</h3>
                  <p className="text-gray-400 text-center">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionTransition>

      {/* Contact Section */}
      <SectionTransition id="contact" className="py-20 bg-space-black">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center text-4xl md:text-5xl font-display font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal">
            Contact Us
          </h2>
          
          <div className="max-w-2xl mx-auto mt-12">
            <motion.form 
              className="relative overflow-hidden rounded-3xl nebula-glow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -inset-px rounded-3xl z-0 opacity-30 hover:opacity-80 transition-opacity duration-300"
                style={{ 
                  background: 'linear-gradient(45deg, var(--color-nebula-pink), var(--color-electric-blue), var(--color-neon-teal))',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-animation 3s ease infinite'
                }}
              />
              
              <div className="relative p-8 bg-deep-blue/50 backdrop-blur-sm border border-cosmic-purple/30 rounded-3xl z-10">
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-deep-blue border border-cosmic-purple rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-nebula-pink transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-deep-blue border border-cosmic-purple rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-nebula-pink transition-all duration-300"
                    placeholder="Your email"
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-gray-300 mb-2" htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full bg-deep-blue border border-cosmic-purple rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-nebula-pink transition-all duration-300"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <motion.button 
                  type="submit" 
                  className="w-full px-6 py-3 bg-gradient-to-r from-nebula-pink to-electric-blue rounded-lg text-white font-bold transition-all duration-300"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </SectionTransition>

      {/* Footer */}
      <footer className="py-12 bg-deep-blue border-t border-cosmic-purple">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal rounded-full blur opacity-70"></div>
                  <div className="relative h-10 w-10 bg-deep-blue rounded-full flex items-center justify-center border border-cosmic-purple">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink to-electric-blue">N</span>
                  </div>
                </div>
                <h3 className="ml-3 text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink to-electric-blue">Nebula</h3>
              </motion.div>
              <p className="text-gray-400 mt-2">Creating digital experiences that matter.</p>
            </div>
            <div className="flex space-x-6">
              {['Twitter', 'Instagram', 'LinkedIn', 'Dribbble'].map((social, index) => (
                <motion.a 
                  key={index} 
                  href="#" 
                  className="text-gray-400 hover:text-nebula-pink transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-cosmic-purple text-center text-gray-500">
            <p>© 2025 Nebula. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
