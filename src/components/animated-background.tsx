'use client';

import React from 'react';

const AnimatedBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
        src="https://cdn.pixabay.com/video/2017/11/02/12716-241674181_large.mp4"
      />
      <div className="absolute inset-0 w-full h-full bg-black/60" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
