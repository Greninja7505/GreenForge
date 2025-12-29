/**
 * Smooth Scroll Provider using Lenis
 * Provides buttery smooth scrolling experience
 */

import { useEffect, useRef } from 'react';
// import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    /* 
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,           // Scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      orientation: 'vertical', // Scroll orientation
      gestureOrientation: 'vertical',
      smoothWheel: true,       // Smooth wheel scrolling
      wheelMultiplier: 1,      // Wheel scroll multiplier
      touchMultiplier: 2,      // Touch scroll multiplier
      infinite: false,         // Infinite scroll
    });

    // Animation frame loop
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    */
  }, []);

  return children;
};

export default SmoothScroll;
