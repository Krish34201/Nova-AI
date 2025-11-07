'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

type Mouse = {
  x: number | null;
  y: number | null;
  radius: number;
};

const AnimatedBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef<Mouse>({ x: null, y: null, radius: 150 });
  const animationFrameId = useRef<number>();

  const initializeDots = useCallback((width: number, height: number) => {
    const newDots: Dot[] = [];
    const numberOfDots = Math.floor((width * height) / 9000); 
    for (let i = 0; i < numberOfDots; i++) {
      newDots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 1,
      });
    }
    dotsRef.current = newDots;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    const dots = dotsRef.current;
    const mouse = mouseRef.current;
    
    const accentColor = 'hsl(204 100% 50%)';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw dots
    dots.forEach(dot => {
      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 0.5; // Adjust repulsion strength
          const directionY = forceDirectionY * force * 0.5;
          dot.vx += directionX;
          dot.vy += directionY;
        }
      }

      // Add some friction
      dot.vx *= 0.98;
      dot.vy *= 0.98;

      // Move particles
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Wall collision
      if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
    });

    // Draw lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const lineThreshold = 120;
        if (distance < lineThreshold) {
          const opacity = 1 - (distance / lineThreshold);
          ctx.strokeStyle = `rgba(0, 191, 255, ${opacity * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    draw(context);
    animationFrameId.current = window.requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeDots(canvas.width, canvas.height);
      }
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };
    
    const handleMouseOut = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    handleResize(); // Initial setup
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [animate, initializeDots]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-background">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
