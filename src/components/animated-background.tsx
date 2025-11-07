'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const AnimatedBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const dotsRef = useRef<Dot[]>([]);

  const initializeDots = useCallback((width: number, height: number) => {
    const newDots: Dot[] = [];
    const gridSize = 50; // Increased grid size for fewer dots
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        newDots.push({ 
          x: x + Math.random() * gridSize, 
          y: y + Math.random() * gridSize,
          vx: (Math.random() - 0.5) * 0.2, // Slower velocity
          vy: (Math.random() - 0.5) * 0.2
        });
      }
    }
    dotsRef.current = newDots;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, theme: string | undefined) => {
    const backgroundColor = 'hsl(222 84% 4.9%)';
    const accentColor = 'hsl(204 100% 50%)'; // Electric Blue from theme
    const canvas = ctx.canvas;
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dotSize = 2;
    const lineThreshold = 120;
    
    const dots = dotsRef.current;

    // Update dot positions
    dots.forEach(dot => {
      dot.x += dot.vx;
      dot.y += dot.vy;

      if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
    });
    
    // Set up glow effect for lines and dots
    ctx.shadowBlur = 10;
    ctx.shadowColor = accentColor;

    ctx.strokeStyle = `rgba(0, 191, 255, 0.15)`;
    ctx.lineWidth = 0.5;

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < lineThreshold) {
          const opacity = 1 - (distance / lineThreshold);
          ctx.strokeStyle = `rgba(0, 191, 255, ${opacity * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
    });

    // Reset shadow for other canvas drawings if any
    ctx.shadowBlur = 0;

  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    let animationFrameId: number;
    
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeDots(canvas.width, canvas.height);
    };

    const render = () => {
      draw(context, resolvedTheme);
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    setup();
    render();

    const handleResize = () => {
        setup();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [draw, resolvedTheme, initializeDots]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-background">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
