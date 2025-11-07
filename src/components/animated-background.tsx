'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

const AnimatedBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const draw = useCallback((ctx: CanvasRenderingContext2D, frameCount: number, theme: string | undefined) => {
    const primaryColor = theme === 'dark' ? 'hsl(204 100% 50%)' : 'hsl(204 100% 50%)'; // Electric Blue
    const backgroundColor = theme === 'dark' ? 'hsl(222 84% 4.9%)' : 'hsl(222 84% 4.9%)';

    const canvas = ctx.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 40;
    const dotSize = 1;
    const lineThreshold = 100;
    
    const dots = [];
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        dots.push({ x, y });
      }
    }
    
    ctx.strokeStyle = `rgba(0, 191, 255, 0.1)`;
    ctx.lineWidth = 0.5;

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < lineThreshold) {
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
      ctx.fillStyle = `rgba(0, 191, 255, 0.5)`;
      ctx.fill();
    });

  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      frameCount++;
      draw(context, frameCount, resolvedTheme);
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw(context, frameCount, resolvedTheme);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [draw, resolvedTheme]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-background">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
