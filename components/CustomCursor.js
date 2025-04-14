import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over clickable element
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.onclick ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
      
      // Scale effect based on element type
      if (isClickable) {
        setScale(1.5);
      } else if (target.tagName.toLowerCase() === 'h1' || 
                target.tagName.toLowerCase() === 'h2') {
        setScale(1.2);
      } else {
        setScale(1);
      }
      
      setIsVisible(true);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Cursor variants for different states
  const cursorVariants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      scale: scale,
      opacity: isVisible ? 1 : 0,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      }
    },
    pointer: {
      x: position.x - 16,
      y: position.y - 16,
      scale: scale,
      opacity: isVisible ? 1 : 0,
      mixBlendMode: "difference",
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      }
    },
    clicking: {
      x: position.x - 16,
      y: position.y - 16,
      scale: 0.8,
      opacity: isVisible ? 1 : 0,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      }
    }
  };

  // Determine current cursor state
  const cursorState = isClicking ? "clicking" : isPointer ? "pointer" : "default";

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50"
        variants={cursorVariants}
        animate={cursorState}
        style={{
          background: isPointer ? 'white' : 'rgba(255, 0, 255, 0.3)',
          border: '2px solid rgba(255, 0, 255, 0.8)',
          mixBlendMode: isPointer ? 'difference' : 'normal',
        }}
      />
      
      {/* Cursor trail effect */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-40"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          opacity: isVisible ? 0.5 : 0,
          scale: isClicking ? 0.5 : 1,
          transition: {
            type: "spring",
            mass: 0.5,
            stiffness: 400,
            damping: 30,
            delay: 0.05,
          }
        }}
        style={{
          background: 'rgba(0, 255, 255, 0.5)',
        }}
      />
      
      {/* Second cursor trail */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-30"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          opacity: isVisible ? 0.3 : 0,
          transition: {
            type: "spring",
            mass: 0.8,
            stiffness: 200,
            damping: 30,
            delay: 0.1,
          }
        }}
        style={{
          background: 'rgba(57, 255, 20, 0.8)',
        }}
      />
      
      {/* Hide default cursor */}
      <style jsx global>{`
        body {
          cursor: none;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
