'use client';

import { useState, useEffect, useRef } from 'react';

// Make sure to declare VANTA using `var` so it's globally available
// after the script loads.
declare var VANTA: any;

const AnimatedBackground = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Only initialize Vanta on the client-side.
    // The VANTA object might not be immediately available after the script loads.
    // We'll use an interval to check for it.
    if (typeof window !== 'undefined' && !vantaEffect) {
      const checkVanta = setInterval(() => {
        if (window.VANTA && window.VANTA.NET) {
          clearInterval(checkVanta); // Stop checking once VANTA is found
          setVantaEffect(
            VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              points: 12.0,
              maxDistance: 0, // Set to 0 to remove lines
              spacing: 15.0,
              color: 0x00eaff, // Neon Cyan
              backgroundColor: 0x0, // Black background for Vanta
            })
          );
        }
      }, 100); // Check every 100ms
    }

    // Cleanup function to destroy the Vanta effect when the component unmounts.
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default AnimatedBackground;
