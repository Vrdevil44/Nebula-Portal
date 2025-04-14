import '../styles/globals.css';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: () => element.classList.add('active'),
        onLeave: () => element.classList.remove('active'),
        onEnterBack: () => element.classList.add('active'),
        onLeaveBack: () => element.classList.remove('active'),
      });
    });
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
