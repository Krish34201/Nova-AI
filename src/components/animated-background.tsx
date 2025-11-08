'use client';

import React, { useRef, useEffect, memo, useCallback } from 'react';
import { useTheme } from 'next-themes';

// Utility to get HSL from CSS variable
const getHslFromCss = (variableName: string) => {
    if (typeof window === 'undefined') return { h: 0, s: 0, l: 0 };
    const style = getComputedStyle(document.documentElement);
    const hslString = style.getPropertyValue(variableName).trim();
    if (!hslString) return { h: 0, s: 0, l: 0 };
    const [h, s, l] = hslString.split(' ').map(parseFloat);
    return { h, s, l };
};

class Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  color: string;
  opacity: number;

  constructor(canvasWidth: number, canvasHeight: number, color: string) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1; // Smaller base size
    this.speedY = Math.random() * 0.5 + 0.1; // Slower upward speed
    this.color = color;
    this.opacity = Math.random() * 0.5 + 0.2; // Opacity for depth
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.y -= this.speedY;
    if (this.y < -this.size) {
      this.y = canvasHeight + this.size;
      this.x = Math.random() * canvasWidth;
    }
  }
}

class AuroraParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  decay: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 2;
    this.opacity = 1;
    this.decay = Math.random() * 0.015 + 0.01;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.opacity -= this.decay;
    return this.opacity > 0;
  }
}

const AnimatedBackgroundComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const createAnimation = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    let particles: Particle[] = [];
    let auroraParticles: AuroraParticle[] = [];
    let animationFrameId: number;
    let primaryColorHsl: { h: number, s: number, l: number };
    let secondaryColorHsl: { h: number, s: number, l: number };

    const mouse = { x: Infinity, y: Infinity };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      
      primaryColorHsl = getHslFromCss('--primary');
      secondaryColorHsl = getHslFromCss('--secondary');

      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / (dpr * dpr * 20000));
      for (let i = 0; i < numParticles; i++) {
        const colorH = Math.random() < 0.2 ? secondaryColorHsl.h : primaryColorHsl.h;
        const color = `hsl(${colorH}, 100%, 75%)`;
        particles.push(new Particle(canvas.width / dpr, canvas.height / dpr, color));
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      
      const colorH = Math.random() < 0.5 ? primaryColorHsl.h : secondaryColorHsl.h;
      const color = `hsl(${colorH}, 100%, 80%)`;
      auroraParticles.push(new AuroraParticle(mouse.x, mouse.y, color));
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;

      // Draw main particles
      particles.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });

      // Draw and update aurora particles
      auroraParticles = auroraParticles.filter(p => {
        p.draw(ctx);
        return p.update();
      });
      
      // Reset global alpha and shadow blur after drawing all particles
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    let cleanup: () => void = () => {};
    if (canvasRef.current) {
      cleanup = createAnimation(canvasRef.current);
    }
    return cleanup;
  }, [createAnimation, resolvedTheme]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-background">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <canvas ref={canvasRef} className="opacity-50 w-full h-full" />
    </div>
  );
};

AnimatedBackgroundComponent.displayName = 'AnimatedBackground';
const AnimatedBackground = memo(AnimatedBackgroundComponent);
export default AnimatedBackground;
