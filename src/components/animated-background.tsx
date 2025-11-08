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
    if (typeof window !== 'undefined') {
      const checkVanta = setInterval(() => {
        if (typeof window !== 'undefined' && window.VANTA && window.VANTA.NET) {
          clearInterval(checkVanta); // Stop checking once VANTA is found
          if (!vantaEffect) {
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
                points: 16.0,
                maxDistance: 0,
                spacing: 18.0,
                color: 0x00ffff, // Bright Cyan
                backgroundColor: 0x000020,
              })
            );
          }
        }
      }, 100); // Check every 100ms

      // Cleanup function to stop checking if the component unmounts
      return () => clearInterval(checkVanta);
    }
  }, [vantaEffect]); // Re-run if vantaEffect changes

  // Cleanup function to destroy the Vanta effect when the component unmounts.
  useEffect(() => {
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
