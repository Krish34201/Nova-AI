'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

const AnimatedBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[];

    const options = {
      particleColor: "hsl(204, 100%, 50%)",
      particleCount: 70,
      minRadius: 1,
      maxRadius: 3,
    };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;

      constructor() {
        this.radius = Math.random() * (options.maxRadius - options.minRadius) + options.minRadius;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height + canvas.height; // Start below the screen
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -(Math.random() * 1 + 0.2); // Move upwards
        this.opacity = this.radius / options.maxRadius * 0.8;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(204, 255, 255, ${this.opacity})`;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y < -this.radius || this.x < -this.radius || this.x > canvas.width + this.radius) {
          // Reset particle to the bottom
          this.radius = Math.random() * (options.maxRadius - options.minRadius) + options.minRadius;
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + this.radius;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = -(Math.random() * 1 + 0.2);
          this.opacity = this.radius / options.maxRadius * 0.8;
        }
      }
    }

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < options.particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 14, 25, 0.1)');
      gradient.addColorStop(1, 'rgba(10, 14, 25, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);


      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    
    const startAnimation = () => {
        setCanvasSize();
        createParticles();
        animate();
    }

    startAnimation();

    window.addEventListener('resize', setCanvasSize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [resolvedTheme]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-background">
      <canvas ref={canvasRef} className="w-full h-full" />
       <div className="absolute inset-0 w-full h-full bg-black/50" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
