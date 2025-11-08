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
        src="https://cdn.pixabay.com/video/2024/03/07/203336-920723750_large.mp4"
      />
      <div className="absolute inset-0 w-full h-full bg-black/50" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
