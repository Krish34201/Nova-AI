'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const AnimatedBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: Infinity, y: Infinity });

  const handleMouseMove = (event: MouseEvent) => {
    mouse.current.x = event.clientX;
    mouse.current.y = event.clientY;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, frame: number, particles: Particle[]) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.update(mouse.current, width, height);
      p.draw(ctx);
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = 1 - (distance / 120);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(180, 100%, 50%, ${opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const primaryColorH = 180;
      const secondaryColorH = 280;

      particles = [];
      const numParticles = Math.floor(canvas.width * canvas.height / 25000);
      for (let i = 0; i < numParticles; i++) {
        const colorH = Math.random() < 0.2 ? secondaryColorH : primaryColorH;
        particles.push(new Particle(canvas.width, canvas.height, colorH));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let frame = 0;
    const render = () => {
      frame++;
      draw(ctx, frame, particles);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-background">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <canvas ref={canvasRef} className="opacity-40" />
    </div>
  );
});

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  colorH: number;

  constructor(canvasWidth: number, canvasHeight: number, colorH: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
    this.colorH = colorH;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `hsl(${this.colorH}, 100%, ${70 + Math.random() * 10}%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // Soft glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${this.colorH}, 100%, 50%)`;
  }

  update(mouse: { x: number; y: number }, canvasWidth: number, canvasHeight: number) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = 100;
    const force = (maxDistance - distance) / maxDistance;

    const directionX = forceDirectionX * force * this.density;
    const directionY = forceDirectionY * force * this.density;

    if (distance < maxDistance) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
    
    // Add subtle drift
    this.baseY -= 0.1;
    if (this.baseY < 0) this.baseY = canvasHeight;

    this.y -= 0.1;
    if (this.y < 0) {
        this.y = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.baseX = this.x;
        this.baseY = this.y;
    }
  }
}

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;
