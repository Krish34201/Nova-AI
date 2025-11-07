'use client';

import React from 'react';

const AnimatedBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        src="https://motionbgs.com/media/8778/heart-of-the-singularity.960x540.mp4"
      />
      <div className="absolute inset-0 w-full h-full bg-black/50" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
