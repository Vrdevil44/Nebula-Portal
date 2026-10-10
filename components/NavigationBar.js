import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NavigationBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' }
  ];

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Change navbar style on scroll
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 300;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const id = section.getAttribute('id');
          if (id) setActiveSection(id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  // Navbar variants for animation
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    }
  };

  // Menu variants for mobile
  const menuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Menu item variants
  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  // Hamburger button variants
  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3 bg-deep-blue/90 backdrop-blur-lg shadow-lg' : 'py-6 bg-transparent'}`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-nebula-pink via-electric-blue to-neon-teal rounded-full blur opacity-70"></div>
            <div className="relative h-10 w-10 bg-deep-blue rounded-full flex items-center justify-center border border-cosmic-purple">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink to-electric-blue">N</span>
            </div>
          </div>
          <h1 className="ml-3 text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-pink to-electric-blue">Nebula</h1>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === item.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === item.id && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-nebula-pink/20 to-electric-blue/20 rounded-full -z-10"
                  layoutId="activeSection"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              {item.label}
            </motion.button>
          ))}
          <motion.button
            className="ml-4 px-6 py-2 bg-gradient-to-r from-nebula-pink to-electric-blue rounded-full text-white font-medium"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-deep-blue border border-cosmic-purple"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variants={hamburgerVariants}
          animate={isMenuOpen ? "open" : "closed"}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative w-6 h-6">
            <motion.span 
              className="absolute top-2 left-0 w-6 h-0.5 bg-gradient-to-r from-nebula-pink to-electric-blue rounded-full"
              animate={{ 
                top: isMenuOpen ? "50%" : "25%", 
                rotate: isMenuOpen ? 45 : 0,
                y: isMenuOpen ? "-50%" : 0
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="absolute top-3 left-0 w-6 h-0.5 bg-gradient-to-r from-nebula-pink to-electric-blue rounded-full"
              animate={{ 
                opacity: isMenuOpen ? 0 : 1,
                x: isMenuOpen ? 10 : 0
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="absolute top-4 left-0 w-6 h-0.5 bg-gradient-to-r from-nebula-pink to-electric-blue rounded-full"
              animate={{ 
                top: isMenuOpen ? "50%" : "75%", 
                rotate: isMenuOpen ? -45 : 0,
                y: isMenuOpen ? "-50%" : 0
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 w-full bg-deep-blue/95 backdrop-blur-lg shadow-lg py-5 px-6"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`py-3 px-4 rounded-lg text-left ${activeSection === item.id ? 'bg-cosmic-purple/30 text-white' : 'text-gray-400'}`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                className="mt-4 py-3 px-4 bg-gradient-to-r from-nebula-pink to-electric-blue rounded-lg text-white font-medium"
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavigationBar;
