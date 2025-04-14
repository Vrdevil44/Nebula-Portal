import { useRef, useEffect, useState } from 'react';

const AuroraCanvas = ({ colorPalette, musicMode, audioAnalyser, audioData }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const frameRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  
  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas to full screen
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Reinitialize particles when resizing
        initializeParticles();
      }, 200);
    };
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Get context
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'screen';
    contextRef.current = context;
    
    // Initialize particles
    initializeParticles();
    
    // Start animation
    startAnimation();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      
      cancelAnimationFrame(frameRef.current);
    };
  }, []);
  
  // Update when color palette changes
  useEffect(() => {
    updateParticleColors();
  }, [colorPalette]);
  
  // Initialize particles
  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: getRandomColor(),
        life: Math.random() * 0.5 + 0.5,
        originalLife: Math.random() * 0.5 + 0.5
      });
    }
    
    particlesRef.current = particles;
  };
  
  // Update particle colors based on selected palette
  const updateParticleColors = () => {
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].color = getRandomColor();
    }
  };
  
  // Get random color from palette
  const getRandomColor = () => {
    if (!colorPalette || colorPalette.length === 0) {
      return { r: 0, g: 255, b: 140, a: 0.5 };
    }
    
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      a: Math.random() * 0.5 + 0.2
    };
  };
  
  // Start animation loop
  const startAnimation = () => {
    const animate = () => {
      updateParticles();
      drawParticles();
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  // Update particles position and properties
  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const particles = particlesRef.current;
    
    // Get audio data if in music mode
    let audioFrequencyData = null;
    if (musicMode && audioAnalyser && audioData) {
      audioAnalyser.getByteFrequencyData(audioData);
      audioFrequencyData = audioData;
    }
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Apply mouse influence if active
      if (mouseRef.current.isActive) {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.05;
          p.speedX += dx * force;
          p.speedY += dy * force;
        }
      }
      
      // Apply audio influence if in music mode
      if (audioFrequencyData) {
        const audioIndex = Math.floor((i / particles.length) * audioFrequencyData.length);
        const audioValue = audioFrequencyData[audioIndex] / 255; // Normalize to 0-1
        
        if (audioValue > 0.5) {
          const force = (audioValue - 0.5) * 0.1;
          p.speedX += (Math.random() * 2 - 1) * force;
          p.speedY += (Math.random() * 2 - 1) * force;
          p.size = p.size * (1 + audioValue * 0.1);
        }
      }
      
      // Apply fluid dynamics
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Dampen speed
      p.speedX *= 0.99;
      p.speedY *= 0.99;
      
      // Add slight upward drift for aurora effect
      p.speedY -= 0.01;
      
      // Add slight random movement
      p.speedX += (Math.random() * 2 - 1) * 0.01;
      p.speedY += (Math.random() * 2 - 1) * 0.01;
      
      // Particle life cycle
      p.life -= 0.001;
      
      // Reset particles that are dead or out of bounds
      if (p.life <= 0 || 
          p.x < -50 || p.x > canvas.width + 50 || 
          p.y < -50 || p.y > canvas.height + 50) {
        
        // Reset position
        if (Math.random() < 0.5) {
          // Spawn from bottom
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 20;
        } else {
          // Spawn from sides
          p.x = Math.random() < 0.5 ? -20 : canvas.width + 20;
          p.y = Math.random() * canvas.height;
        }
        
        // Reset properties
        p.speedX = Math.random() * 2 - 1;
        p.speedY = Math.random() * 2 - 1;
        p.size = Math.random() * 2 + 1;
        p.color = getRandomColor();
        p.life = p.originalLife;
      }
    }
  };
  
  // Draw particles on canvas
  const drawParticles = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    // Clear canvas with fade effect
    context.fillStyle = 'rgba(0, 0, 5, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const particles = particlesRef.current;
    
    // Draw each particle
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Skip drawing particles with very low alpha
      if (p.color.a < 0.05) continue;
      
      context.beginPath();
      
      // Create gradient for particle
      const gradient = context.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 2
      );
      
      const alpha = p.color.a * (p.life / p.originalLife);
      
      gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
      
      context.fillStyle = gradient;
      context.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      context.fill();
    }
    
    // Draw connections between nearby particles for aurora effect
    drawConnections();
  };
  
  // Draw connections between nearby particles
  const drawConnections = () => {
    const context = contextRef.current;
    if (!context) return;
    
    const particles = particlesRef.current;
    const maxDistance = 100;
    
    context.globalCompositeOperation = 'lighter';
    
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2 * p1.life * p2.life;
          
          // Blend colors
          const r = Math.floor((p1.color.r + p2.color.r) / 2);
          const g = Math.floor((p1.color.g + p2.color.g) / 2);
          const b = Math.floor((p1.color.b + p2.color.b) / 2);
          
          context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          context.lineWidth = (p1.size + p2.size) * 0.3 * opacity;
          
          context.beginPath();
          context.moveTo(p1.x, p1.y);
          context.lineTo(p2.x, p2.y);
          context.stroke();
        }
      }
    }
    
    context.globalCompositeOperation = 'screen';
  };
  
  // Mouse event handlers
  const handleMouseMove = (e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };
  
  const handleMouseDown = () => {
    mouseRef.current.isActive = true;
  };
  
  const handleMouseUp = () => {
    mouseRef.current.isActive = false;
  };
  
  // Touch event handlers
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      mouseRef.current.x = e.touches[0].clientX;
      mouseRef.current.y = e.touches[0].clientY;
      mouseRef.current.isActive = true;
    }
  };
  
  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      mouseRef.current.x = e.touches[0].clientX;
      mouseRef.current.y = e.touches[0].clientY;
    }
  };
  
  const handleTouchEnd = () => {
    mouseRef.current.isActive = false;
  };
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default AuroraCanvas;
