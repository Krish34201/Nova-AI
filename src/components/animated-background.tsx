'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const AnimatedBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: Particle[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < -this.size) {
          this.y = height + this.size;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(204, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = (width * height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'hsl(222, 84%, 3%)');
      gradient.addColorStop(1, 'hsl(222, 84%, 8%)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
