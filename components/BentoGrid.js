import { motion } from 'framer-motion';
import { useState } from 'react';

const BentoGrid = ({ children, className }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

const BentoCard = ({ 
  title, 
  description, 
  icon, 
  image, 
  color = "nebula-pink", 
  size = "medium", 
  className,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine grid span based on size
  const sizeClasses = {
    small: "md:col-span-1 md:row-span-1",
    medium: "md:col-span-1 md:row-span-2",
    large: "md:col-span-2 md:row-span-2",
    wide: "md:col-span-2 md:row-span-1"
  };
  
  // Determine gradient based on color
  const gradients = {
    "nebula-pink": "from-nebula-pink/20 to-nebula-pink/5",
    "electric-blue": "from-electric-blue/20 to-electric-blue/5",
    "neon-teal": "from-neon-teal/20 to-neon-teal/5",
    "cosmic-purple": "from-cosmic-purple/20 to-cosmic-purple/5",
    "multi": "from-nebula-pink/20 via-electric-blue/15 to-neon-teal/10"
  };
  
  // Determine border color based on color
  const borderColors = {
    "nebula-pink": "border-nebula-pink/30",
    "electric-blue": "border-electric-blue/30",
    "neon-teal": "border-neon-teal/30",
    "cosmic-purple": "border-cosmic-purple/30",
    "multi": "border-nebula-pink/30"
  };
  
  // Determine glow color based on color
  const glowColors = {
    "nebula-pink": "shadow-nebula-pink/20",
    "electric-blue": "shadow-electric-blue/20",
    "neon-teal": "shadow-neon-teal/20",
    "cosmic-purple": "shadow-cosmic-purple/20",
    "multi": "shadow-nebula-pink/20"
  };
  
  return (
    <motion.div 
      className={`relative overflow-hidden rounded-3xl ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Animated border glow effect */}
      <motion.div 
        className="absolute -inset-px rounded-3xl z-0 opacity-0"
        animate={{ 
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1 : 0.95
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          background: `linear-gradient(45deg, var(--color-${color}), transparent, var(--color-${color}))`,
          backgroundSize: '200% 200%',
          animation: isHovered ? 'gradient-animation 3s ease infinite' : 'none'
        }}
      />
      
      {/* Card content */}
      <motion.div 
        className={`relative h-full p-6 md:p-8 bg-gradient-to-br ${gradients[color]} backdrop-blur-sm border ${borderColors[color]} rounded-3xl z-10 overflow-hidden ${isHovered ? `${glowColors[color]} shadow-lg` : ''}`}
        animate={{ 
          scale: isHovered ? 0.98 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Image if provided */}
        {image && (
          <motion.div 
            className="absolute inset-0 z-0 opacity-30"
            animate={{ 
              opacity: isHovered ? 0.5 : 0.3,
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-transparent to-transparent" />
          </motion.div>
        )}
        
        {/* Content container */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          {icon && (
            <motion.div 
              className="mb-4"
              animate={{ 
                y: isHovered ? -5 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          )}
          
          {/* Title */}
          {title && (
            <motion.h3 
              className="text-xl md:text-2xl font-display font-bold mb-2"
              animate={{ 
                y: isHovered ? -3 : 0,
                color: isHovered ? `var(--color-${color})` : 'white'
              }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>
          )}
          
          {/* Description */}
          {description && (
            <motion.p 
              className="text-gray-300"
              animate={{ 
                opacity: isHovered ? 1 : 0.7
              }}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>
          )}
          
          {/* Hover indicator */}
          <motion.div 
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
              rotate: isHovered ? 0 : -30
            }}
            transition={{ duration: 0.3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { BentoGrid, BentoCard };
