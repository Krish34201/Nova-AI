'use client';

import React, { useEffect, useState } from 'react';

const AnimatedBackground = React.memo(() => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const particleCount = 100;
  const particles = Array.from({ length: particleCount });

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-background">
      <div className="particle-container">
        {particles.map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
