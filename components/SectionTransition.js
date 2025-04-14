import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const SectionTransition = ({ children, id, className, style }) => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    if (!sectionRef.current) return;
    
    // Create a timeline for this section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom-=100",
        end: "bottom top+=100",
        toggleActions: "play none none reverse",
        markers: false,
      }
    });
    
    // Animate section background
    tl.fromTo(
      sectionRef.current,
      { 
        backgroundPosition: "50% 100%",
        opacity: 0.8
      },
      { 
        backgroundPosition: "50% 0%",
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      },
      0
    );
    
    // Animate section content
    const content = sectionRef.current.querySelector('.section-content');
    if (content) {
      tl.fromTo(
        content,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.2
      );
    }
    
    // Animate section title
    const title = sectionRef.current.querySelector('.section-title');
    if (title) {
      const chars = title.querySelectorAll('.char');
      if (chars.length) {
        tl.fromTo(
          chars,
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            stagger: 0.03, 
            duration: 0.8, 
            ease: "back.out(1.7)" 
          },
          0
        );
      } else {
        tl.fromTo(
          title,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0
        );
      }
    }
    
    // Create parallax effect for section elements
    const parallaxElements = sectionRef.current.querySelectorAll('.parallax');
    if (parallaxElements.length) {
      parallaxElements.forEach((element, index) => {
        const depth = element.getAttribute('data-depth') || (index + 1) * 0.2;
        
        gsap.fromTo(
          element,
          { y: 0 },
          {
            y: -50 * depth,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              markers: false,
            }
          }
        );
      });
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);
  
  // Split section title text into characters for animation
  useEffect(() => {
    const title = sectionRef.current?.querySelector('.section-title');
    if (!title) return;
    
    const text = title.innerText;
    const splitText = text.split('').map((char, i) => 
      `<span class="char" style="display:inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    title.innerHTML = splitText;
  }, []);
  
  // Section transition variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.5,
        ease: "easeIn"
      }
    }
  };
  
  return (
    <motion.section
      id={id}
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundSize: "200% 200%",
        ...style
      }}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      variants={sectionVariants}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Gradient overlay for smooth transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-blue/50 pointer-events-none"></div>
      
      {/* Section content wrapper */}
      <div className="section-content relative z-10">
        {children}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-deep-blue to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-deep-blue to-transparent pointer-events-none"></div>
    </motion.section>
  );
};

export default SectionTransition;
